import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
      
      {/* Large Error Code and Emoji */}
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4 tracking-widest">
        404
      </h1>
      <p className="text-4xl font-semibold text-gray-800 mb-6">
        Page Not Found
      </p>

      {/* Descriptive Message */}
      <div className="max-w-md bg-white p-6 rounded-xl shadow-xl">
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Go to Homepage
          </a>
      
        </div>
      </div>
      
    </div>
  );
};

export default NotFoundPage;