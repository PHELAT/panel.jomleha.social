import { InferGetServerSidePropsType } from 'next';
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next';
import { fetchUser } from '@/lib/user';

export default function Negaresh({ firebaseUser }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: session } = useSession()
    return (
        <>
            <div className='flex flex-col h-screen justify-between'>
                <main className='w-full h-full flex items-center justify-center px-8'>
                    {(session && firebaseUser)
                        ? (
                            <div className='flex flex-col gap-4'>
                                <form className='flex flex-col gap-4' id='jomlehform' method='post' action='/api/negaresh'>
                                    <textarea className='form-textarea' name='jomleh' placeholder='جمله'></textarea>
                                    <input className='form-input' type='text' name='context' placeholder='زمینه'></input>
                                    <input className='form-input' type='url' name='link' placeholder='پیوند'></input>
                                </form>
                                <button className='px-4 py-1 text-sm text-zinc-600 font-semibold rounded-none border border-zinc-200 hover:text-white hover:bg-zinc-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2' type='submit' form='jomlehform'>نگارش</button>
                            </div>
                        )
                        : (
                            <div>
                                <p>ورود کن.</p>
                            </div>
                        )
                    }
                </main>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { getServerSession } = require("next-auth/next");
    const { authOptions } = require("../api/auth/[...nextauth]");

    const session = await getServerSession(context.req, context.res, authOptions);

    if (session) {
        const initFirebase = require('@/lib/firebase');
        await initFirebase();
        return fetchUser(session.accountId)
            .then(result => {
                return {
                    props: {
                        firebaseUser: result
                    }
                }
            })
            .catch(error => {
                return {
                    props: {
                        firebaseUser: null
                    }
                }
            })
    } else {
        return {
            props: {
                firebaseUser: null
            }
        }
    }
}
