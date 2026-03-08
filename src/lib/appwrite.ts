import { Client, Account } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

let client: Client;

export function getClient() {
	if (!client) {
		client = new Client();
		client.setEndpoint(PUBLIC_APPWRITE_ENDPOINT).setProject(PUBLIC_APPWRITE_PROJECT_ID);
	}
	return client;
}

export function getAccount() {
	return new Account(getClient());
}
