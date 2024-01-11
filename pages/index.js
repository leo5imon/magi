import { Inter } from 'next/font/google'
import Head from 'next/head'
import React from 'react';
import UploadComponent from './components/UploadComponent'
import SearchBar from './components/SearchBar'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Magi</title>
      </Head>
      <main className={`${inter.className}`}> 
        <UploadComponent />
        <div>
          <SearchBar />
        </div>
        <Toaster />
      </main>
    </>
  )
}