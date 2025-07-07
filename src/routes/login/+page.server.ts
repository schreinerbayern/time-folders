import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { readFile, appendFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const load: PageServerLoad = async ({ locals }) => {
	// If the user is already logged in, redirect to the home page
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const password = data.get('password');

		const csvPath = join(`${PFAD_WURZEL_ORDNER}`, 'nutzerliste.csv');
		const csvFile = await readFile(csvPath, 'utf8');
		const lines = csvFile
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (lines.length < 2) {
			return {
				error: 'Invalid user data file'
			};
		}

		const header = lines[0].split(',').map((h) => h.trim());
		const users = lines.slice(1).map((line) => {
			const values = line.split(',').map((v) => v.trim());
			const user: Record<string, string> = {};
			header.forEach((key, i) => {
				user[key] = values[i];
			});
			return user;
		});

		const user = users.find((u) => u.Name === name && u.PW === password);

		if (user) {
			const now = new Date();
			const month = (now.getMonth() + 1).toString().padStart(2, '0');
			const year = now.getFullYear();
			const anwesenheitPath = join(
				`${PFAD_WURZEL_ORDNER}`,
				`anwesenheitszeiten-${month}-${year}.csv`
			);
			const anwesenheitHeader = 'Name,Kommt,Geht,Dauer\n';
			const anwesenheitLine = `${user.Name},${now.toISOString()},,\n`;

			try {
				await readFile(anwesenheitPath);
			} catch (error) {
				await writeFile(anwesenheitPath, anwesenheitHeader);
			}

			await appendFile(anwesenheitPath, anwesenheitLine);
			console.log(`Anwesenheitszeit (Kommt) geschrieben: ${anwesenheitLine.trim()}`);

			cookies.set('session', user.Name, { path: '/', httpOnly: true, secure: false });
			throw redirect(302, '/');
		} else {
			return {
				error: 'Invalid name or password'
			};
		}
	}
};
