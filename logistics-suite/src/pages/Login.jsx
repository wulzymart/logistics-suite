import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import Logo from "../components/assets/fll1.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { app } from "../firebase/firebase";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();

  const handleSubmit = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
    setEmail("");
    setPassword("");
  };
  return (
    <div className="h-screen flex items-center bg-white dark:text-gray-200 dark:bg-secondary-dark-bg ">
      <div className="flex flex-col gap-4 w-[80%] md:w-[300px] mx-auto">
        <div className="w-20 mx-auto mb-6">
          <img src={Logo} alt="first line logistics logo" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-red-500 text-end"
        >
          Forgot Your Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
