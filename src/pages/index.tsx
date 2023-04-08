import { initializeApp } from 'firebase/app';
import { signIn } from "next-auth/react";
import { GetServerSideProps } from 'next';

const firebaseConfig = {
  apiKey: "AIzaSyAPgI4pxTLDOM5xnY-OLFRfiHw-7yuur4M",
  authDomain: "jomlehasocialpanel.firebaseapp.com",
  projectId: "jomlehasocialpanel",
  storageBucket: "jomlehasocialpanel.appspot.com",
  messagingSenderId: "759540614073",
  appId: "1:759540614073:web:ee058ef6cc801a848f6c68",
  measurementId: "G-9YSZQEE08T"
};

const app = initializeApp(firebaseConfig);

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
