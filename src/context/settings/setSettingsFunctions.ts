import axios from 'axios';
import { setSettings } from './slice';
import { store } from './store';
import fs from 'node:fs/promises';

const setDefaultStoreSettings = async () => {
	const appIdFileContent = await fs.readFile('./appId.json', 'utf-8');
	const appId = await JSON.parse(appIdFileContent).appId;

	const userSettings = await axios
		.post(import.meta.env.VITE_MEDIATOR_BASE_URL + 'accounts/getusersettings', {
			appId,
		})
		.then((res) => res.data);

	store.dispatch(setSettings(userSettings));
	await fs.writeFile('settings.json', JSON.stringify(userSettings));
};

export { setDefaultStoreSettings };
