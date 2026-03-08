import { Client, Account } from 'appwrite';
import { env } from '$env/dynamic/public';

let client: Client;

export function getClient() {
	if (!client) {
		client = new Client();
		client.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT).setProject(env.PUBLIC_APPWRITE_PROJECT_ID);
	}
	return client;
}

export function getAccount() {
	return new Account(getClient());
}
