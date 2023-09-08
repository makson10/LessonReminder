import SettingsMenu from '@/components/SettingsMenu/SettingsMenu';
import { RootState } from '@/context/settings/store';
import { useSelector } from 'react-redux';

interface Props {
	title: string;
}

export default function ListHeader({ title }: Props) {
	const settings = useSelector((state: RootState) => state.settings);

	return (
		<div className="flex flex-row justify-between">
			<p
				className={`z-[5] w-fit text-[1.2rem] px-1 ${
					settings.showGeometricPatterns &&
					'bg-transparent/30 dark:bg-transparent'
				}`}>
				{title.length > 20 ? title.slice(0, 20) + '...' : title}
			</p>
			<SettingsMenu />
		</div>
	);
}
