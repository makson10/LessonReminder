import { useEffect } from 'react';
import LessonList from './components/LessonsList/LessonsList';
import LoaderScreen from './components/LoaderScreen/LoaderScreen';
import useSWR from 'swr';
import axios from 'axios';
import { setDefaultStoreSettings } from './context/settings/setSettingsFunctions';

const fetcher = (url: string) =>
	axios.get(url).then(async (res) => {
		await setDefaultStoreSettings();
		return res.data;
	});

const refreshInterval = 5 * 60 * 1000;

export default function App() {
	const {
		data: lessonsSchedule,
		error,
		isLoading,
	} = useSWR(import.meta.env.VITE_MEDIATOR_BASE_URL + 'lessons', fetcher, {
		refreshInterval,
	});

	useEffect(() => {
		const handleTabPressed = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				event.preventDefault();
			}
		};

		window.addEventListener('keydown', handleTabPressed);

		return () => {
			window.removeEventListener('keydown', handleTabPressed);
		};
	}, []);

	if (isLoading) return <LoaderScreen />;
	if (error) return <p>Error</p>;
	if (lessonsSchedule) return <LessonList lessonsSchedule={lessonsSchedule} />;
	return <p>Something went wrong!</p>;
}
