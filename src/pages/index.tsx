import Head from 'next/head';
import { initializeApp } from 'firebase/app';
import { signIn } from "next-auth/react"

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
      <Head>
        <title>Jomleha Panel</title>
        <meta name="description" content="Jomleha Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
