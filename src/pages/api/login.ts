import { NextApiRequest, NextApiResponse } from 'next';
import initFirebase from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { fetchUser } from '@/lib/user';

export default async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (session && session.accountId) {
        await initFirebase();
        // TODO: encrypt accountId for retrieval
        fetchUser(session.accountId)
            .then(result => {
                res.redirect(302, '/negaresh')
            })
            .catch(error => {
                // TODO: redirect to a specific page
                res.redirect(302, '/')
            })
    } else {
        // TODO: redirect to a specific page
        res.redirect(302, '/')
    }
}
