"use client";

import React from "react";
import {
  FileText,
  Mail,
  Briefcase,
  ClipboardList,
  LayoutTemplate,
  Globe,
  Wifi,
  LayoutDashboard,
  Star,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  BarChart3,
  Target,
  Users,
  BookOpen,
  Video,
  TrendingUp,
  FileSearch,
  Building2,
  GraduationCap,
  HeartHandshake,
  Calendar,
  Shield,
  Zap,
  Clock,
  Award,
  MapPin,
  DollarSign,
  MessageSquare,
  Download,
  Upload,
  Settings,
  HelpCircle,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const HeaderClient = () => {
  const careerTools = [
    // Existing Tools
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

    // NEW FEATURES - Job Search & Applications
    {
      name: "Job Tracker",
      href: "/job-tracker",
      icon: Target,
      description: "Track applications & follow-ups",
      color: "red",
      category: "job-search",
    },
    {
      name: "Smart Applications",
      href: "/smart-applications",
      icon: Zap,
      description: "One-click job applications",
      color: "yellow",
      category: "job-search",
    },
    {
      name: "Company Research",
      href: "/company-research",
      icon: Building2,
      description: "Deep company insights",
      color: "blue",
      category: "job-search",
    },

    // NEW FEATURES - Learning & Development
    {
      name: "Skill Assessment",
      href: "/skill-assessment",
      icon: BarChart3,
      description: "Test your skills gap",
      color: "purple",
      category: "learning",
    },
    {
      name: "Learning Paths",
      href: "/learning-paths",
      icon: BookOpen,
      description: "Personalized courses",
      color: "green",
      category: "learning",
    },
    {
      name: "Certification Tracker",
      href: "/certifications",
      icon: Award,
      description: "Manage certifications",
      color: "amber",
      category: "learning",
    },

    // NEW FEATURES - Networking
    {
      name: "Networking Assistant",
      href: "/networking",
      icon: Users,
      description: "Connect with professionals",
      color: "indigo",
      category: "networking",
    },
    {
      name: "Mentorship",
      href: "/mentorship",
      icon: HeartHandshake,
      description: "Find career mentors",
      color: "pink",
      category: "networking",
    },

    // NEW FEATURES - Career Growth
    {
      name: "Career GPS",
      href: "/career-gps",
      icon: MapPin,
      description: "Career path prediction",
      color: "blue",
      category: "growth",
    },
    {
      name: "Salary Optimizer",
      href: "/salary-optimizer",
      icon: DollarSign,
      description: "Maximize your earnings",
      color: "green",
      category: "growth",
    },
    {
      name: "Promotion Planner",
      href: "/promotion-planner",
      icon: TrendingUp,
      description: "Plan your next move",
      color: "purple",
      category: "growth",
    },

    // NEW FEATURES - Interview & Negotiation
    {
      name: "AI Interview Simulator",
      href: "/ai-interview",
      icon: Video,
      description: "Practice with AI",
      color: "red",
      category: "interview",
    },
    {
      name: "Salary Negotiation",
      href: "/salary-negotiation",
      icon: DollarSign,
      description: "Get paid what you're worth",
      color: "green",
      category: "interview",
    },

    // NEW FEATURES - Portfolio & Brand
    {
      name: "Portfolio Builder",
      href: "/portfolio",
      icon: FileText,
      description: "Showcase your work",
      color: "blue",
      category: "brand",
    },
    {
      name: "LinkedIn Optimizer",
      href: "/linkedin-optimizer",
      icon: Users,
      description: "Boost your profile",
      color: "blue",
      category: "brand",
    },

    // NEW FEATURES - Analytics & Insights
    {
      name: "Career Analytics",
      href: "/career-analytics",
      icon: BarChart3,
      description: "Track your progress",
      color: "purple",
      category: "analytics",
    },
    {
      name: "Market Insights",
      href: "/market-insights",
      icon: TrendingUp,
      description: "Industry trends & data",
      color: "orange",
      category: "analytics",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      indigo: "bg-indigo-100 text-indigo-600",
      red: "bg-red-100 text-red-600",
      yellow: "bg-yellow-100 text-yellow-600",
      amber: "bg-amber-100 text-amber-600",
      pink: "bg-pink-100 text-pink-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return (
      colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
    );
  };

  const categories = {
    core: "🚀 Core Tools",
    discovery: "🔍 Career Discovery",
    "job-search": "💼 Job Search",
    learning: "📚 Learning & Skills",
    networking: "🤝 Networking",
    growth: "📈 Career Growth",
    interview: "🎯 Interview Prep",
    brand: "🌟 Personal Brand",
    analytics: "📊 Analytics",
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
              <p className="text-xs text-gray-500">50+ AI-powered tools</p>
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
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}

            <div className="px-3 py-2 border-t border-gray-100 mt-1 sticky bottom-0 bg-white">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  AI-powered career platform
                </p>
                <Link
                  href="/pricing"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upgrade →
                </Link>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden md:block">Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl">
            <DropdownMenuItem asChild className="p-3">
              <Link href="/resume/new" className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>New Resume</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3">
              <Link
                href="/cover-letter/new"
                className="flex items-center gap-3"
              >
                <Mail className="w-4 h-4 text-green-600" />
                <span>New Cover Letter</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3">
              <Link
                href="/interview/practice"
                className="flex items-center gap-3"
              >
                <Video className="w-4 h-4 text-purple-600" />
                <span>Practice Interview</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-3">
              <Link href="/job-tracker" className="flex items-center gap-3">
                <Target className="w-4 h-4 text-red-600" />
                <span>Track Applications</span>
              </Link>
            </DropdownMenuItem>
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
