"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Star,
  Zap,
  Crown,
  Users,
  Building2,
  School,
  BadgeCheck,
  IndianRupee,
} from "lucide-react";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      description:
        "Perfect for students and job seekers starting their career journey",
      price: {
        monthly: 499,
        annual: 4999,
      },
      popular: false,
      icon: Star,
      features: [
        "5 AI-generated resumes per month",
        "3 Cover letters per month",
        "Basic ATS score checking",
        "Standard resume templates",
        "Career path suggestions",
        "Email support",
        "Basic interview practice (10 sessions/month)",
      ],
      cta: "Get Started",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Professional",
      description: "Ideal for serious job seekers and career changers",
      price: {
        monthly: 1499,
        annual: 14999,
      },
      popular: true,
      icon: Zap,
      features: [
        "Unlimited AI resumes & cover letters",
        "Advanced ATS optimization",
        "Priority AI interview coach",
        "Premium resume templates",
        "Career path analytics",
        "Skill gap analysis",
        "Priority email & chat support",
        "LinkedIn optimization",
        "Salary negotiation guide",
        "Unlimited interview practice",
      ],
      cta: "Start Free Trial",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Enterprise",
      description: "For organizations and career coaching businesses",
      price: {
        monthly: 4999,
        annual: 49999,
      },
      popular: false,
      icon: Crown,
      features: [
        "Everything in Professional",
        "White-label solutions",
        "Team management dashboard",
        "API access",
        "Custom branding",
        "Dedicated account manager",
        "Advanced analytics",
        "Custom template creation",
        "Bulk user management",
        "SLA guarantee",
        "Training & onboarding",
      ],
      cta: "Contact Sales",
      color: "from-amber-500 to-amber-600",
    },
  ];

  const savings = {
    Starter: "Save ₹989",
    Professional: "Save ₹2989",
    Enterprise: "Save ₹9989",
  };

  const useCases = [
    {
      title: "Students & Graduates",
      description: "Kickstart your career with professional tools",
      icon: School,
      recommended: "Starter",
    },
    {
      title: "Job Seekers",
      description: "Accelerate your job search with AI-powered tools",
      icon: Users,
      recommended: "Professional",
    },
    {
      title: "Career Coaches",
      description: "Scale your coaching business with enterprise tools",
      icon: Building2,
      recommended: "Enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your career journey. All plans include
            our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 p-1 mb-8">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                billingPeriod === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${
                billingPeriod === "annual"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <Card
                key={index}
                className={`relative bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                  isPopular
                    ? "border-purple-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <IndianRupee className="w-6 h-6 text-gray-900" />
                      <span className="text-4xl font-bold text-gray-900">
                        {billingPeriod === "monthly"
                          ? plan.price.monthly
                          : plan.price.annual}
                      </span>
                      <span className="text-gray-600">
                        /{billingPeriod === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingPeriod === "annual" && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        {savings[plan.name]}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full py-3 text-base font-semibold ${
                      isPopular
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Use Cases */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Who's It For?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-200 text-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    Recommended: {useCase.recommended}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate the difference.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. No credit
                card required to start.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept UPI, Net Banking, Credit/Debit Cards, and all major
                Indian payment methods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer discounts for students?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 50% discount for verified students. Contact our
                support team with your student ID.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are there any hidden charges?
              </h3>
              <p className="text-gray-600">
                No hidden charges. All prices include GST. You'll see the final
                amount before payment.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of Indian professionals who have transformed their
              careers with AI-powered tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start 14-Day Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              All prices in Indian Rupees (₹) • GST included • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
