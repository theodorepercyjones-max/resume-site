import { json } from '@sveltejs/kit';
import { APPWRITE_API_KEY, APPWRITE_DATABASE_ID } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
import { getProfile, getWorkExperiences, getFreelanceWorks, getEducations } from '$lib/server/appwrite';

export async function GET() {
	const envCheck = {
		hasApiKey: !!APPWRITE_API_KEY,
		apiKeyPrefix: APPWRITE_API_KEY?.substring(0, 12) + '...',
		databaseId: APPWRITE_DATABASE_ID,
		endpoint: PUBLIC_APPWRITE_ENDPOINT,
		projectId: PUBLIC_APPWRITE_PROJECT_ID
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
