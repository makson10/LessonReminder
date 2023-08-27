import { BrowserWindow, globalShortcut } from 'electron';

const setupGlobalShortcut = async (win: BrowserWindow) => {
	globalShortcut.register('Ctrl+R', () => win.reload());
};

module.exports = setupGlobalShortcut;
