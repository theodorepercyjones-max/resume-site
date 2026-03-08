import { Client, Databases, Query, Teams, Users } from 'node-appwrite';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// --- Admin Team Auth ---

export function getAdminClient() {
	const client = new Client();
	client
		.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
		.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
		.setKey(env.APPWRITE_API_KEY);
	return client;
}

export async function isAdminTeamMember(userId: string): Promise<boolean> {
	const teamId = env.ADMIN_TEAM_ID;
	if (!teamId) return false;

	try {
		const teams = new Teams(getAdminClient());
		const memberships = await teams.listMemberships(teamId, [
			Query.equal('userId', [userId])
		]);
		return memberships.total > 0;
	} catch {
		return false;
	}
}

export async function findUserByEmail(email: string) {
	try {
		const users = new Users(getAdminClient());
		const result = await users.list([Query.equal('email', [email])]);
		return result.total > 0 ? result.users[0] : null;
	} catch {
		return null;
	}
}

// --- Database ---

// Table IDs
const PROFILE = 'profile';
const WORK_EXPERIENCE = 'work_experience';
const FREELANCE_WORK = 'freelance_work';
const EDUCATION = 'education';

function getClient() {
	const client = new Client();
	client
		.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
		.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
		.setKey(env.APPWRITE_API_KEY);
	return client;
}

function getDb() {
	return new Databases(getClient());
}

function dbId() {
	return env.APPWRITE_DATABASE_ID;
}

// --- Profile ---

export async function getProfile() {
	const db = getDb();
	try {
		const result = await db.listDocuments(dbId(), PROFILE, [Query.limit(1)]);
		if (result.total > 0) return result.documents[0];
	} catch (e) {
		console.error('getProfile error:', e);
	}
	return null;
}

export async function updateProfile(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(dbId(), PROFILE, docId, data);
}

export async function createProfile(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(dbId(), PROFILE, 'unique()', data);
}

// --- Work Experience ---

export async function getWorkExperiences() {
	const db = getDb();
	try {
		const result = await db.listDocuments(dbId(), WORK_EXPERIENCE, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch (e) {
		console.error('getWorkExperiences error:', e);
		return [];
	}
}

export async function getWorkExperience(docId: string) {
	const db = getDb();
	return db.getDocument(dbId(), WORK_EXPERIENCE, docId);
}

export async function createWorkExperience(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(dbId(), WORK_EXPERIENCE, 'unique()', data);
}

export async function updateWorkExperience(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(dbId(), WORK_EXPERIENCE, docId, data);
}

export async function deleteWorkExperience(docId: string) {
	const db = getDb();
	return db.deleteDocument(dbId(), WORK_EXPERIENCE, docId);
}

// --- Freelance Work ---

export async function getFreelanceWorks() {
	const db = getDb();
	try {
		const result = await db.listDocuments(dbId(), FREELANCE_WORK, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch (e) {
		console.error('getFreelanceWorks error:', e);
		return [];
	}
}

export async function getFreelanceWork(docId: string) {
	const db = getDb();
	return db.getDocument(dbId(), FREELANCE_WORK, docId);
}

export async function createFreelanceWork(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(dbId(), FREELANCE_WORK, 'unique()', data);
}

export async function updateFreelanceWork(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(dbId(), FREELANCE_WORK, docId, data);
}

export async function deleteFreelanceWork(docId: string) {
	const db = getDb();
	return db.deleteDocument(dbId(), FREELANCE_WORK, docId);
}

// --- Education ---

export async function getEducations() {
	const db = getDb();
	try {
		const result = await db.listDocuments(dbId(), EDUCATION, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch (e) {
		console.error('getEducations error:', e);
		return [];
	}
}

export async function getEducation(docId: string) {
	const db = getDb();
	return db.getDocument(dbId(), EDUCATION, docId);
}

export async function createEducation(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(dbId(), EDUCATION, 'unique()', data);
}

export async function updateEducation(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(dbId(), EDUCATION, docId, data);
}

export async function deleteEducation(docId: string) {
	const db = getDb();
	return db.deleteDocument(dbId(), EDUCATION, docId);
}

