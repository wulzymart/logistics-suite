import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-700">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg"
      >
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
