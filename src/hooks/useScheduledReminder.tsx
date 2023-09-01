import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useNotificaion from './useNotification';
import useFormatData from './useFormatData';
import { RootState } from '@/context/settings/store';
import { ILesson } from '@/types/lessonTypes';
const cron = require('node-cron');

export default function useScheduledReminder(lesson: ILesson) {
	const settings = useSelector((state: RootState) => state.settings);
	const date = new Date();

	const {
		formattingTimeToFirstNotification,
		formattingTimeToSecondNotification,
	} = useFormatData();

	const { createFirstNotification, createSecondNotification } = useNotificaion(
		lesson,
		settings.leaveNotificationOpen
	);

	useEffect(() => {
		if (settings.disableNotifications) return;
		if (date.getDay() === 0 || date.getDay() === 6) return;

		const timeToFirstNotification = formattingTimeToFirstNotification(
			lesson.time
		);

		const task = cron.schedule(
			`0-59 ${timeToFirstNotification.minute} ${timeToFirstNotification.hour} * * *`,
			() => {
				createFirstNotification();
				setTimeout(() => {
					task.stop();
				}, 1000);
			}
		);

		return () => {
			task.stop();
		};
	}, [settings.disableNotifications, lesson.time]);

	useEffect(() => {
		if (settings.disableNotifications || !settings.showSecondNotification)
			return;
		if (date.getDay() === 0 || date.getDay() === 6) return;

		const timeToSecondNotification = formattingTimeToSecondNotification(
			lesson.time
		);

		const task2 = cron.schedule(
			`0-59 ${timeToSecondNotification.minute} ${timeToSecondNotification.hour} * * *`,
			() => {
				createSecondNotification();
				setTimeout(() => {
					task2.stop();
				}, 1000);
			}
		);

		return () => {
			task2.stop();
		};
	}, [
		settings.disableNotifications,
		settings.showSecondNotification,
		lesson.time,
	]);
}
