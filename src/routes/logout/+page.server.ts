import { redirect } from '@sveltejs/kit';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const actions = {
	default: async ({ cookies, locals, request }) => {
		console.log('Logout action triggered.');
		const data = await request.formData();
		const activeTimerData = data.get('activeTimer');

		if (activeTimerData) {
			const [kostenstelle, timerData] = JSON.parse(activeTimerData as string);
			const projectPath = join(`${PFAD_WURZEL_ORDNER}`, timerData.project);
			const zeitwirtschaftPath = join(projectPath, 'Zeitwirtschaft');
			const csvFilePath = join(zeitwirtschaftPath, 'stundenzettel.csv');
			const csvHeader = 'Name,Kom.Nr.,Kostenstelle,Start,Ende,Zeit\n';

			const startDateTime = new Date(timerData.startTime);
			const endDateTime = new Date();
			const durationMs = endDateTime.getTime() - startDateTime.getTime();

			const hours = Math.floor(durationMs / (1000 * 60 * 60));
			const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

			const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

			const csvLine = `${locals.user.name},${timerData.project.split('_')[0]},${kostenstelle},${timerData.startTime},${endDateTime.toISOString()},${formattedTime}\n`;

			try {
				await readFile(csvFilePath);
			} catch (error) {
				await writeFile(csvFilePath, csvHeader);
			}

			await appendFile(csvFilePath, csvLine);
			console.log(`Projektzeit geschrieben: ${csvLine.trim()}`);
		}

		const now = new Date();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const year = now.getFullYear();
		const anwesenheitPath = join(
			`${PFAD_WURZEL_ORDNER}`,
			`anwesenheitszeiten-${month}-${year}.csv`
		);

		let foundOpenEntry = false;

		try {
			const fileContent = await readFile(anwesenheitPath, 'utf8');
			const lines = fileContent.split('\n').map((line) => line.trim());
			const user = locals.user;

			if (user) {
				for (let i = lines.length - 1; i >= 0; i--) {
					const [name, kommt, geht] = lines[i].split(',');
					if (name === user.name && kommt && !geht) {
						const kommtTime = new Date(kommt);
						const gehtTime = now;
						const duration = gehtTime.getTime() - kommtTime.getTime();
						const durationHours = Math.floor(duration / (1000 * 60 * 60));
						const durationMinutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
						const durationSeconds = Math.floor((duration % (1000 * 60)) / 1000);
						const durationString = `${durationHours
							.toString()
						.padStart(2, '0')}:${durationMinutes
							.toString()
						.padStart(2, '0')}:${durationSeconds
							.toString()
						.padStart(2, '0')}`;

						lines[i] = `${name},${kommt},${gehtTime.toISOString()},${durationString}`;
						console.log(`Anwesenheitszeit (Geht) aktualisiert: ${lines[i].trim()}`);
						foundOpenEntry = true;
						break;
					}
				}
			}

			await writeFile(anwesenheitPath, lines.join('\n'));
			if (foundOpenEntry) {
				console.log(`Anwesenheitszeit (Geht) erfolgreich in ${anwesenheitPath} für ${user?.name} um ${now.toISOString()} aktualisiert.`);
			} else {
				console.log(`Kein offener 'Kommt'-Eintrag für ${user?.name} in ${anwesenheitPath} gefunden. Datei wurde trotzdem geschrieben.`);
			}
		} catch (error) {
			console.error('Error reading or writing anwesenheitszeiten.csv:', error);
		}

		cookies.delete('session', { path: '/' });
		throw redirect(302, '/login');
	}
};
