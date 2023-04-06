import type { User } from './user';

import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from '@/lib/firebase';

type FirebaseUser = {
    id: string,
    credentials: any
}

async function fetchUser(username: string): Promise<FirebaseUser> {
    const { getFirestore } = require('firebase-admin/firestore');

    const db = getFirestore();
    const snapshot = await db.collection('adminusers').doc(username).get();
    if (!snapshot.exists) {
        return Promise.reject()
    }
    const user: FirebaseUser = { id: snapshot.id, ...snapshot.data() }

    return user;
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body

    try {
        await initFirebase();
        const bodyJson = JSON.parse(body)
        fetchUser(bodyJson.username)
            .then(async function (result) {
                const user = {
                    isLoggedIn: true,
                    token: bodyJson.token,
                    username: result.id,
                    credentials: result.credentials
                } as User
                req.session.user = user
                await req.session.save()
                res.status(200).json(user)
            })
            .catch(error => {
                console.log((error as Error).message)
                res.status(500).json({ message: "Oopsie!" })
            })
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: "Oopsie!" })
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
