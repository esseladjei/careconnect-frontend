import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function Footer() {
  return (
    <footer className="bg-veryDarkBlue">
      <div className="container flex flex-col-reverse justify-between px-6 py-10 mx-auto space-y-8 md:flex-row md:space-y-0">
        <div className="flex flex-col-reverse items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start">
          <div className="mx-auto my-6 text-center text-white md:hidden">
            Copyright &copy; 2022, All Rights Reserved
          </div>
          <div>
            <Image src="/images/logo.png" className="w-full h-auto" width="0" height="0" sizes="5vw" alt="careconnect" />
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="#">
              <Image src="/images/svgs/icon-facebook.svg" width="0" height="0" sizes="100vw"  className="w-full h-auto" alt="facebook"/>
            </Link>
            <Link href="#">
              <Image src="/images/svgs/icon-youtube.svg"width="0"  height="0" sizes="100vw" className="w-full h-auto"  alt="youtube"  />
            </Link>
            <Link href="#">
              <Image src="/images/svgs/icon-twitter.svg"width="0" height="0" sizes="100vw" className="w-full h-auto"  alt="twitter"/>
            </Link>
            <Link href="#">
              <Image src="/images/svgs/icon-instagram.svg" width="0" height="0" sizes="100vw" className="w-full h-auto"  alt="instagram"/>
            </Link>
          </div>
        </div>

        <div className="flex justify-around space-x-32">
          <div className="flex flex-col space-y-3 text-white">
            <Link href="#" className="hover:text-cyanBlue">Home </Link>
            <Link href="#" className="hover:text-cyanBlue">Pricing </Link>
            <Link href="#" className="hover:text-cyanBlue">Customer Service</Link>
            <Link href="#" className="hover:text-cyanBlue">About </Link>
          </div>
          <div className="flex flex-col space-y-3 text-white">
            <Link href="#" className="hover:text-cyanBlue">Careers </Link>
            <Link href="#" className="hover:text-cyanBlue">Privacy Policy </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="hidden text-white md:block">
            Copyright &copy; 2022, All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer