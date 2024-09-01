import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Order Management App</title>
        <meta name="description" content="Order Management App for Modular Kitchen Company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
