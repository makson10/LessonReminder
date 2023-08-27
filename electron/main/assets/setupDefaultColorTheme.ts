import { nativeTheme } from 'electron';

const setupDefaultColorTheme = async (isBlueTheme: boolean) => {
	nativeTheme.themeSource = isBlueTheme ? 'dark' : 'light';
};

module.exports = setupDefaultColorTheme;
