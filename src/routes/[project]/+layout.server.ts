import { error } from '@sveltejs/kit';
import { type Dirent } from 'node:fs';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const load: LayoutServerLoad = async ({ params, url }) => {
	if (params.project === 'favicon.ico') {
		throw error(404, 'Not found');
	}
	const projectPath = join(`${PFAD_WURZEL_ORDNER}`, params.project);
	const zeitwirtschaftPath = join(projectPath, 'Zeitwirtschaft');

	if (!existsSync(zeitwirtschaftPath)) {
		return {
			project: params.project,
			zeitwirtschaftMissing: true,
			subfolders: [],
			subfolderContents: {},
			tab: undefined
		};
	}

	const subfolders = await readdir(zeitwirtschaftPath, { withFileTypes: true });
	const subfolderNames = subfolders
		.filter((dirent: Dirent) => dirent.isDirectory())
		.map((dirent: Dirent) => dirent.name);

	subfolderNames.push('Zeiterfassung');

	interface SubfolderData {
		pdfFiles: string[];
		csvContent: { [fileName: string]: string[] };
	}

	const subfolderContents: { [key: string]: SubfolderData } = {};
	for (const subfolder of subfolderNames) {
		if (subfolder === 'Zeiterfassung') continue;
		const subfolderPath = join(zeitwirtschaftPath, subfolder);
		const filesInSubfolder = await readdir(subfolderPath);

		const pdfFiles = filesInSubfolder.filter((file) => file.endsWith('.pdf'));
		const csvFiles = filesInSubfolder.filter((file) => file.endsWith('.csv'));

		const csvData: { [fileName: string]: string[] } = {};
		for (const csvFile of csvFiles) {
			const csvFilePath = join(subfolderPath, csvFile);
			const content = await readFile(csvFilePath, { encoding: 'utf-8' });
			csvData[csvFile] = content
				.split('\n')
				.map((line: string) => line.trim())
				.filter((line: string) => line.length > 0);
		}

		subfolderContents[subfolder] = {
			pdfFiles: pdfFiles,
			csvContent: csvData
		};
	}

	const pathParts = url.pathname.split('/');
	const tab = decodeURIComponent(pathParts[pathParts.length - 1]);

	return {
		project: params.project,
		zeitwirtschaftMissing: false,
		subfolders: subfolderNames,
		subfolderContents,
		tab
	};
};
