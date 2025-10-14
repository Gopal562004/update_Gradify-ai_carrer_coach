"use client";

import React from "react";
import {
  Mail,
  ClipboardList,
  LayoutTemplate,
  Globe,
  LayoutDashboard,
  Star,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const HeaderClient = () => {
  const careerTools = [
    {
      name: "Build Resume",
      href: "/resume",
      icon: LayoutTemplate,
      description: "Create professional resumes",
      color: "blue",
      category: "core",
    },
    {
      name: "Cover Letter",
      href: "/ai-cover-letter",
      icon: Mail,
      description: "AI-powered letters",
      color: "green",
      category: "core",
    },
    {
      name: "Interview Prep",
      href: "/interview",
      icon: ClipboardList,
      description: "Ace your interviews",
      color: "purple",
      category: "core",
    },
    {
      name: "Interest Map",
      href: "/gemini_res",
      icon: Globe,
      description: "Discover career paths",
      color: "indigo",
      category: "discovery",
    },
    {
      name: "Career Platform",
      href: "https://clean-sangam.vercel.app/",
      icon: ExternalLink,
      description: "Jobs, Network, Events & more",
      color: "red",
      category: "platform",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      indigo: "bg-indigo-100 text-indigo-600",
      red: "bg-red-100 text-red-600",
    };
    return (
      colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
    );
  };

  const categories = {
    core: "🚀 Core Tools",
    discovery: "🔍 Career Discovery",
    platform: "🌐 Career Platform",
  };

  const groupedTools = careerTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof careerTools>);

  return (
    <div className="flex items-center space-x-3">
      <SignedIn>
        {/* Industry Insights Button */}
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:block font-medium">
              Industry Insights
            </span>
          </Button>
        </Link>

        {/* Career Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700 hover:text-amber-800 hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Star className="w-4 h-4" />
              <span className="hidden md:block font-medium">Career Tools</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl p-2"
            align="end"
          >
            <div className="px-3 py-2 border-b border-gray-100 sticky top-0 bg-white z-10">
              <p className="text-sm font-semibold text-gray-900">
                Career Toolkit
              </p>
              <p className="text-xs text-gray-500">AI-powered tools</p>
            </div>

            {Object.entries(groupedTools).map(([category, tools]) => (
              <div key={category} className="mb-2">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {categories[category as keyof typeof categories]}
                  </p>
                </div>
                {tools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem
                      key={index}
                      asChild
                      className={`p-3 rounded-lg hover:bg-${tool.color}-50 cursor-pointer transition-colors mb-1 last:mb-0`}
                    >
                      {tool.category === "platform" ? (
                        <a
                          href={tool.href}
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full"
                        >
                          <div
                            className={`p-2 rounded-lg ${getColorClasses(
                              tool.color
                            )}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {tool.description}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <Link
                          href={tool.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <div
                            className={`p-2 rounded-lg ${getColorClasses(
                              tool.color
                            )}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <div className="border-l border-gray-200 pl-3 ml-1">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-9 h-9 border-2 border-blue-200 shadow-sm",
                userButtonAvatar: "rounded-full",
                userButtonAction: "hidden",
              },
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        {/* Sign In Button */}
        <Link href="/sign-in">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md px-4"
          >
            <LogIn className="w-4 h-4" />
            <span className="font-medium">Sign In</span>
          </Button>
        </Link>

        {/* Sign Up Button */}
        <Link href="/sign-up">
          <Button
            variant="default"
            className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4"
          >
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">Sign Up</span>
          </Button>
        </Link>
      </SignedOut>
    </div>
  );
};

export default HeaderClient;
