import { useEffect, useState } from 'react';
import LessonSection from './LessonsSection';
import List from './List/List';
import LessonRow from '@/components/LessonRow/LessonRow';
import { IDayTime, ScheduleType } from '@/types/lessonTypes';

interface Props {
	lessonsSchedule: ScheduleType;
}

const dayTimeInitialValue = {
	month: '01',
	day: '01',
};

export default function LessonList({ lessonsSchedule }: Props) {
	const [dayTime, setDayTime] = useState<IDayTime>(dayTimeInitialValue);

	useEffect(() => {
		const dateInDayTitle = lessonsSchedule.dayTitle.match(/\d+/g);

		if (dateInDayTitle) {
			setDayTime({ month: dateInDayTitle[1], day: dateInDayTitle[0] });
		}
	}, [lessonsSchedule]);

	return (
		<LessonSection>
			<List title={lessonsSchedule.dayTitle}>
				{lessonsSchedule.lessons.map((lesson, index) => {
					return (
						<LessonRow key={index} lessonData={lesson} dayTime={dayTime} />
					);
				})}
			</List>
		</LessonSection>
	);
}
