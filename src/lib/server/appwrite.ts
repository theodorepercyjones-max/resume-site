import { Client, Databases, Query } from 'node-appwrite';
import { APPWRITE_API_KEY, APPWRITE_DATABASE_ID } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

const DB_ID = APPWRITE_DATABASE_ID;

// Table IDs
const PROFILE = 'profile';
const WORK_EXPERIENCE = 'work_experience';
const FREELANCE_WORK = 'freelance_work';
const EDUCATION = 'education';
const TODOS = 'todos';

function getClient() {
	const client = new Client();
	client.setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY);
	return client;
}

function getDb() {
	return new Databases(getClient());
}

// --- Profile ---

export async function getProfile() {
	const db = getDb();
	try {
		const result = await db.listDocuments(DB_ID, PROFILE, [Query.limit(1)]);
		if (result.total > 0) return result.documents[0];
	} catch {
		// no profile yet
	}
	return null;
}

export async function updateProfile(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(DB_ID, PROFILE, docId, data);
}

export async function createProfile(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(DB_ID, PROFILE, 'unique()', data);
}

// --- Work Experience ---

export async function getWorkExperiences() {
	const db = getDb();
	try {
		const result = await db.listDocuments(DB_ID, WORK_EXPERIENCE, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch {
		return [];
	}
}

export async function getWorkExperience(docId: string) {
	const db = getDb();
	return db.getDocument(DB_ID, WORK_EXPERIENCE, docId);
}

export async function createWorkExperience(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(DB_ID, WORK_EXPERIENCE, 'unique()', data);
}

export async function updateWorkExperience(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(DB_ID, WORK_EXPERIENCE, docId, data);
}

export async function deleteWorkExperience(docId: string) {
	const db = getDb();
	return db.deleteDocument(DB_ID, WORK_EXPERIENCE, docId);
}

// --- Freelance Work ---

export async function getFreelanceWorks() {
	const db = getDb();
	try {
		const result = await db.listDocuments(DB_ID, FREELANCE_WORK, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch {
		return [];
	}
}

export async function getFreelanceWork(docId: string) {
	const db = getDb();
	return db.getDocument(DB_ID, FREELANCE_WORK, docId);
}

export async function createFreelanceWork(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(DB_ID, FREELANCE_WORK, 'unique()', data);
}

export async function updateFreelanceWork(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(DB_ID, FREELANCE_WORK, docId, data);
}

export async function deleteFreelanceWork(docId: string) {
	const db = getDb();
	return db.deleteDocument(DB_ID, FREELANCE_WORK, docId);
}

// --- Education ---

export async function getEducations() {
	const db = getDb();
	try {
		const result = await db.listDocuments(DB_ID, EDUCATION, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch {
		return [];
	}
}

export async function getEducation(docId: string) {
	const db = getDb();
	return db.getDocument(DB_ID, EDUCATION, docId);
}

export async function createEducation(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(DB_ID, EDUCATION, 'unique()', data);
}

export async function updateEducation(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(DB_ID, EDUCATION, docId, data);
}

export async function deleteEducation(docId: string) {
	const db = getDb();
	return db.deleteDocument(DB_ID, EDUCATION, docId);
}

// --- Todos ---

export async function getTodos() {
	const db = getDb();
	try {
		const result = await db.listDocuments(DB_ID, TODOS, [
			Query.orderAsc('sort_order'),
			Query.limit(100)
		]);
		return result.documents;
	} catch {
		return [];
	}
}

export async function createTodo(data: Record<string, unknown>) {
	const db = getDb();
	return db.createDocument(DB_ID, TODOS, 'unique()', data);
}

export async function updateTodo(docId: string, data: Record<string, unknown>) {
	const db = getDb();
	return db.updateDocument(DB_ID, TODOS, docId, data);
}

export async function deleteTodo(docId: string) {
	const db = getDb();
	return db.deleteDocument(DB_ID, TODOS, docId);
}
