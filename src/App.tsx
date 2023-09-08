import { useEffect } from 'react';
import LessonList from './components/LessonsList/LessonsList';
import LoaderScreen from './components/LoaderScreen/LoaderScreen';
import useSWR from 'swr';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { autoUpdater } from 'electron-updater';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
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

	useEffect(() => {
		ipcRenderer.on('update_available', () => {
			ipcRenderer.removeAllListeners('update_available');

			const updateMessage = document.createElement('p');
			updateMessage.innerText = 'UpdateAvailable';

			document.body.appendChild(updateMessage);
			console.log('UpdateAvailable');
		});

		ipcRenderer.on('update_downloaded', () => {
			ipcRenderer.removeAllListeners('update_downloaded');

			const updateMessage = document.createElement('p');
			updateMessage.innerText = 'UpdateDownloaded';

			document.body.appendChild(updateMessage);
			console.log('UpdateDownloaded');

			ipcRenderer.send('restart_app');
		});
	}, []);

	if (isLoading) return <LoaderScreen />;
	if (error) return <p>Error</p>;
	if (lessonsSchedule) return <LessonList lessonsSchedule={lessonsSchedule!} />;
	return <p>Something went wrong!</p>;
}
