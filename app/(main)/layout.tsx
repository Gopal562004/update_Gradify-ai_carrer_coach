import React from "react";
import { Analytics } from "@vercel/analytics/next";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-white">
      {/* Main content will render here */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Analytics />
    </div>
  );
};

export default MainLayout;
