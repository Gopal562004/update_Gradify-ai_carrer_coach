import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen py-8">
      <div className="w-full max-w-md mx-4">
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
