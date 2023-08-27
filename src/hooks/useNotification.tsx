import { shell } from 'electron';
import { ILesson } from '@/types/lessonTypes';

export default function useNotificaion(
	lesson: ILesson,
	leaveNotificationOpen: boolean
) {
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
			requireInteraction: leaveNotificationOpen,
		});

		notification.onclick = () => {
			shell.openExternal(lesson.link);
		};
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
