"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Sparkles,
  Users,
  Building2,
  School,
  BadgeCheck,
  IndianRupee,
  ArrowRight,
  Shield,
  Clock,
  Infinity,
  ChevronDown,
  Rocket,
} from "lucide-react";
import { getUserSubscription, upgradePlan, startFreeTrial } from "@/actions/subscription";
import UpgradeModal from "@/components/UpgradeModal";
import toast from "react-hot-toast";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  async function loadCurrentPlan() {
    try {
      const sub = await getUserSubscription();
      setCurrentPlan(sub?.plan || "FREE");
    } catch (err) {
      console.error("Failed to load subscription:", err);
      setCurrentPlan("FREE");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planKey) {
    if (planKey === "ENTERPRISE") {
      window.location.href = "mailto:sales@gradify.ai?subject=Enterprise Plan Inquiry";
      return;
    }

    if (planKey === "FREE") return;

    setUpgradeLoading(planKey);
    try {
      const result = await upgradePlan(planKey, billingPeriod.toUpperCase());
      if (result.success) {
        toast.success(result.message);
        setCurrentPlan(planKey);
      }
    } catch (err) {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setUpgradeLoading(null);
    }
  }

  async function handleFreeTrial() {
    setUpgradeLoading("TRIAL");
    try {
      const result = await startFreeTrial();
      if (result.success) {
        toast.success(result.message);
        setCurrentPlan("PROFESSIONAL");
      }
    } catch (err) {
      toast.error(err.message || "Could not start trial.");
    } finally {
      setUpgradeLoading(null);
    }
  }

  const plans = [
    {
      key: "FREE",
      name: "Free",
      description: "Try our AI features with free tokens — no credit card required",
      price: { monthly: 0, annual: 0 },
      popular: false,
      icon: Sparkles,
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-200",
      features: [
        { text: "2 AI-generated resumes", included: true },
        { text: "1 Cover letter", included: true },
        { text: "3 Interview practice sessions", included: true },
        { text: "2 ATS score checks", included: true },
        { text: "1 Career evaluation", included: true },
        { text: "Standard resume templates", included: true },
        { text: "Career path suggestions", included: true },
        { text: "Priority support", included: false },
        { text: "Premium templates", included: false },
      ],
      cta: "Current Plan",
      ctaVariant: "outline",
    },
    {
      key: "STARTER",
      name: "Starter",
      description: "Perfect for students and job seekers starting their career journey",
      price: { monthly: 499, annual: 4999 },
      popular: false,
      icon: Star,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
      features: [
        { text: "5 AI-generated resumes per month", included: true },
        { text: "3 Cover letters per month", included: true },
        { text: "10 Interview sessions per month", included: true },
        { text: "5 ATS score checks per month", included: true },
        { text: "3 Career evaluations per month", included: true },
        { text: "Standard resume templates", included: true },
        { text: "Career path suggestions", included: true },
        { text: "Email support", included: true },
        { text: "Premium templates", included: false },
      ],
      cta: "Get Started",
      ctaVariant: "default",
    },
    {
      key: "PROFESSIONAL",
      name: "Professional",
      description: "Ideal for serious job seekers and career changers",
      price: { monthly: 1499, annual: 14999 },
      popular: true,
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-400",
      features: [
        { text: "Unlimited AI resumes & cover letters", included: true },
        { text: "Unlimited interview practice", included: true },
        { text: "Unlimited ATS optimization", included: true },
        { text: "Unlimited career evaluations", included: true },
        { text: "Priority AI interview coach", included: true },
        { text: "Premium resume templates", included: true },
        { text: "Career path analytics", included: true },
        { text: "Skill gap analysis", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "LinkedIn optimization", included: true },
        { text: "Salary negotiation guide", included: true },
      ],
      cta: "Start Free Trial",
      ctaVariant: "default",
    },
    {
      key: "ENTERPRISE",
      name: "Enterprise",
      description: "For organizations and career coaching businesses",
      price: { monthly: 4999, annual: 49999 },
      popular: false,
      icon: Crown,
      color: "from-amber-500 to-amber-600",
      borderColor: "border-amber-200",
      features: [
        { text: "Everything in Professional", included: true },
        { text: "White-label solutions", included: true },
        { text: "Team management dashboard", included: true },
        { text: "API access", included: true },
        { text: "Custom branding", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom template creation", included: true },
        { text: "Bulk user management", included: true },
        { text: "SLA guarantee", included: true },
        { text: "Training & onboarding", included: true },
      ],
      cta: "Contact Sales",
      ctaVariant: "default",
    },
  ];

  const savings = {
    FREE: "",
    Starter: "Save ₹989",
    Professional: "Save ₹2,989",
    Enterprise: "Save ₹9,989",
  };

  const useCases = [
    {
      title: "Students & Graduates",
      description: "Kickstart your career with free AI-powered tools",
      icon: School,
      recommended: "Free → Starter",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Job Seekers",
      description: "Accelerate your job search with unlimited AI tools",
      icon: Users,
      recommended: "Professional",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Career Coaches",
      description: "Scale your coaching business with enterprise tools",
      icon: Building2,
      recommended: "Enterprise",
      gradient: "from-amber-50 to-amber-100",
    },
  ];

  const comparisonFeatures = [
    { name: "AI Resume Generation", free: "2 tokens", starter: "5/month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Cover Letters", free: "1 token", starter: "3/month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Interview Practice", free: "3 tokens", starter: "10/month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "ATS Score Checks", free: "2 tokens", starter: "5/month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Career Evaluation", free: "1 token", starter: "3/month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Resume Templates", free: "Standard", starter: "Standard", pro: "Premium", enterprise: "Premium + Custom" },
    { name: "Career Path Suggestions", free: "✓", starter: "✓", pro: "✓ + Analytics", enterprise: "✓ + Advanced" },
    { name: "Skill Gap Analysis", free: "—", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "LinkedIn Optimization", free: "—", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Salary Negotiation Guide", free: "—", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Support", free: "—", starter: "Email", pro: "Priority Chat", enterprise: "Dedicated Manager" },
    { name: "API Access", free: "—", starter: "—", pro: "—", enterprise: "✓" },
    { name: "White-label", free: "—", starter: "—", pro: "—", enterprise: "✓" },
    { name: "Custom Branding", free: "—", starter: "—", pro: "—", enterprise: "✓" },
  ];

  const faqs = [
    {
      question: "What are free tokens?",
      answer: "Every new user gets free AI tokens to try our features: 2 resume generations, 1 cover letter, 3 interview sessions, 2 ATS checks, and 1 career evaluation. These are one-time tokens — once used, you'll need to upgrade for more.",
    },
    {
      question: "Can I change plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, your usage counters reset and you get the new plan's limits immediately. Changes take effect instantly.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! You can start a 14-day free trial of the Professional plan with unlimited access to all features. No credit card required. After the trial, you'll be automatically downgraded to the Free plan.",
    },
    {
      question: "When do monthly tokens reset?",
      answer: "For paid plans (Starter, Professional, Enterprise), your usage counters reset at the beginning of each billing cycle. Free plan tokens are one-time and never reset.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Net Banking, Credit/Debit Cards, and all major Indian payment methods. All prices are in Indian Rupees (₹) with GST included.",
    },
    {
      question: "Do you offer discounts for students?",
      answer: "Yes! We offer a 50% discount for verified students. Contact our support team with your student ID for a special coupon code.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Career Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free with AI tokens. Upgrade when you're ready for unlimited power.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                billingPeriod === "annual"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const isCurrent = currentPlan === plan.key;
            const price = billingPeriod === "monthly" ? plan.price.monthly : plan.price.annual;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
                  isPopular
                    ? `${plan.borderColor} shadow-lg shadow-purple-100 scale-[1.02]`
                    : isCurrent
                    ? "border-green-400 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      ✨ Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && !isPopular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      ✓ Current Plan
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="p-6 pb-4 text-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      {price === 0 ? (
                        <span className="text-4xl font-bold text-gray-900">Free</span>
                      ) : (
                        <>
                          <IndianRupee className="w-5 h-5 text-gray-900" />
                          <span className="text-4xl font-bold text-gray-900">
                            {price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-gray-500 text-sm">
                            /{billingPeriod === "monthly" ? "mo" : "yr"}
                          </span>
                        </>
                      )}
                    </div>
                    {billingPeriod === "annual" && savings[plan.name] && (
                      <div className="text-green-600 text-sm font-medium mt-1">
                        {savings[plan.name]}
                      </div>
                    )}
                    {plan.key === "FREE" && (
                      <div className="text-blue-600 text-xs font-medium mt-1">
                        One-time free tokens included
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 pb-4 flex-grow">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2.5">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-6 pt-2">
                  <button
                    onClick={() =>
                      plan.key === "PROFESSIONAL" && currentPlan === "FREE"
                        ? handleFreeTrial()
                        : handleUpgrade(plan.key)
                    }
                    disabled={isCurrent || upgradeLoading === plan.key || loading}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isCurrent
                        ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                        : plan.key === "FREE"
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : isPopular
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    {upgradeLoading === plan.key || upgradeLoading === "TRIAL" ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : isCurrent ? (
                      "✓ Current Plan"
                    ) : plan.key === "PROFESSIONAL" && currentPlan === "FREE" ? (
                      <span className="flex items-center justify-center gap-1.5">
                        Start 14-Day Free Trial
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Feature Comparison
          </h2>
          <p className="text-gray-500 text-center mb-8">
            See exactly what you get with each plan
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 min-w-[200px]">
                      Feature
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-500">
                      Free
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-blue-600">
                      Starter
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-purple-600 bg-purple-50/50">
                      Professional
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-amber-600">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="p-4 text-sm font-medium text-gray-700">
                        {feature.name}
                      </td>
                      <td className="p-4 text-center text-sm text-gray-500">
                        {feature.free === "—" ? (
                          <span className="text-gray-300">—</span>
                        ) : feature.free === "✓" ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="p-4 text-center text-sm text-gray-600">
                        {feature.starter === "—" ? (
                          <span className="text-gray-300">—</span>
                        ) : feature.starter === "✓" ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          feature.starter
                        )}
                      </td>
                      <td className="p-4 text-center text-sm text-purple-700 bg-purple-50/30 font-medium">
                        {feature.pro === "—" ? (
                          <span className="text-gray-300">—</span>
                        ) : feature.pro === "✓" ? (
                          <Check className="w-5 h-5 text-purple-500 mx-auto" />
                        ) : feature.pro === "Unlimited" ? (
                          <span className="text-purple-600 font-semibold flex items-center justify-center gap-1">
                            <Infinity className="w-4 h-4" /> Unlimited
                          </span>
                        ) : (
                          feature.pro
                        )}
                      </td>
                      <td className="p-4 text-center text-sm text-gray-600">
                        {feature.enterprise === "—" ? (
                          <span className="text-gray-300">—</span>
                        ) : feature.enterprise === "✓" ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : feature.enterprise === "Unlimited" ? (
                          <span className="text-amber-600 font-semibold flex items-center justify-center gap-1">
                            <Infinity className="w-4 h-4" /> Unlimited
                          </span>
                        ) : (
                          feature.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Who's It For?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Find the perfect plan for your career stage
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${useCase.gradient} p-6 rounded-2xl border border-gray-200/50 text-center hover:shadow-lg transition-all duration-300`}
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{useCase.description}</p>
                  <div className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    Best: {useCase.recommended}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Everything you need to know about our plans
          </p>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-sm"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full p-5 text-left flex items-center justify-between"
                >
                  <h3 className="text-base font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-10 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of Indian professionals who have transformed their
                careers with AI-powered tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleFreeTrial}
                  disabled={upgradeLoading === "TRIAL" || currentPlan !== "FREE"}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3.5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {upgradeLoading === "TRIAL" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-600 rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : currentPlan !== "FREE" ? (
                    "Already on a Paid Plan"
                  ) : (
                    <>
                      Start 14-Day Free Trial
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    window.location.href = "mailto:demo@gradify.ai?subject=Schedule a Demo";
                  }}
                  className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-3.5 text-lg font-semibold rounded-xl transition-all"
                >
                  Schedule a Demo
                </button>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-blue-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Cancel anytime
                </span>
                <span>All prices in ₹ • GST included</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={selectedFeature}
        currentPlan={currentPlan}
      />
    </div>
  );
};

export default PricingPage;
