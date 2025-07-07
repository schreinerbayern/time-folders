import type { PageServerLoad } from './$types';
import fs from 'fs/promises';
import { env } from '$env/dynamic/private';
import path from 'path';

const { PFAD_WURZEL_ORDNER } = env;

export const load: PageServerLoad = async ({ locals }) => {
	const now = new Date();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const year = now.getFullYear();
	const anwesenheitPath = path.join(
		`${PFAD_WURZEL_ORDNER}`,
		`anwesenheitszeiten-${month}-${year}.csv`
	);

	let anwesenheitszeiten: any[] = [];

	try {
		const fileContent = await fs.readFile(anwesenheitPath, 'utf8');
		const lines = fileContent
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (lines.length > 1) {
			const header = lines[0].split(',').map((h) => h.trim());
			const allEntries = lines.slice(1).map((line) => {
				const values = line.split(',').map((v) => v.trim());
				const entry: Record<string, string> = {};
				header.forEach((key, i) => {
					entry[key] = values[i];
				});
				return entry;
			});

			if (locals.user && locals.user.name) {
				anwesenheitszeiten = allEntries.filter((entry) => entry.Name === locals.user.name);
				anwesenheitszeiten.sort((a, b) => new Date(b.Kommt).getTime() - new Date(a.Kommt).getTime());
			}
		}
	} catch (error) {
		// If file doesn't exist, return empty array
	}

	return {
		anwesenheitszeiten
	};
};
