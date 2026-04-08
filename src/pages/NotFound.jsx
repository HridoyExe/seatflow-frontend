import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <AlertCircle className="w-24 h-24 text-primary-500 mb-6" />
      <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-2xl text-slate-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary text-white rounded-full px-8 shadow-md hover:shadow-lg transition-all">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
