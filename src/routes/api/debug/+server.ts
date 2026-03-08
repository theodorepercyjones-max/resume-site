import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Check all possible ways env vars might be available
	const check = {
		// Direct process.env
		processEnv: {
			APPWRITE_API_KEY: process.env.APPWRITE_API_KEY ? process.env.APPWRITE_API_KEY.substring(0, 12) + '...' : 'MISSING',
			APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || 'MISSING',
			PUBLIC_APPWRITE_ENDPOINT: process.env.PUBLIC_APPWRITE_ENDPOINT || 'MISSING',
			PUBLIC_APPWRITE_PROJECT_ID: process.env.PUBLIC_APPWRITE_PROJECT_ID || 'MISSING',
			ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'MISSING'
		},
		// List all env var keys that contain APPWRITE
		allAppwriteKeys: Object.keys(process.env).filter(k => k.includes('APPWRITE') || k.includes('appwrite')),
		// Total env var count
		totalEnvVars: Object.keys(process.env).length
	};

	return json(check);
};
