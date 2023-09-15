import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

const setupAppIdFile = async () => {
	if (existsSync('./appId.json')) return;
	await fs.writeFile('./appId.json', JSON.stringify({}));
};

module.exports = setupAppIdFile;
