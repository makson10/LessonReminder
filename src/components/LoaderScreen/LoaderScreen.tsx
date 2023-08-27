import Loader from './Loader';

export default function LoaderScreen() {
	return (
		<div className="min-h-full flex justify-center items-center bg-[--pink-main-color] dark:bg-[--blue-main-color]">
			<Loader />
		</div>
	);
}
