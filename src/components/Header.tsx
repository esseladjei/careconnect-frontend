import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function Header() {
  return (
    <header>
      <nav className="relative container mx-auto p-6">
        {/* <!-- Flex container --> */}
        <div className="flex items-center justify-between">
          {/*    <!--Logo --> */}
          <div className="pt-2">
            <Image src="/images/logo.png" className="w-full h-auto" width="0" height="0" sizes="5vw"  alt="logo" priority />
          </div>
          {/*  <!--Menu Items--> */}
          <div className="hidden md:flex space-x-6">          
            <Link href="/dashboard" className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">Dashboard</Link>
            <Link href="/client" className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">Client</Link>
            <Link href="/practitioner" className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">Practitioner</Link>
            <Link href="/aboutus" className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">About Us</Link>
          </div>
          {/*  <!-- Button --> */}
          <Link href="" className="hidden md:block p-3 px-6-pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight">Sign Up</Link>
        </div>
      </nav>
    </header>

  )
}

export default Header