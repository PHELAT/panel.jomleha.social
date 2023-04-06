import { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from '@/lib/firebase';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';

export type Context = {
    title: string,
    url?: string | undefined
}

export type Jomleh = {
    jomleh: string
    context?: Context | undefined
}

async function addJomleh(jomleh: Jomleh): Promise<string> {
    const { getFirestore } = require('firebase-admin/firestore');

    const db = getFirestore();
    const res = await db.collection('jomleha').add(jomleh);
    if (res.id === null || res.id === undefined) {
        return Promise.reject()
    }

    return res.id
}

async function negareshRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user) {
        await initFirebase(req.session.user.credentials)
        const jomleh: Jomleh = {
            jomleh: req.body.jomleh,
            context: {
                title: req.body.context,
                url: req.body.link
            }
        };
        addJomleh(jomleh)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log((error as Error).message)
                res.status(500).json({ "message": "Oopsie!" })
            })
    } else {
        res.status(401).json({ "message": "Unauthorized!" })
    }
}

export default withIronSessionApiRoute(negareshRoute, sessionOptions)
