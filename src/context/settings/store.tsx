import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice';
import initializeStore from './setFileSettings';

export const store = configureStore({
	reducer: {
		settings: counterReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

initializeStore();
