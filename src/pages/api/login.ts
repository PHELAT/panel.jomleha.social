import type { User } from './user';

import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body

    try {
        // get username info from firebase
        const bodyJson = JSON.parse(body)
        // console.log(`USERNAME: ${bodyJson.username} | ${bodyJson.token}`)

        const user = { isLoggedIn: true, token: bodyJson.token, username: bodyJson.username} as User
        req.session.user = user
        await req.session.save()
        res.json(user)
    } catch (error) {
        console.log((error as Error).message)
        res.status(500).json({ message: "Oopsie!" })
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
