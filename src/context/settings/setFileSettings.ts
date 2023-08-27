import { setSettings } from './slice';
import { ISettings } from '@/types/settingsTypes';
import fs from 'node:fs/promises';
import { store } from './store';

async function initializeStore() {
	const settingsFileContent = await fs.readFile('settings.json', 'utf-8');
	const settingsFromFile: ISettings =
		JSON.parse(settingsFileContent);

	store.dispatch(setSettings(settingsFromFile));
}

export default initializeStore;
