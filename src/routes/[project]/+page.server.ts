import { redirect } from '@sveltejs/kit';
import { type Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const load: PageServerLoad = async ({ params }) => {
	const zeitwirtschaftPath = join(`${PFAD_WURZEL_ORDNER}`, params.project, 'Zeitwirtschaft');

	if (existsSync(zeitwirtschaftPath)) {
		const subfolders = await readdir(zeitwirtschaftPath, { withFileTypes: true });
		const tabFolders = subfolders
			.filter((dirent: Dirent) => dirent.isDirectory())
			.map((dirent: Dirent) => dirent.name);

		if (tabFolders.length > 0) {
			throw redirect(302, `/${params.project}/${tabFolders[0]}`);
		}
	}

	return {};
};
