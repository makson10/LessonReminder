import { useEffect, useState } from 'react';
import LessonSection from './LessonsSection';
import List from './List/List';
import LessonRow from '@/components/LessonRow/LessonRow';
import { IDayTime, ScheduleType } from '@/types/lessonTypes';
import LoginWindow from '../LoginWindow/LoginWindow';
import { ipcRenderer } from 'electron';
import fs from 'fs';

interface Props {
	lessonsSchedule: ScheduleType;
}

const dayTimeInitialValue = {
	month: '01',
	day: '01',
};

export default function LessonList({ lessonsSchedule }: Props) {
	const [shouldShowLoginWindow, setShouldShowLoginWindow] =
		useState<boolean>(false);
	const [dayTime, setDayTime] = useState<IDayTime>(dayTimeInitialValue);
	const [appVersion, setAppVersion] = useState('1.0.0');

	useEffect(() => {
		ipcRenderer.send('get-app-version');

		ipcRenderer.on('app-version', (event, version) => {
			setAppVersion(version);
		});
	}, []);

	useEffect(() => {
		const checkIfAppIdExist = async () => {
			if (!fs.existsSync('./appId.json')) setShouldShowLoginWindow(true);

			fs.readFile('./appId.json', 'utf-8', (err, data) => {
				if (err) return setShouldShowLoginWindow(true);

				try {
					const fileData = JSON.parse(data);
					const appId = fileData.appId;

					if (!appId || typeof appId !== 'string')
						throw new Error("Don't have a valid appId");
				} catch (error) {
					setShouldShowLoginWindow(true);
				}
			});
		};

		checkIfAppIdExist();
	}, []);

	useEffect(() => {
		const dateInDayTitle = lessonsSchedule.dayTitle.match(/\d+/g);

		if (dateInDayTitle) {
			setDayTime({ month: dateInDayTitle[1], day: dateInDayTitle[0] });
		}
	}, [lessonsSchedule]);

	return (
		<>
			{shouldShowLoginWindow && (
				<LoginWindow setShouldShowLoginWindow={setShouldShowLoginWindow} />
			)}
			<LessonSection>
				<p className="absolute bottom-[4px] left-[6px] opacity-30">
					version: {appVersion}
				</p>
				<List title={lessonsSchedule.dayTitle}>
					{lessonsSchedule.lessons.map((lesson, index) => {
						return (
							<LessonRow key={index} lessonData={lesson} dayTime={dayTime} />
						);
					})}
				</List>
			</LessonSection>
		</>
	);
}
