import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // req.body.jomleh
    // req.body.context
    // req.body.url
    res.status(200)
    res.redirect("/")
}
