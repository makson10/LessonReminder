import { ISettings } from '@/types/settingsTypes';

const initialState: ISettings = {
	startWithWindows: true,
	disableNotifications: false,
	showSecondNotification: true,
	leaveNotificationOpen: false,
	isBlueTheme: false,
	showGeometricPatterns: false,
};

export default initialState;
