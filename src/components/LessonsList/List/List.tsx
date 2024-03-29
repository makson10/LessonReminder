import { ReactNode } from 'react';
import ListHeader from './ListHeader';
import GeometricPatterns from './GeometricPatterns';
import { RootState } from '@/context/settings/store';
import { useSelector } from 'react-redux';

interface Props {
	children: ReactNode;
	title: string;
}

export default function List({ children, title }: Props) {
	const settings = useSelector((state: RootState) => state.settings);

	return (
		<>
			<ListHeader title={title} />
			<div className="z-[5] flex-[2_1_auto] flex justify-center items-center">
				<div className="flex flex-col gap-[10px] justify-center items-center">
					{children}
				</div>
			</div>
			{!settings.isDarkTheme && settings.showGeometricPatterns && (
				<GeometricPatterns />
			)}
		</>
	);
}
