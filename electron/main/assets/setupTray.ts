import { Menu, Tray, app } from 'electron';
const { join } = require('node:path');

const setupTray = async () => {
	const tray = new Tray(join(process.env.PUBLIC, 'app-icon.png'));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Выход',
			type: 'normal',
			click: () => {
				app.quit();
				process.exit(0);
			},
		},
	]);

	tray.setToolTip('LessonReminder');
	tray.setContextMenu(contextMenu);

	return tray;
};

module.exports = setupTray;
