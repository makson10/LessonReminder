import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useNotificaion from './useNotification';
import useFormatData from './useFormatData';
import { RootState } from '@/context/settings/store';
import { ILesson } from '@/types/lessonTypes';
import axios from 'axios';
import fs from 'fs/promises';
const cron = require('node-cron');

const informaticGroupRegex = /[$-/][1-2][$-/]/gm;

export default function useScheduledReminder(lesson: ILesson) {
	const didMount = useRef(false);
	const settings = useSelector((state: RootState) => state.settings);
	const date = new Date();

	const {
		formattingTimeToFirstNotification,
		formattingTimeToSecondNotification,
	} = useFormatData();

	const { createFirstNotification, createSecondNotification } =
		useNotificaion(lesson);

	const extractlessonInformaticGroup = () => {
		let informaticGroupTextFragment =
			lesson.title.match(informaticGroupRegex)![0];
		informaticGroupTextFragment = informaticGroupTextFragment
			.replace('(', '')
			.replace(')', '');

		return +informaticGroupTextFragment;
	};

	const getAccounts = async () => {
		const accounts = await axios
			.get(import.meta.env.VITE_MEDIATOR_BASE_URL + 'accounts')
			.then((res) => res.data);

		return accounts;
	};

	const getAppId = async () => {
		const appIdFileContent = await fs.readFile('./appId.json', 'utf-8');
		const appId = await JSON.parse(appIdFileContent).appId;

		return appId;
	};

	const getUserAccount = async () => {
		const accounts = await getAccounts();
		const appId = await getAppId();

		const userAccount = accounts.find(
			(account: any) => account.appId === appId
		);
		return userAccount;
	};

	const getUserInformaticGroup = async () => {
		const userAccount = await getUserAccount();
		return userAccount['informaticGroup'];
	};

	const checkNeedToSendNotificationByInformaticGroup = async () => {
		if (!lesson.title.match(informaticGroupRegex)) return true;

		const lessonInformaticGroup = extractlessonInformaticGroup();
		const userInformaticGroup: number = await getUserInformaticGroup();

		return lessonInformaticGroup === userInformaticGroup;
	};

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}

		if (settings.disableNotifications) return;
		if (date.getDay() === 0 || date.getDay() === 6) return;
		console.log(lesson.time);

		let task: any;

		const scheduleFirseNotification = async () => {
			if (!(await checkNeedToSendNotificationByInformaticGroup())) return;

			const timeToFirstNotification = formattingTimeToFirstNotification(
				lesson.time
			);

			task = cron.schedule(
				`0-59 ${timeToFirstNotification.minute} ${timeToFirstNotification.hour} * * *`,
				() => {
					createFirstNotification();
					setTimeout(() => {
						task.stop();
					}, 1000);
				}
			);
		};

		scheduleFirseNotification();
		return () => task?.stop();
	}, [settings.disableNotifications, lesson.time]);

	useEffect(() => {
		if (!didMount.current) {
			didMount.current = true;
			return;
		}

		if (settings.disableNotifications || !settings.showSecondNotification)
			return;
		if (date.getDay() === 0 || date.getDay() === 6) return;

		let task2: any;

		const scheduleSecondNotification = async () => {
			if (!(await checkNeedToSendNotificationByInformaticGroup())) return;

			const timeToSecondNotification = formattingTimeToSecondNotification(
				lesson.time
			);

			task2 = cron.schedule(
				`0-59 ${timeToSecondNotification.minute} ${timeToSecondNotification.hour} * * *`,
				() => {
					createSecondNotification();
					setTimeout(() => {
						task2.stop();
					}, 1000);
				}
			);
		};

		scheduleSecondNotification();
		return () => task2?.stop();
	}, [
		settings.disableNotifications,
		settings.showSecondNotification,
		lesson.time,
	]);
}
