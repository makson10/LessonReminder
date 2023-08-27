import Section from '../components/Section';
import sliderStyle from '@/styles/slider.module.scss';
import { RootState } from '@/context/settings/store';
import { useSelector, useDispatch } from 'react-redux/es/exports';
import { toggleSetting } from '@/context/settings/slice';
import { ipcRenderer } from 'electron';
import Field from '../components/Field';

export default function ThemeSection() {
	const settings = useSelector((state: RootState) => state.settings);
	const dispatch = useDispatch();

	const toggleTheme = async () => {
		ipcRenderer.invoke('dark-mode:toggle');
		dispatch(toggleSetting('isBlueTheme'));
	};

	return (
		<Section partTitle="Тема">
			<div className="flex flex-row gap-4 items-center">
				<p className="w-12">Синяя</p>
				<label className="relative inline-block w-[60px] h-[34px]">
					<input
						className="hidden"
						type="checkbox"
						defaultChecked={!settings.isBlueTheme}
						onClick={toggleTheme}
					/>
					<span className={sliderStyle.slider}></span>
				</label>
				<p className="w-12">Розовая</p>
			</div>
			<Field
				title="Показывать геометрические рисунки"
				checked={settings.showGeometricPatterns}
				settingName="showGeometricPatterns"
				disabled={settings.isBlueTheme}
			/>
		</Section>
	);
}