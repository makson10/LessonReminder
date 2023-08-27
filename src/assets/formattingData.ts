import { ILessonTime, IDayTime } from '@/types/lessonTypes';
const currentDate = new Date();

const formattingTimeToFirstNotification = (lessonTime: ILessonTime) => {
	const timeToNotification = { ...lessonTime };

	if (timeToNotification.minute === '00' || timeToNotification.minute === 0) {
		timeToNotification.hour = +timeToNotification.hour - 1;
		timeToNotification.minute = '60';
	}

	if (timeToNotification.minute === '01' || timeToNotification.minute === 1) {
		timeToNotification.hour = +timeToNotification.hour - 1;
		timeToNotification.minute = '61';
	}

	timeToNotification.minute = +timeToNotification.minute - 2;

	return timeToNotification;
};

const formattingTimeToSecondNotification = (lessonTime: ILessonTime) => {
	const timeToNotification = {
		minute: +lessonTime.minute + 2,
		hour: +lessonTime.hour,
	};

	if (timeToNotification.minute >= 60) {
		timeToNotification.hour = +timeToNotification.hour + 1;
		timeToNotification.minute = timeToNotification.minute - 60;
	}

	return timeToNotification;
};

const checkLessonTimeState = (lessonTime: ILessonTime, dayTime: IDayTime) => {
	let didLessonStart = false;
	let didLessonEnd = false;

	const lessonStartTime = new Date(
		currentDate.getFullYear(),
		+dayTime.month - 1,
		+dayTime.day,
		+lessonTime.hour,
		+lessonTime.minute
	);

	const lessonEndTime = new Date(
		currentDate.getFullYear(),
		+dayTime.month - 1,
		+dayTime.day,
		+lessonTime.hour,
		+lessonTime.minute + 45
	);

	if (currentDate >= lessonStartTime && currentDate < lessonEndTime) {
		didLessonStart = true;
		didLessonEnd = false;
	}

	if (currentDate > lessonStartTime && currentDate >= lessonEndTime) {
		didLessonStart = false;
		didLessonEnd = true;
	}

	return {
		start: didLessonStart,
		end: didLessonEnd,
	};
};

export {
	formattingTimeToFirstNotification,
	formattingTimeToSecondNotification,
	checkLessonTimeState,
};
