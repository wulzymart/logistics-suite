import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../components/button/button";
import Input from "../components/input/input";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const auth = getAuth(app);
  const handleResetPassword = async () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent ");
        setEmail("");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Forgot Your Password?</h2>
        <p className="mb-4">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>
        <CustomButton handleClick={handleResetPassword}>
          Reset Password
        </CustomButton>
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-red-500 text-end"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
