import LessonList from './components/LessonsList/LessonsList';
import LoaderScreen from './components/LoaderScreen/LoaderScreen';
import axios from 'axios';
import useSWR from 'swr';

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

	if (isLoading) return <LoaderScreen />;
	if (error) return <p>Error</p>;
	if (lessonsSchedule) return <LessonList lessonsSchedule={lessonsSchedule!} />;
	return <p>Something went wrong!</p>;
}
