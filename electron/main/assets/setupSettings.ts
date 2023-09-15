import { ISettings } from '../../../src/types/settingsTypes';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

const setupSettings = async () => {
	const defaultSettings: ISettings = {
		startWithWindows: true,
		disableNotifications: false,
		showSecondNotification: true,
		leaveNotificationOpen: false,
		sendTelegramMessage: false,
		isDarkTheme: false,
		showGeometricPatterns: false,
		automaticallyToggleColorTheme: true,
	};

	if (!existsSync('./settings.json')) {
		await fs.writeFile('./settings.json', JSON.stringify(defaultSettings));
	}

	const dataFromSettingsFile = await fs.readFile('./settings.json', 'utf-8');
	let settings = defaultSettings;

	try {
		settings = await JSON.parse(dataFromSettingsFile);
	} catch (error) {
		console.log(error);
	}

	return settings;
};

module.exports = setupSettings;
