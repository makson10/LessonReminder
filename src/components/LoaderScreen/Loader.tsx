export default function Loader() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="relative w-[60px] h-[60px] before:absolute before:top-0 before:left-0 rounded-full border-[9px] border-[#eee] border-t-[--pink-loader-color] animate-spin before:w-[60px] before:h-[60px] dark:border-t-[--blue-loader-color]"></div>
		</div>
	);
}
