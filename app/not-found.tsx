import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  AlertCircle,
  Ghost,
  Satellite,
} from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon/Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="relative">
              <Satellite className="w-16 h-16 text-gray-400 animate-pulse" />
              <AlertCircle className="w-8 h-8 text-blue-500 absolute -top-2 -right-2" />
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-0 left-1/4 w-6 h-6 bg-yellow-100 rounded-full animate-bounce"></div>
          <div className="absolute top-4 right-1/4 w-4 h-4 bg-blue-100 rounded-full animate-bounce delay-75"></div>
          <div className="absolute bottom-2 left-1/3 w-5 h-5 bg-purple-100 rounded-full animate-bounce delay-150"></div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm mb-4">
            <Ghost className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Error 404</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into
            the digital void. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            asChild
            className="bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Link href="/" className="flex items-center gap-2 px-6 py-3">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>

          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-transparent hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Link href="/" className="flex items-center gap-2 px-6 py-3">
              <Home className="w-4 h-4" />
              Home Page
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Compass className="w-3 h-3" />
            Still lost?{" "}
            <Link
              href="/contact"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
