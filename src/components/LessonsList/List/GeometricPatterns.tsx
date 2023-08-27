import { useState, useEffect } from 'react';

export default function GeometricPatterns() {
	const [activeGeometricPatterns, setActiveGeometricPatterns] = useState(0);

	useEffect(() => {
		const changeActiveGeometricPatternsInterval = setInterval(() => {
			setActiveGeometricPatterns((prevValue) => (prevValue ? 0 : 1));
		}, 5 * 60 * 1000);

		return () => {
			clearInterval(changeActiveGeometricPatternsInterval);
		};
	}, []);

	return (
		<>
			<div
				className={`transition-all ${
					activeGeometricPatterns
						? 'hidden opacity-0'
						: 'block opacity-100 absolute bottom-6 left-1/10'
				}`}>
				<img
					className="w-[270px] h-[400px]"
					src="./geometricPatterns/cat.png"
					alt="#"
				/>
			</div>
			<div
				className={`transition-all ${
					!activeGeometricPatterns
						? 'hidden opacity-0'
						: 'block opacity-100 absolute top-0 left-0'
				}`}>
				<img
					className="w-screen h-screen"
					src="./geometricPatterns/leaves.png"
					alt="#"
				/>
			</div>
		</>
	);
}
