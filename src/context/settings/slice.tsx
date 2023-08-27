import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SettingsInitialValue } from '../../types/settingsTypes';
import fs from 'node:fs/promises';
import initialState from './initialState';

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<SettingsInitialValue>) => {
			return {
				...state,
				...action.payload,
			};
		},
		toggleSetting: (
			state,
			action: PayloadAction<keyof SettingsInitialValue>
		) => {
			state[action.payload] = !state[action.payload];
			fs.writeFile('settings.json', JSON.stringify(state));
		},
	},
});

export const { setSettings, toggleSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
