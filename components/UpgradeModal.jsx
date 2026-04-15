"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Star,
  Crown,
  Check,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Shield,
  Clock,
} from "lucide-react";
import { upgradePlan, startFreeTrial } from "@/actions/subscription";
import toast from "react-hot-toast";

const PLANS = [
  {
    key: "STARTER",
    name: "Starter",
    icon: Star,
    price: { monthly: 499, annual: 4999 },
    color: "from-blue-500 to-blue-600",
    features: [
      "5 AI resumes/month",
      "3 cover letters/month",
      "10 interview sessions/month",
      "5 ATS checks/month",
      "Email support",
    ],
  },
  {
    key: "PROFESSIONAL",
    name: "Professional",
    icon: Zap,
    price: { monthly: 1499, annual: 14999 },
    color: "from-purple-500 to-purple-600",
    popular: true,
    features: [
      "Unlimited AI resumes & cover letters",
      "Unlimited interview practice",
      "Unlimited ATS checks",
      "Priority AI interview coach",
      "Skill gap analysis",
      "LinkedIn optimization",
      "Salary negotiation guide",
    ],
  },
];

export default function UpgradeModal({ isOpen, onClose, feature, currentPlan }) {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [paymentStep, setPaymentStep] = useState("plans"); // "plans" | "payment" | "success"
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (!isOpen) return null;

  const featureLabels = {
    resume: "AI Resume Generation",
    coverLetter: "Cover Letter",
    interview: "Interview Practice",
    atsCheck: "ATS Score Check",
    careerEval: "Career Evaluation",
  };

  async function handleUpgrade(plan) {
    setSelectedPlan(plan);
    setPaymentStep("payment");
  }

  async function handlePayment() {
    setLoading(true);
    try {
      const result = await upgradePlan(selectedPlan.key, billingPeriod.toUpperCase());
      if (result.success) {
        setPaymentStep("success");
        toast.success(result.message);
      }
    } catch (err) {
      toast.error("Upgrade failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFreeTrial() {
    setLoading(true);
    try {
      const result = await startFreeTrial();
      if (result.success) {
        setPaymentStep("success");
        toast.success(result.message);
      }
    } catch (err) {
      toast.error(err.message || "Could not start trial.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setPaymentStep("plans");
    setSelectedPlan(null);
    onClose();
    if (paymentStep === "success") {
      window.location.reload();
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {paymentStep === "plans" && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Unlock More Power
                  </h2>
                </div>
                {feature && (
                  <p className="text-blue-100 text-sm">
                    You've reached your limit for{" "}
                    <span className="font-semibold text-white">
                      {featureLabels[feature] || feature}
                    </span>
                    . Upgrade to continue using AI features.
                  </p>
                )}
              </div>

              {/* Free Trial Banner */}
              {currentPlan === "FREE" && (
                <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Try Professional for 14 days — Free!
                        </p>
                        <p className="text-xs text-green-600">
                          Unlimited access to all features. No credit card required.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleFreeTrial}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? "Starting..." : "Start Trial"}
                    </button>
                  </div>
                </div>
              )}

              {/* Billing Toggle */}
              <div className="flex justify-center mt-4">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      billingPeriod === "monthly"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      billingPeriod === "annual"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    Annual
                    <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      -17%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PLANS.map((plan) => {
                  const Icon = plan.icon;
                  const price = billingPeriod === "annual" ? plan.price.annual : plan.price.monthly;
                  const isCurrent = currentPlan === plan.key;

                  return (
                    <div
                      key={plan.key}
                      className={`relative border-2 rounded-xl p-5 transition-all ${
                        plan.popular
                          ? "border-purple-400 shadow-lg shadow-purple-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Most Popular
                        </span>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      </div>

                      <div className="flex items-baseline gap-1 mb-4">
                        <IndianRupee className="w-4 h-4 text-gray-900" />
                        <span className="text-2xl font-bold text-gray-900">
                          {price}
                        </span>
                        <span className="text-gray-500 text-sm">
                          /{billingPeriod === "annual" ? "year" : "month"}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleUpgrade(plan)}
                        disabled={isCurrent || loading}
                        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          isCurrent
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        }`}
                      >
                        {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {paymentStep === "payment" && selectedPlan && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Complete Payment
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Upgrading to {selectedPlan.name} ({billingPeriod})
              </p>

              {/* Demo Payment Form */}
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Billing</span>
                    <span className="text-gray-900 capitalize">
                      {billingPeriod}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900 flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {billingPeriod === "annual"
                        ? selectedPlan.price.annual
                        : selectedPlan.price.monthly}
                    </span>
                  </div>
                </div>

                {/* Demo Payment Methods */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["UPI", "Card", "Net Banking", "Wallet"].map((method) => (
                      <button
                        key={method}
                        className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Demo mode — no real charges will be made</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPaymentStep("plans")}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Pay Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Upgrade Successful!
              </h2>
              <p className="text-gray-500 mb-6">
                You now have access to{" "}
                {selectedPlan
                  ? selectedPlan.name
                  : "Professional"}{" "}
                features. Enjoy unlimited AI-powered career tools!
              </p>
              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Start Using Premium Features
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
