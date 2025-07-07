import { error, json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';

const { PFAD_WURZEL_ORDNER } = env;

export const GET: RequestHandler = async ({ params, url }) => {
	const { project, tab } = params as { project: string; tab: string };
	const fileName = url.searchParams.get('file');
	const pdfPath = path.join(PFAD_WURZEL_ORDNER, project, 'Zeitwirtschaft', tab);
	console.log('PDF Pfad', pdfPath);
	try {
		const files = fs.readdirSync(pdfPath);
		const pdfFile = files.find((file) => file.toLowerCase().endsWith('.pdf'));

		if (!pdfFile) {
			throw error(404, 'PDF file not found');
		}

		const filePath = path.join(pdfPath, pdfFile);
		const fileContent = fs.readFileSync(filePath);

		return new Response(fileContent, {
			headers: {
				'Content-Type': 'application/pdf'
			}
		});
	} catch (err) {
		throw error(404, 'File not found');
	}
};

export const POST: RequestHandler = async ({ params, request, url }) => {
	const { project, tab } = params as { project: string; tab: string };
	const fileName = url.searchParams.get('file');

	if (!fileName) {
		throw error(400, 'File name is required');
	}

	const pdfPath = path.join(PFAD_WURZEL_ORDNER, project, 'Zeitwirtschaft', tab, fileName);

	try {
		const { pdfData } = await request.json();
		const buffer = Buffer.from(pdfData, 'base64');

		fs.writeFileSync(pdfPath, buffer);

		return json({ success: true });
	} catch (err) {
		console.error('Error saving PDF:', err);
		throw error(500, 'Failed to save PDF');
	}
};
