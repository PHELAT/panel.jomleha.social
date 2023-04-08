import { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { fetchUser } from './user';
import { Client, auth } from "twitter-api-sdk";
import { Session } from 'next-auth';

export type Context = {
    title: string,
    url?: string
}

export type Jomleh = {
    jomleh: string
    added: Date,
    context?: Context
}

async function addJomleh(app: any, jomleh: Jomleh): Promise<string> {
    const { getFirestore } = require('firebase-admin/firestore');

    const db = getFirestore(app);
    try {
        const res = await db.collection('jomleha').add(jomleh);
        if (res.id === null || res.id === undefined) {
            return Promise.reject()
        }
        return res.id
    } catch (error) {
        console.log((error as Error).message)
        return Promise.reject()
    }
}

async function tweetJomleh(session: Session, jomleh: Jomleh) {
    const authClient = new auth.OAuth2User({
        client_id: process.env.TWITTER_CLIENT_ID as string,
        client_secret: process.env.TWITTER_CLIENT_SECRET as string,
        callback: process.env.LOGIN_CALLBACK as string,
        scopes: ["users.read", "tweet.read", "offline.access", "tweet.write"],
        token: {
            access_token: session.accessToken,
            refresh_token: session.refreshToken,
            expires_at: session.expiresAt,
            token_type: "bearer",
            scope: "users.read,tweet.read,offline.access,tweet.write"
        }
    });
    const twitterClient = new Client(authClient);
    const tweet = await twitterClient.tweets.createTweet({ text: jomleh.jomleh });
    return tweet;
}

export default async function negareshRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (session && session.accountId) {
        await initFirebase();
        fetchUser(session.accountId)
            .then(async function (result) {
                const app = await initFirebase("[FRONT]", result.credentials, process.env.FIREBASE_FRONT_URL);
                const contextTitle = req.body.context
                const contextUrl = req.body.link
                const jomleh: Jomleh = {
                    jomleh: req.body.jomleh,
                    added: new Date(),
                    ...(contextTitle && {
                        context: {
                            title: contextTitle,
                            ...(contextUrl && { url: contextUrl })
                        }
                    })
                };
                addJomleh(app, jomleh)
                    .then(async function (result) {
                        const tweet = await tweetJomleh(session, jomleh);
                        if (tweet.data) {
                            console.log(`TWEETED ${tweet.data.id}`)
                            res.status(200).redirect("/negaresh")
                        } else if (tweet.errors) {
                            console.log(`ERROR_TWEET ${tweet.errors}`)
                            res.status(500).redirect("/negaresh")
                        } else {
                            res.status(500).redirect("/negaresh")
                        }
                    })
                    .catch(error => {
                        console.log((error as Error).message)
                        res.status(500).json({ "message": "Oopsie!" })
                    })
            })
            .catch(error => {
                console.log("ERROR!")
            })
    } else {
        res.status(401).json({ "message": "Unauthorized!" })
    }
}
