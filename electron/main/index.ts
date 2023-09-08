import { app, BrowserWindow, ipcMain, nativeTheme, Tray } from 'electron';
import { join } from 'node:path';
import { ISettings } from '../../src/types/settingsTypes';

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, '../public')
	: process.env.DIST;

const setupSettings = require('./assets/setupSettings');
const setupAutostart = require('./assets/setupAutostart');
const setupTray = require('./assets/setupTray');
const createWindow = require('./assets/createWindow');
const setupDefaultColorTheme = require('./assets/setupDefaultColorTheme');
const setupGlobalShortcut = require('./assets/setupGlobalShortcut');
const terminateOtherAppInstance = require('./assets/terminateOtherAppInstance');

const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

let win: BrowserWindow = null;
let tray: Tray = null;
let settings: ISettings = null;

app
	.whenReady()
	.then(async () => (settings = await setupSettings()))
	.then(async () => await setupAutostart(settings.startWithWindows))
	.then(async () => (tray = await setupTray()))
	.then(async () => (win = await createWindow(tray)))
	.then(async () => await setupDefaultColorTheme(settings.isDarkTheme))
	.then(async () => await setupGlobalShortcut(win))
	.then(async () => await terminateOtherAppInstance());

app.on('second-instance', () => {
	if (!win) return;

	if (win.isMinimized()) win.restore();
	win.focus();
});

app.on('before-quit', (event) => {
	event.preventDefault();
});

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

ipcMain.handle('open-win', (_, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		childWindow.loadURL(`${url}#${arg}`);
	} else {
		childWindow.loadFile(indexHtml, { hash: arg });
	}
});

ipcMain.handle('dark-mode:toggle', () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = 'light';
	} else {
		nativeTheme.themeSource = 'dark';
	}

	return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:setLightTheme', () => {
	nativeTheme.themeSource = 'light';
});

ipcMain.handle('dark-mode:setDarkTheme', () => {
	nativeTheme.themeSource = 'dark';
});

ipcMain.on('app_version', (event) => {
	event.sender.send('app_version', { version: app.getVersion() });
});
