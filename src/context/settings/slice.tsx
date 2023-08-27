import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ISettings } from '@/types/settingsTypes';
import fs from 'node:fs/promises';
import initialState from './initialState';

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
		toggleSetting: (
			state,
			action: PayloadAction<keyof ISettings>
		) => {
			state[action.payload] = !state[action.payload];
			fs.writeFile('settings.json', JSON.stringify(state));
		},
	},
});

export const { setSettings, toggleSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
