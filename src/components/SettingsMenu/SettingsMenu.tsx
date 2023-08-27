import { useState } from 'react';
import OpenButton from './OpenButton';
import ThemeSection from './Subsettings/ThemeSection';
import MainSettingsSection from './Subsettings/MainSettingsSection';

export default function SettingsMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	return (
		<>
			<OpenButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

			<div
				className={`absolute top-0 left-0 w-screen h-screen transition-all duration-[250ms] ${
					isMenuOpen ? 'z-10 bg-black/30' : '-z-10 bg-black/0'
				}`}>
				<div
					className={`absolute top-0 h-screen w-fit flex flex-col justify-center bg-[--pink-fifth-color] dark:bg-[--blue-fifth-color] p-6 transition-all duration-[250ms] ${
						isMenuOpen ? 'right-0' : 'right-[-330px]'
					}`}>
					<div className="flex flex-col justify-center gap-12">
						<MainSettingsSection />
						<ThemeSection />
					</div>
				</div>
			</div>
		</>
	);
}
