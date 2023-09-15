import { ISettings } from './types/settingsTypes';
import fs from 'fs';

let settingsInitialValue: ISettings = {
	startWithWindows: true,
	disableNotifications: false,
	showSecondNotification: true,
	leaveNotificationOpen: false,
	sendTelegramMessage: false,
	isDarkTheme: false,
	showGeometricPatterns: false,
	automaticallyToggleColorTheme: true,
};

fs.readFile('./settings.json', 'utf-8', (err, data) => {
	if (err) throw err;
	settingsInitialValue = JSON.parse(data);
});

export { settingsInitialValue };
