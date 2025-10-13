"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Briefcase,
  FileText,
  MessageSquare,
  Pencil,
  Star,
  User,
  Rocket,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";

const HeroSection = () => {
  const features = [
    {
      title: "Career Path Guidance",
      desc: "Discover personalized career paths based on your interests, skills, and market demand.",
      icon: Target,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "AI Resume Builder",
      desc: "Create ATS-optimized resumes with AI-powered content suggestions and templates.",
      icon: FileText,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Interview Preparation",
      desc: "Practice with AI-powered mock interviews and get instant feedback on your responses.",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Smart Cover Letters",
      desc: "Generate tailored cover letters that match job descriptions perfectly.",
      icon: Pencil,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Skill Assessment",
      desc: "Identify your strengths and get personalized improvement recommendations.",
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Career Networking",
      desc: "Connect with mentors and professionals in your target industry.",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Careers Guided" },
    { number: "25K+", label: "Resumes Built" },
    { number: "15K+", label: "Interviews Practiced" },
    { number: "95%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      text: "The AI resume builder helped me land 3x more interviews. Absolutely game-changing!",
    },
    {
      name: "Mike Rodriguez",
      role: "Product Manager",
      text: "The career guidance feature showed me paths I never considered. Life-changing advice!",
    },
    {
      name: "Emily Watson",
      role: "Data Scientist",
      text: "Mock interviews prepared me so well that I aced my actual interviews with confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Trusted by 50,000+ professionals worldwide
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Launch Your Dream Career with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized career guidance, AI-optimized resumes, interview
            practice, and everything you need to accelerate your professional
            journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
              >
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools powered by AI to guide you through every step of
            your career journey
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from professionals who transformed their careers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
              >
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about getting started
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="bg-white border border-gray-200 rounded-2xl px-6"
          >
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600 py-4">
              How does the AI career guidance work?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
              Our AI analyzes your skills, interests, and experience to provide
              personalized career recommendations. It considers market trends,
              salary data, and growth opportunities to suggest the best paths
              for your unique profile.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="bg-white border border-gray-200 rounded-2xl px-6"
          >
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600 py-4">
              Is the resume builder really free?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
              Yes! Our basic AI resume builder is completely free forever. You
              get access to multiple templates, ATS optimization, and content
              suggestions. Premium features like unlimited exports and advanced
              analytics are available in our paid plans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="bg-white border border-gray-200 rounded-2xl px-6"
          >
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600 py-4">
              How effective is the interview practice?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
              Our AI interview simulator uses real interview questions from top
              companies and provides instant feedback on your answers,
              communication style, and confidence level. 95% of users report
              feeling more prepared after just 3 practice sessions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="bg-white border border-gray-200 rounded-2xl px-6"
          >
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600 py-4">
              Can I use this for career switching?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
              Absolutely! Our platform is specifically designed to help career
              changers. We provide skill gap analysis, transferable skills
              identification, and step-by-step transition plans to help you
              successfully switch careers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            with AI-powered guidance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Trial
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Secure & private
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global career opportunities
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
