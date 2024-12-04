'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import DropDown from './Dropdown';

function Header() {
  const { authState, setAuthState } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!authState) {

      router.push("/"); // Redirect if no authState
    }
  }, [authState, router]);
  const handleLogout = () => {
    setAuthState(null); // Clears state
    localStorage.removeItem('authstate')
    document.cookie = "token=; path=/; domain=example.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict";
  };
  return (
    <header>
      <nav className="relative container mx-auto p-6">
        {/* <!-- Flex container --> */}
        <div className="flex items-center justify-between">
          {/*  <!--Logo --> */}
          <div className="pt-2">
            <Image src="/images/logo.png" className="w-full h-auto" width="0" height="0" sizes="5vw" alt="logo" priority />
          </div>
          {/*  <!--Menu Items--> */}
          <div className="hidden md:flex space-x-6">
            {authState && (
              <>
                <Link href={`/dashboard/${authState.role}/${authState.id}`} className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">
                  Dashboard
                </Link>
              </>
            )}
        
            <Link href="/aboutus" className="p-3 rounded-md w-auto flex items-center hover:text-blue-600 hover:bg-blue-100">
                  About Us
            </Link>
            {authState && (<DropDown onLogout={handleLogout} user={authState} />)}
          </div>
        </div>
      </nav>
    </header>

  )
}

export default Header