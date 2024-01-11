import { Inter } from 'next/font/google'
import Head from 'next/head'
import React, { useState } from 'react';
import UploadComponent from './components/UploadComponent'
import SearchBar from './components/SearchBar'
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ['latin'] })

const FilesView = () => <SearchBar />;
const UploadView = () => <UploadComponent />;

const Menu = ({ onMenuSelect }) => (
  <nav>
    <button onClick={() => onMenuSelect('files')}>Files</button>
    <button onClick={() => onMenuSelect('upload')}>Upload</button>
  </nav>
);

export default function Home() {

  const [currentView, setCurrentView] = useState('home');

  const handleMenuSelect = (view) => {
    setCurrentView(view);
  };

  let CurrentComponent;
  switch (currentView) {
    case 'upload':
      CurrentComponent = UploadView;
      break;
    default:
      CurrentComponent = FilesView;
  }

  return (
    <>
      <Head>
        <title>Magi</title>
      </Head>
      <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}> 
        <Menu onMenuSelect={handleMenuSelect} />
        <div>
          <CurrentComponent />
          <Button>Button</Button>
        </div>
      </main>
    </>
  )
}