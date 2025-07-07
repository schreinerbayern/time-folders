import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const load: PageServerLoad = async ({ params, parent, locals, url }) => {
	try {
		const { subfolderContents } = await parent();
		const currentTabContent = subfolderContents[params.tab];

		if (!currentTabContent || currentTabContent.pdfFiles.length === 0) {
			return {
				project: params.project,
				tab: params.tab,
				noPdfFound: true,
				csvContent: currentTabContent?.csvContent || {},
				user: locals.user,
				pathname: url.pathname
			};
		}
		console.log('File', currentTabContent.pdfFiles[0]);

		return {
			project: params.project,
			tab: params.tab,
			file: currentTabContent.pdfFiles[0],
			csvContent: currentTabContent.csvContent,
			user: locals.user,
			pathname: url.pathname
		};
	} catch (e: any) {
		console.error('Failed to load PDF:', e);
		throw error(500, e.message || 'Failed to load PDF');
	}
};

export const actions: Actions = {
	trackTime: async ({ request, params }) => {
		const data = await request.formData();
		const userName = data.get('userName');
		const projectNumber = data.get('projectNumber');
		const kostenstellenNummer = data.get('kostenstellenNummer');
		const startTime = data.get('startTime');
		const endTime = data.get('endTime');

		console.log('Received time tracking data:', {
			userName,
			projectNumber,
			kostenstellenNummer,
			startTime,
			endTime
		});

		const projectPath = path.join(`${PFAD_WURZEL_ORDNER}`, params.project);
		const zeitwirtschaftPath = path.join(projectPath, 'Zeitwirtschaft');
		const csvFilePath = path.join(zeitwirtschaftPath, 'stundenzettel.csv');
		const csvHeader = 'Name,Kom.Nr.,Kostenstelle,Start,Ende,Zeit\n';

		try {
			await fs.mkdir(zeitwirtschaftPath, { recursive: true });
		} catch (error) {
			console.error('Error creating directory:', error);
			return { success: false, error: 'Failed to create directory' };
		}

		const startDateTime = new Date(startTime as string);
		const endDateTime = new Date(endTime as string);
		const durationMs = endDateTime.getTime() - startDateTime.getTime();

		const hours = Math.floor(durationMs / (1000 * 60 * 60));
		const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

		const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

		const csvLine = `${userName},${projectNumber},${kostenstellenNummer},${startTime},${endTime},${formattedTime}\n`;

		let fileExists = false;
		try {
			await fs.access(csvFilePath);
			fileExists = true;
		} catch (error) {
			// File does not exist
		}

		try {
			if (!fileExists) {
				await fs.writeFile(csvFilePath, csvHeader);
				console.log('Created stundenzettel.csv with header.');
			}

			await fs.appendFile(csvFilePath, csvLine);
			console.log(`Projektzeit geschrieben: ${csvLine.trim()}`);

			return { success: true };
		} catch (error) {
			console.error('Error writing to stundenzettel.csv:', error);
			return { success: false, error: 'Failed to write to CSV file' };
		}
	}
};
