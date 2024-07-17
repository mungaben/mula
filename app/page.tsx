import React from 'react'
import WalletBalance from '../components/homepage/WalletBalance'
import Portfolio from '../components/homepage/Portfolio'
import WalletList from '../components/homepage/WaletBalance'
import Header from '../components/homepage/Header'
import Navbar from '../components/homepage/Navbar'

const page = () => {
  return (
      <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <main className="p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4">
        <div className="md:col-span-2">
          <WalletBalance />
        </div>
        <Portfolio />
        <WalletList />
      </main>
    </div>
  )
}

export default page