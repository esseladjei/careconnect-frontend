'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SignUpType } from '../../types/typesdefinitions';
import SignUpMessage from './SignUpMessage';
const SignUp: React.FC = () => {
  const router = useRouter();
  const userData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    termsconsent: 1,
    appupdatesconsent: 0
  }
  const [signUpData, setSignUpData] = useState<SignUpType>(userData);
  const [status, setStatus] = useState<string | null>(null);
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (!res.ok) {
        console.log(res)
        throw new Error("Signup failed");
      }
      setStatus("Success! Account created successfully");
      const createdAccount = await res.json();
      router.push(`/dashboard/${createdAccount.id}`)
    } catch (error: unknown) {
      setStatus(`Error: ${error}`);
    }

  }
  const handleVerifyPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setVerifyPassword(value);
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setSignUpData({ ...signUpData, [id]: value });
  }

  return (
    <>
      <section className="container px-0 mx-auto md:container md:mx-auto bg-white">
        <div className="lg:grid lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <Image
              alt="Video call with a doctor"
              layout="fill" // Fills the parent container
              objectFit="cover" // Ensures aspect ratio is maintained
              src="/images/istockphoto.jpg"
              className="w-full h-full absolute inset-0 object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <SignUpMessage
                linkClass='block text-white'
                headlineClass='mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl'
                paragraphClass='text-white/90'
              />
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <SignUpMessage
                  linkClass='inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20'
                  headlineClass='mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl'
                  paragraphClass='mt-4 leading-relaxed text-gray-500'
                />
              </div>

              <form action="#" className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleSignUp}>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.firstname || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.lastname || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.email || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.password || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="passwordconfirmation" className="block text-sm font-medium text-gray-700">
                    Password Confirmation
                  </label>

                  <input
                    type="password"
                    id="passwordconfirmation"
                    name="passwordconfirmation"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={verifyPassword || ''}
                    onChange={handleVerifyPasswordChange}
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="appupdatesconsent"
                      name="appupdatesconsent"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                      value={signUpData?.appupdatesconsent || ''}
                      onChange={handleChange}
                    />

                    <span className="text-sm text-gray-700">
                      I want to receive emails about account status, product updates and company announcements.
                    </span>
                  </label>
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our
                    <Link href="#" className="text-gray-700 underline"> terms and conditions </Link>
                    and
                    <Link href="#" className="text-gray-700 underline"> privacy policy</Link>.
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button className="inline-block shrink-0 rounded-md border border-blue-600
                   bg-blue-600  px-12 py-3 text-sm font-medium text-white transition w-full md:w-auto
                    hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500" >
                    Create an account
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link href="/" className="text-gray-700 underline">Log in</Link>.
                  </p>
                </div>
                {status && <p className='col-span-6'>{status}</p>}
              </form>
            </div>
          </main>
        </div>
      </section>

    </>
  )
}

export default SignUp;