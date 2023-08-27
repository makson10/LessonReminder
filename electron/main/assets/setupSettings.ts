import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { ISettings } from '../../../src/types/settingsTypes';

const setupSettings = async () => {
	const defaultSettings: ISettings = {
		startWithWindows: true,
		disableNotifications: false,
		showSecondNotification: true,
		leaveNotificationOpen: false,
		isBlueTheme: false,
        showGeometricPatterns: false
	};

	if (!existsSync('settings.json')) {
		await fs.writeFile('./settings.json', JSON.stringify(defaultSettings));
	}

	const dataFromSettingsFile = await fs.readFile('settings.json', 'utf-8');
	return await JSON.parse(dataFromSettingsFile);
};

module.exports = setupSettings;
