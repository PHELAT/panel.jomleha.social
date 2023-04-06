export type FirebaseCredentials = {}

export default async function initFirebase(credentials: FirebaseCredentials | undefined = undefined) {
    const { initializeApp, cert, getApps, getApp } = require('firebase-admin/app');

    let construcutedCredentials: FirebaseCredentials = {}
    if (credentials !== undefined) {
        construcutedCredentials = credentials
    } else if (process.env.FIREBASE_CONFIG === undefined) {
        construcutedCredentials = {
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        }
    } else {
        const fileSystem = require('fs');
        const credentialsFile = fileSystem.readFileSync(process.env.FIREBASE_CONFIG);
        construcutedCredentials = JSON.parse(credentialsFile);
    }

    const config = {
        credential: cert(construcutedCredentials),
        databaseURL: process.env.FIREBASE_URL
    };
    const app = !getApps().length ? initializeApp(config) : getApp()
}
