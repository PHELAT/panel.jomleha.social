import { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { fetchUser } from './user';

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
                    .then(result => {
                        res.status(200).redirect("/negaresh")
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
