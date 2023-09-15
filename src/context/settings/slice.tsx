import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ISettings } from '@/types/settingsTypes';
import { settingsInitialValue as initialState } from '@/initialValues';
import fs from 'fs/promises';
import axios from 'axios';

const getAppId = async () => {
	const appIdFileContent = await fs.readFile('./appId.json', 'utf-8');
	const appId = await JSON.parse(appIdFileContent).appId;

	return appId;
};

const sendNewSettingsToServer = async (data: { appId: string, newSettings: ISettings }) => {
	await axios.post(
		import.meta.env.VITE_MEDIATOR_BASE_URL + 'accounts/setnewsettings',
		data
	);
};

const storeCurrentSettingsInLocalFile = async (newSettings: ISettings) => {
	await fs.writeFile('settings.json', JSON.stringify(newSettings));
};

const postStateChanges = async (newSettings: ISettings) => {
	const appId = await getAppId();
	await sendNewSettingsToServer({ appId, newSettings });
    await storeCurrentSettingsInLocalFile(newSettings);
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<ISettings>) => {
			return {
				...state,
				...action.payload,
			};
		},
		toggleSetting: (state, action: PayloadAction<keyof ISettings>) => {
			state[action.payload] = !state[action.payload];
			postStateChanges({ ...state });
		},
		setConcrateValueToSetting: (
			state,
			action: PayloadAction<{
				name: keyof ISettings;
				value: boolean;
			}>
		) => {
			state[action.payload.name] = action.payload.value;
			postStateChanges({ ...state });
		},
		setColorTheme: (state, action: PayloadAction<string>) => {
			state.isDarkTheme =
				action.payload === 'light'
					? false
					: action.payload === 'dark'
					? true
					: false;
			postStateChanges({ ...state });
		},
	},
});

export const {
	setSettings,
	toggleSetting,
	setConcrateValueToSetting,
	setColorTheme,
} = settingsSlice.actions;
export default settingsSlice.reducer;
