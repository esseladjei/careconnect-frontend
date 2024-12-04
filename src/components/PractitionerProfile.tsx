'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { PractitionerProps } from '../../types/typesdefinitions';

const PractitionerProfile: React.FC<PractitionerProps> = ({ practitioner }) => {
  const router = useRouter()
  const [formData, setFormData] = useState(practitioner);
  const [status, setStatus] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const token = Cookies.get('token')

    if (!token) {
      router.replace('/') // If no token is found, redirect to login page
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/practitioners/${practitioner.practitionerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update practitioner");
      }
      setStatus("Success! practitioner updated.");
      router.push('/dashboard')
    } catch (error: unknown) {
      setStatus(`Error: Could not update practitioner. ${error}`);
    }
  };
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <p className="max-w-xl text-lg">
              Your Health, Your Data, Your Control – Update Your Personal Information Easily with CareConnect!
            </p>

            <div className="mt-8">
              <p className='pb-2'>Need help? Contact careconnect now!</p>
              <a href="tel:+233(20)8794323<" className="text-2xl font-bold text-pink-600">+233(20)8794323</a>
              <address className="mt-2 not-italic">Mandichostrasse 1A, 86504, Merching-Germany</address>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="#" className="space-y-4" onSubmit={handleSubmit} >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="name">Firstname</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Firstname"
                    type="text"
                    id="firstname"
                    value={formData?.firstname || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="name">Lastname</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Lastname"
                    type="text"
                    id="lastname"
                    value={formData?.lastname || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="name">Othername</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder=""
                    type="text"
                    id="othername"
                    value={formData?.othername || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <select
                    name="HeadlineAct"
                    id="HeadlineAct"
                    className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                    required
                    value={formData?.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>

                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="email">Email</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Email address"
                    type="email"
                    id="email"
                    value={formData?.email || ''}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="phonenumber:">Phone</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Phone Number"
                    type="text"
                    id="phonenumber"
                    value={formData?.phonenumber || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="name">Profession</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Profession"
                    type="text"
                    id="profession"
                    value={formData?.profession || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="name">Address</label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Address"
                    type="text"
                    id="address"
                    value={formData?.address || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="message">Extra Bioinformation </label>
                <textarea
                  className="w-full rounded-lg border-gray-200 p-3 text-sm"
                  placeholder="Extra Bioinformation"
                  rows={3}
                  id="bio"
                  value={formData?.bio || ''}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-block w-full rounded-lg bg-cyanBlue hover:bg-cyanBlueLight focus:outline-none px-5 py-3 font-medium text-white sm:w-auto"
                >
                  Update
                </button>
              </div>
              {status && <p>{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default PractitionerProfile;
