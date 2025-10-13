export const dynamic = "force-dynamic"; // Force dynamic rendering
import Image from "next/image";
import Link from "next/link";
import HeaderClient from "./HeaderClient";
import { checkUser } from "../../lib/checkUser"; // Import your checkUser function

const Header = async () => {
  const user = await checkUser(); // ✅ Get current user (server-side)

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">AI</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Ai-Career
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                Intelligent Career Platform
              </span>
            </div>
          </Link>

          {/* Right: Auth Buttons */}
          <HeaderClient />
        </div>
      </nav>
    </header>
  );
};

export default Header;
