import { useSelector } from 'react-redux';
import { RootState } from '@/context/settings/store';
import { ILesson } from '@/types/lessonTypes';
import { shell } from 'electron';
import axios from 'axios';
import fs from 'fs/promises';

export default function useNotificaion(lesson: ILesson) {
	const settings = useSelector((state: RootState) => state.settings);

	const displayNotification = (
		notificationTitle: string,
		notificationBody: string
	) => {
		if (Notification.permission === 'denied') {
			Notification.requestPermission().then((permission) => {
				if (permission !== 'granted') return;
			});
		}

		const notification = new Notification(notificationTitle, {
			body: notificationBody,
			icon: './app-icon.png',
			requireInteraction: settings.leaveNotificationOpen,
		});

		const getUserChatId = async () => {
			const appId = await readAppIdFromFile();
			const userChatId = await axios
				.post(
					import.meta.env.VITE_MEDIATOR_BASE_URL + 'accounts/getuserchatid',
					{ appId }
				)
				.then((res) => res.data.userChatId);

			return userChatId;
		};

		const readAppIdFromFile = async () => {
			const fileData = await fs.readFile('appId.json', 'utf-8');
			const parsedFileData = await JSON.parse(fileData);

			return parsedFileData.appId;
		};

		const sendReminderInTelegramTimeout = setTimeout(async () => {
			if (!settings.sendTelegramMessage) return;

			const didLessonStart = /начался/.test(notificationBody);

			const message =
				'Урок ' +
				(lesson.link ? `<a href='${lesson.link}'>` : '') +
				lesson.title.trim() +
				(lesson.link ? '</a>' : '') +
				(didLessonStart ? ' начался пару минут назад' : ' уже начался');

			const preparedMessageForSending = message.replaceAll(' ', '%20');
			const chatId = await getUserChatId();

			await axios.get(
				`https://api.telegram.org/bot${
					import.meta.env.VITE_TELEGRAM_BOT_TOKEN
				}/sendMessage?chat_id=${chatId}&text=${preparedMessageForSending}&parse_mode=HTML&disable_web_page_preview=true`
			);
		}, 2 * 1000);

		notification.onclick = () => {
			clearTimeout(sendReminderInTelegramTimeout);

			if (lesson.link) {
				shell.openExternal(lesson.link);
			}
		};

		notification.onclose = () => clearTimeout(sendReminderInTelegramTimeout);
		return () => clearTimeout(sendReminderInTelegramTimeout);
	};

	const createFirstNotification = () => {
		const notificationTitle = 'Скоро начнется урок';
		const notificationBody = `Урок ${lesson.title.trim()} начинается через пару минут`;

		displayNotification(notificationTitle, notificationBody);
	};

	const createSecondNotification = () => {
		const notificationTitle = 'Урок уже начался';
		const notificationBody = `Урок ${lesson.title.trim()} начался пару минут назад`;

		displayNotification(notificationTitle, notificationBody);
	};

	return { createFirstNotification, createSecondNotification };
}
