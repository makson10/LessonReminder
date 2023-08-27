import { app } from 'electron';
const AutoLaunch = require('auto-launch');

const setupAutostart = async (enableAutostart: boolean) => {
	const autoLaunch = await new AutoLaunch({
		name: 'LessonReminder',
		path: app.getPath('exe'),
	});

	await autoLaunch.isEnabled().then((isEnabled: boolean) => {
		if (!isEnabled && enableAutostart) {
			autoLaunch.enable();
		} else if (isEnabled && !enableAutostart) {
			autoLaunch.disable();
		}
	});
};

module.exports = setupAutostart;
