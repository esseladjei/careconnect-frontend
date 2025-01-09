import Image from 'next/image';

import React from 'react';
import { CardProp } from '../../types/typesdefinitions';

const Card: React.FC<CardProp> = ({ practitioner }) => {


  return (

    <div className="max-w-4xl mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
      {/*  <!-- Profile Image --> */}
      <div className="flex-shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
          alt="Practitioner Profile"
          className="w-28 h-28 object-cover rounded-full border-2 border-gray-300"
          width={100}
          height={100}
        />
      </div>

      {/*  <!-- Main Content --> */}
      <div className="flex-1">
        {/*  <!-- Header --> */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800">{practitioner.lastname} {practitioner.firstname}</h2>
            <p className="text-gray-500">{practitioner.location} | <span className="font-semibold">{practitioner.year_of_experience} Years of Experience</span></p>
          </div>
          <div>
            <p className="text-gray-700 ">Fees in GH¢.</p>
            <p className="text-1xl font-bold text-gray-800">GH¢ {practitioner.fee}</p>
          </div>
        </div>
        {/*  <!-- Details Section --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
          {/*  <!-- Location --> */}
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📍</span>
            <p><span className="font-semibold">Location:</span> {practitioner.location}</p>
          </div>

          {/*  <!-- Experience --> */}
          <div className="flex items-center gap-2">
            <span className="text-green-500">🎓</span>
            <p><span className="font-semibold">Experience:</span> {practitioner.year_of_experience}  Years</p>
          </div>


          {/*  <!-- Availability --> */}
          <div className="flex items-start gap-2">
            <span className="text-purple-500">📅</span>
            <p className="capitalize"><span className="font-semibold ">Availability:</span> {practitioner.availability?.toString()}</p>
          </div>

          {/*  <!-- Appointment Options --> */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">🕒</span>
            <p className="capitalize"><span className="font-semibold ">Appointment:</span>{practitioner.appointment_type?.toString()}</p>
          </div>

        </div>
        <div className="grid grid-cols-1  gap-4 mt-6 text-gray-700 text-sm">
          {/*  <!-- Specialisations --> */}
          <div className="flex items-start gap-2">
            <span className="text-red-500">🩺</span>
            <p>
              <span className="font-semibold">Specialisations:</span>
              {practitioner.specialisations?.map((spec) => (
                <span key={spec.specialisationId} className="inline-block bg-gray-200 px-2 py-1 rounded-md text-gray-700 text-xs mr-1">{spec.name !== '' ? spec.name : 'General Doctor'}</span>
              ))} 
            </p>
          </div>
        </div>
        {/*  <!-- Footer (CTA Buttons) --> */}
        <div className="mt-6 flex justify-end gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
            Book Appointment
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200">
            View Profile
          </button>
        </div>
      </div>
    </div>

  )
}

export default Card