import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import Section from '../components/Section';
import Field from '../components/Field';
import { RootState } from '@/context/settings/store';
import { toggleSetting, setColorTheme } from '@/context/settings/slice';
import sliderStyle from '@/styles/slider.module.scss';

export default function ThemeSection() {
	const settings = useSelector((state: RootState) => state.settings);
	const dispatch = useDispatch();

	const toggleTheme = async () => {
		ipcRenderer.invoke('dark-mode:toggle');
		dispatch(toggleSetting('isDarkTheme'));
	};

	const setLightTheme = () => {
		dispatch(setColorTheme('light'));
		ipcRenderer.invoke('dark-mode:setLightTheme');
	};

	const setDarkTheme = () => {
		dispatch(setColorTheme('dark'));
		ipcRenderer.invoke('dark-mode:setDarkTheme');
	};

	useEffect(() => {
		if (!settings.automaticallyToggleColorTheme) return;

		const date = new Date();
		const currentHour = date.getHours();

		if (currentHour >= 7 && currentHour < 18) setLightTheme();
		if (currentHour >= 18) setDarkTheme();
	}, [settings.automaticallyToggleColorTheme]);

	return (
		<Section partTitle="Тема">
			<div className="flex flex-row gap-4 items-center">
				<p className="w-12">Синяя</p>
				<label className="relative inline-block w-[60px] h-[34px]">
					<input
						className="hidden"
						type="checkbox"
						defaultChecked={!settings.isDarkTheme}
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
				disabled={settings.isDarkTheme}
			/>
			<Field
				title="Автоматически менять тему"
				checked={settings.automaticallyToggleColorTheme}
				settingName="automaticallyToggleColorTheme"
			/>
		</Section>
	);
}
