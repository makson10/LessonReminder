import { BrowserWindow, Menu, Tray, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';

const preload = join(__dirname, '../../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

const createWindow = async (tray: Tray) => {
	const win = new BrowserWindow({
		title: 'LessonReminder',
		icon: join(process.env.PUBLIC, 'app-icon.png'),
		width: 825,
		height: 644,
		resizable: false,
		webPreferences: {
			preload,
			contextIsolation: false,
			nodeIntegration: true,
		},
	});

	win.menuBarVisible = false; //* For Dev
	// Menu.setApplicationMenu(null); //* For Prod

	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(url);
	} else {
		win.loadFile(indexHtml);
	}

	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});

	tray.on('click', () => {
		win.isVisible() ? win.hide() : win.show();
	});

	win.on('close', (event) => {
		event.preventDefault();
		win.hide();
	});

	win.once('ready-to-show', () => {
		autoUpdater.checkForUpdatesAndNotify();
	});

	return win;
};

module.exports = createWindow;
