export interface ScheduleType {
	lessons: ILesson[];
	dayTitle: string;
}

export interface ILesson {
	time: ILessonTime;
	title: string;
	link: string;
}

export interface ILessonTime {
	hour: string | number;
	minute: string | number;
}

export interface IDayTime {
	month: string | number;
	day: string | number;
}
