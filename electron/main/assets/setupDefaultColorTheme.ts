import { nativeTheme } from 'electron';

const setupDefaultColorTheme = async (isDarkTheme: boolean) => {
	nativeTheme.themeSource = isDarkTheme ? 'dark' : 'light';
};

module.exports = setupDefaultColorTheme;
