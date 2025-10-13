import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header/Header";
import "../styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

// Google Font
const inter = Inter({ subsets: ["latin"] });

// Page Metadata
export const metadata: Metadata = {
  title: "AI Career Coach - Intelligent Career Platform",
  description:
    "AI-powered career guidance platform with industry insights, resume building, interview preparation, and personalized career mapping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* Global Header */}
            <Header />

            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#ffffff",
                  color: "#1f2937",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  padding: "12px 16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />

            {/* Main Page Content */}
            <main className="flex-grow min-h-screen bg-gray-50">
              {children}
            </main>

            {/* Enhanced Footer - Light Theme */}
            <footer className="bg-white border-t border-gray-200 text-gray-600">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {/* Brand Section */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">AI</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          AI Career Coach
                        </h3>
                        <p className="text-sm text-blue-600">
                          Intelligent Career Platform
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Your AI-powered career companion. Get personalized
                      guidance, industry insights, and career tools to
                      accelerate your professional journey.
                    </p>
                    <div className="flex space-x-3">
                      <a
                        href="https://linkedin.com"
                        className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600 hover:text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://twitter.com"
                        className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600 hover:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a
                        href="mailto:support@aicareercoach.com"
                        className="p-2 bg-gray-100 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600 hover:text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Explore
                    </h3>
                    <ul className="space-y-3">
                      {[
                        {
                          href: "/dashboard",
                          label: "Industry Insights",
                          icon: "📊",
                        },
                        {
                          href: "/resume",
                          label: "Resume Builder",
                          icon: "📝",
                        },
                        {
                          href: "/interview",
                          label: "Interview Prep",
                          icon: "🎯",
                        },
                        {
                          href: "/gemini_res",
                          label: "Interest Mapping",
                          icon: "🗺️",
                        },
                        {
                          href: "/career-paths",
                          label: "Career Paths",
                          icon: "🚀",
                        },
                      ].map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
                          >
                            <span>{item.icon}</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {item.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Resources
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { href: "/blog", label: "Career Blog", icon: "📚" },
                        { href: "/faqs", label: "FAQs", icon: "❓" },
                        {
                          href: "/community",
                          label: "Community Forum",
                          icon: "👥",
                        },
                        {
                          href: "/support",
                          label: "Support Center",
                          icon: "🛟",
                        },
                        { href: "/guides", label: "Career Guides", icon: "📖" },
                      ].map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
                          >
                            <span>{item.icon}</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {item.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Contact Us
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>support@aicareercoach.com</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span>🌐</span>
                        <span>24/7 Online Support</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span>⚡</span>
                        <span>Quick Response Time</span>
                      </p>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 text-center">
                        🚀 Powered by AI • 🤖 Real-time Insights • 💼
                        Professional Tools
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-500">
                      © {new Date().getFullYear()} AI Career Coach. All rights
                      reserved.
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-500">
                      <a
                        href="/privacy"
                        className="hover:text-gray-900 transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="/terms"
                        className="hover:text-gray-900 transition-colors duration-200"
                      >
                        Terms of Service
                      </a>
                      <a
                        href="/cookies"
                        className="hover:text-gray-900 transition-colors duration-200"
                      >
                        Cookie Policy
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
