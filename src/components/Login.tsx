'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { setItem } from '@/actions/localStorage';

const Login: React.FC = () => {
  const { setAuthState } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleEmailTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value)
  }
  const handlePasswordTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value)
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const formData = {
      email,
      password
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const failedResponse = await response.json();
        throw new Error(`Login failed, ${failedResponse.careconnect.message}`);
      }
      setStatus("Success! Login successfull");
      const { careconnect } = await response.json();
      const { token } = careconnect;
      setItem('authstate', careconnect);
      setAuthState(careconnect);
      document.cookie = `token=${token};  path=/; samesite=strict`
      router.push(`/dashboard`)
    } catch (error: unknown) {
      setStatus(`${error}`);
    }
  };
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8" >
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
        <div className="lg:col-span-2 lg:py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose CareConnect?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-xl mr-3">💬</span>
              <p>Connect with top healthcare professionals</p>
            </li>
            <li className="flex items-start">
              <span className="text-xl mr-3">🩺</span>
              <p>View and manage your medical records</p>
            </li>
            <li className="flex items-start">
              <span className="text-xl mr-3">📅</span>
              <p>Book and track appointments with ease</p>
            </li>
            <li className="flex items-start">
              <span className="text-xl mr-3">🛡️</span>
              <p>Securely update your personal information</p>
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/signup" className="w-full bg-blue-500 text-white text-sm font-medium p-4 rounded-lg hover:bg-blue-600 transition">
              Get Started
            </Link>
          </div>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-3xl font-bold sm:text-2xl">Login to Your CareConnect Account!</h1>
          </div>
          <form action="#" className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailTextChange}

                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordTextChange}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                No account?
                <Link className="underline" href="/signup">Sign up</Link>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                Sign in
              </button>
            </div>
            {status && <p className="text-red-500">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login