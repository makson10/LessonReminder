import { useEffect, useRef, LegacyRef } from 'react';
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
	const themeTumblerRef = useRef<HTMLInputElement>();

	const toggleTheme = async () => {
		dispatch(toggleSetting('isDarkTheme'));
		ipcRenderer.invoke('dark-mode:toggle');
	};

	const setLightTheme = () => {
		dispatch(setColorTheme('light'));
		ipcRenderer.invoke('dark-mode:setLightTheme');
	};

	const setDarkTheme = () => {
		dispatch(setColorTheme('dark'));
		ipcRenderer.invoke('dark-mode:setDarkTheme');
	};

	const setActualColorTheme = () => {
		const date = new Date();
		const currentHour = date.getHours();

		if (currentHour >= 7 && currentHour < 18) setLightTheme();
		if (currentHour >= 18) setDarkTheme();
	};

	useEffect(() => {
		if (!settings.automaticallyToggleColorTheme) return;
		let setActualColorThemeInterval: NodeJS.Timer;

		setActualColorTheme();

		setActualColorThemeInterval = setInterval(() => {
			setActualColorTheme();
		}, 5 * 60 * 1000);

		return () => clearInterval(setActualColorThemeInterval);
	}, [settings.automaticallyToggleColorTheme]);

	useEffect(() => {
		if (themeTumblerRef.current)
			themeTumblerRef.current.checked = settings.isDarkTheme;
	}, [settings.isDarkTheme]);

	return (
		<Section partTitle="Тема">
			<div className="flex flex-row gap-6 items-center">
				<p
					className={`w-12 ${
						settings.automaticallyToggleColorTheme ? 'text-gray-500' : ''
					}`}>
					Розовая
				</p>
				<label
					className={`relative inline-block w-[60px] h-[34px] ${
						settings.automaticallyToggleColorTheme ? 'opacity-60' : ''
					}`}>
					<input
						className="hidden"
						type="checkbox"
						ref={themeTumblerRef as LegacyRef<HTMLInputElement>}
						defaultChecked={settings.isDarkTheme}
						disabled={settings.automaticallyToggleColorTheme}
						onClick={toggleTheme}
					/>
					<span className={sliderStyle.slider}></span>
				</label>
				<p
					className={`w-12 ${
						settings.automaticallyToggleColorTheme ? 'text-gray-500' : ''
					}`}>
					Синяя
				</p>
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
