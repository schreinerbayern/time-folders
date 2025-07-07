import fs from 'fs';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

const { PFAD_WURZEL_ORDNER } = env;

export const load: LayoutServerLoad = async ({ url, locals }) => {
	if (!locals.user && url.pathname !== '/login') {
		throw redirect(302, '/login');
	}

	const projects = fs.readdirSync(`${PFAD_WURZEL_ORDNER}`).filter((file) => {
		return fs.statSync(`${PFAD_WURZEL_ORDNER}/${file}`).isDirectory();
	});
	const project = url.pathname.split('/')[1];
	return {
		projects,
		project,
		user: locals.user
	};
};
