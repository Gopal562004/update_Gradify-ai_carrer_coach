import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="flex justify-center items-center min-h-screen p-4">
        {/* Auth pages will render here */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
