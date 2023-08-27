import { useEffect, useRef, useState, LegacyRef } from 'react';
import { shell } from 'electron';
const cron = require('node-cron');
import useNotificaion from '@/hooks/useNotification';
import {
	formattingTimeToFirstNotification,
	formattingTimeToSecondNotification,
	checkLessonTimeState,
} from '@/assets/formattingData';
import { ILesson, IDayTime } from '../../types/lessonTypes';
import styles from '@/styles/LessonRow.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/settings/store';

interface Props {
	lessonData: ILesson;
	dayTime: IDayTime;
}

export default function LessonRow({ lessonData, dayTime }: Props) {
	const [lesson, setLesson] = useState(lessonData);
	const settings = useSelector((state: RootState) => state.settings);

	const { createFirstNotification, createSecondNotification } = useNotificaion(
		lesson,
		settings.leaveNotificationOpen
	);

	const [didLessonStart, setDidLessonStart] = useState<boolean>(false);
	const [didLessonEnd, setDidLessonEnd] = useState<boolean>(false);

	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const clickSoundRef = useRef<HTMLAudioElement>();
	const date = new Date();

	const handleClickLink = () => {
		clickSoundRef?.current?.play();
		shell.openExternal(lesson.link);
	};

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
	}, [settings.disableNotifications]);

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
	}, [settings.disableNotifications, settings.showSecondNotification]);

	useEffect(() => {
		if (!+dayTime.day) return;

		const lessonTimeState = checkLessonTimeState(lesson.time, dayTime);
		setDidLessonStart(lessonTimeState.start);
		setDidLessonEnd(lessonTimeState.end);
	}, [lesson.time, dayTime]);

	useEffect(() => {
		if (lesson.time.hour.toString().length === 1) {
			setLesson({
				...lesson,
				time: { ...lesson.time, hour: '0' + lesson.time.hour },
			});
		}
	}, [lesson.time]);

	useEffect(() => {
		if (!lesson.link) return setIsDisabled(true);
		const lessonLink = lesson.link.trim();

		if (typeof lessonLink !== 'string' || lessonLink.slice(0, 4) !== 'http') {
			setIsDisabled(true);
		}
	}, [lesson.link]);

	useEffect(() => {
		setLesson(lessonData);
	}, [lessonData]);

	return (
		<>
			<audio
				id="click-sound-1"
				ref={clickSoundRef as LegacyRef<HTMLAudioElement>}>
				<source src="./click-sound-1.mp3" type="audio/mpeg" />
			</audio>
			<div
				className={`w-[280px] flex flex-row gap-[10px] border-none rounded-2xl p-[0.4rem] pr-[0.8rem] ${
					didLessonStart
						? 'bg-[--third-pink-start-color] dark:bg-[--third-blue-start-color]'
						: didLessonEnd
						? 'bg-[--third-pink-end-color] dark:bg-[--third-blue-end-color]'
						: 'bg-[--pink-third-color] dark:bg-[--blue-third-color]'
				}`}>
				<div
					className={`rounded-2xl px-[0.6rem] py-[0.4rem] ${
						didLessonStart
							? 'bg-[--fourth-pink-start-color] text-[black] dark:bg-[--fourth-blue-start-color]'
							: didLessonEnd
							? 'bg-[--fourth-pink-end-color] dark:bg-[--fourth-blue-end-color]'
							: 'bg-[--pink-fourth-color] dark:bg-[--blue-fourth-color]'
					}`}>
					<p>
						{lesson.time.hour}:{lesson.time.minute}
					</p>
				</div>
				<div className="w-full text-center flex justify-center items-center">
					<p>{lesson.title}</p>
				</div>
				<div className="flex justify-center">
					<button
						className={styles.linkButton}
						onClick={handleClickLink}
						disabled={isDisabled}>
						<img
							className={`w-[24px] h-[24px] ${
								isDisabled && 'opacity-60'
							} focus-visible:outline-none`}
							src="./leave-icon.png"
							alt="#"
						/>
					</button>
				</div>
			</div>
		</>
	);
}