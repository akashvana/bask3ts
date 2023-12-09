import Image from 'next/image'
import { Inter } from 'next/font/google'
// import Mywallet from './wallet'
import MyWallet from '../components/CreateSmartAccount'
import Header from '@/components/Header'
import 'bootstrap/dist/css/bootstrap.css'
import firstpage from '../pages/public/firstpage.png'

import Mymodal from "../components/Mymodal"
import Link from "next/link"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Header/>
       <MyWallet />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <div className="container text-center">
  <div className="row">
    <div className="col-4">
    <Image src= {firstpage} alt=" " height="50%" width="50%"  />

    <Mymodal />
    </div>
    <div className="col-8">
    You don’t have to be a digital marketing pro to know how important a website is to modern business. As both a digital interface for delivering products and services and a vehicle for generating leads, your website needs to look good. If you want to deliver a smooth customer experience and look good while doing it, a web designer can help.
    <br />
    <Link href="/buckets" className="hover:text-blue-200">
    <button type="button" className="btn btn-primary">Launch</button>
    </Link>
    </div>
  </div>
</div>
        </div>
      </div>
    </main>
  )
}
