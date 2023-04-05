import Head from 'next/head'

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
            <form className='flex flex-col gap-4' id='jomlehform' method='post' action='/api/negaresh'>
              <textarea className='form-textarea' name='jomleh' placeholder='جمله'></textarea>
              <input className='form-input' type='text' name='context' placeholder='زمینه'></input>
              <input className='form-input' type='url' name='link' placeholder='پیوند'></input>
            </form>
            <button className='px-4 py-1 text-sm text-zinc-600 font-semibold rounded-none border border-zinc-200 hover:text-white hover:bg-zinc-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2' type='submit' form='jomlehform'>نگارش</button>
          </div>
        </main>
      </div>
    </>
  )
}
