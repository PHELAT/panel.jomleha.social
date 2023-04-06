export type FirebaseAppName = "[DEFAULT]" | "[FRONT]"

export type FirebaseCredentials = {
    type: string | undefined,
    project_id: string | undefined,
    private_key_id: string | undefined,
    private_key: string | undefined,
    client_email: string | undefined,
    client_id: string | undefined,
    auth_uri: string | undefined,
    token_uri: string | undefined,
    auth_provider_x509_cert_url: string | undefined,
    client_x509_cert_url: string | undefined,
}

export default async function initFirebase(
    appName: FirebaseAppName = "[DEFAULT]",
    credentials: FirebaseCredentials | undefined = undefined,
    databaseURL: string = process.env.FIREBASE_URL as string
): Promise<any> {
    if (credentials !== undefined) {
        return configureApp(
            appName,
            {
                type: credentials.type,
                project_id: credentials.project_id,
                private_key_id: credentials.private_key_id,
                private_key: credentials.private_key!.replace(/\\n/gm, "\n"),
                client_email: credentials.client_email,
                client_id: credentials.client_id,
                auth_uri: credentials.auth_uri,
                token_uri: credentials.token_uri,
                auth_provider_x509_cert_url: credentials.auth_provider_x509_cert_url,
                client_x509_cert_url: credentials.client_x509_cert_url,
            },
            databaseURL
        )
    } else if (process.env.FIREBASE_CONFIG === undefined) {
        return configureApp(
            appName,
            {
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
            },
            databaseURL
        )
    } else {
        const fileSystem = require('fs');
        const credentialsFile = fileSystem.readFileSync(process.env.FIREBASE_CONFIG);
        return configureApp(appName, JSON.parse(credentialsFile), databaseURL)
    }
}

function configureApp(
    appName: FirebaseAppName,
    credentials: FirebaseCredentials,
    databaseURL: string
): any {
    const { initializeApp, cert, getApps } = require('firebase-admin/app');

    const apps = getApps()
    for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        if (app.name === appName) {
            return app;
        }
    }

    const config = {
        credential: cert(credentials),
        databaseURL: databaseURL
    };
    return initializeApp(config, appName)
}
