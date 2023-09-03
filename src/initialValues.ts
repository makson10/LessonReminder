import { ISettings } from './types/settingsTypes';

const settingsInitialValue: ISettings = {
	startWithWindows: true,
	disableNotifications: false,
	showSecondNotification: true,
	leaveNotificationOpen: false,
	isDarkTheme: false,
	showGeometricPatterns: false,
    automaticallyToggleColorTheme: true
};

export { settingsInitialValue };
