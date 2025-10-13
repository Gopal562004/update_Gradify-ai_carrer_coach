import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <div className="w-full max-w-md mx-4">
        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
