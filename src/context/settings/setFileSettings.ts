import { setSettings } from './slice';
import { store } from './store';
import { ISettings } from '@/types/settingsTypes';
import fs from 'node:fs/promises';

async function initializeStore() {
	const settingsFileContent = await fs.readFile('settings.json', 'utf-8');
	const settingsFromFile: ISettings = await JSON.parse(settingsFileContent);

	store.dispatch(setSettings(settingsFromFile));
}

export default initializeStore;
