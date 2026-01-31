import React from 'react';
import { useState } from "react";

const Register: React.FC = () => {
  const [email, setEmail] = useState("micheal.oppong@gmail.com");
  const [password, setPassword] = useState("123456");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register New User</h2>

        <form>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-600 mb-1">
              Firstname:
            </label>
            <input
              type="text"
              id="firstname"
              placeholder="Enter your firstname"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>
             <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-600 mb-1">
              Lastname:
            </label>
            <input
              type="text"
              id="lastname"
              placeholder="Enter your lastname"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="reg-email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;