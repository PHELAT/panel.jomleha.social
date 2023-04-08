import { signIn } from "next-auth/react";
import { GetServerSideProps } from 'next';

export default function Home() {
  return (
    <>
      <div className='flex flex-col h-screen justify-between'>
        <main className='w-full h-full flex items-center justify-center px-8'>
          <div className='flex flex-col gap-4'>
            <button className='px-4 py-1 text-sm text-zinc-600 font-semibold rounded-none border border-zinc-200 hover:text-white hover:bg-zinc-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2' onClick={login}>ورود</button>
          </div>
        </main>
      </div>
    </>
  )
}

function login() {
  signIn('twitter', { callbackUrl: '/api/login' })
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { getServerSession } = require("next-auth/next");
  const { authOptions } = require("./api/auth/[...nextauth]");

  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        statusCode: 302,
        destination: '/negaresh'
      }
    }
  } else {
    return {
      props: {}
    }
  }
}
