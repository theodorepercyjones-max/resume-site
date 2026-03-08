import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { getProfile, getWorkExperiences, getFreelanceWorks, getEducations } from '$lib/server/appwrite';

export async function GET() {
	const envCheck = {
		hasApiKey: !!env.APPWRITE_API_KEY,
		apiKeyPrefix: env.APPWRITE_API_KEY?.substring(0, 12) + '...',
		databaseId: env.APPWRITE_DATABASE_ID,
		endpoint: publicEnv.PUBLIC_APPWRITE_ENDPOINT,
		projectId: publicEnv.PUBLIC_APPWRITE_PROJECT_ID
	};

	let profile, workExperiences, freelanceWorks, educations;
	let errors: Record<string, string> = {};

	try {
		profile = await getProfile();
	} catch (e: any) {
		errors.profile = e.message;
	}

	try {
		workExperiences = await getWorkExperiences();
	} catch (e: any) {
		errors.workExperiences = e.message;
	}

	try {
		freelanceWorks = await getFreelanceWorks();
	} catch (e: any) {
		errors.freelanceWorks = e.message;
	}

	try {
		educations = await getEducations();
	} catch (e: any) {
		errors.educations = e.message;
	}

	return json({
		envCheck,
		errors,
		profileFound: !!profile,
		profileName: profile?.full_name,
		workExperiencesCount: workExperiences?.length ?? 'failed',
		freelanceWorksCount: freelanceWorks?.length ?? 'failed',
		educationsCount: educations?.length ?? 'failed'
	});
}
