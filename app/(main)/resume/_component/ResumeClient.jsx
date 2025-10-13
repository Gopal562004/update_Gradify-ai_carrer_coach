"use client";

import React, { useState } from "react";
import ResumeForm from "./ResumeForm";
import ResumeBuilding from "./ResumeBuilding";
import CheckAtsScore from "./CheckAtsScore";
import { Button } from "@/components/ui/button";
import { FileText, Eye, BarChart3, LayoutTemplate } from "lucide-react";

const ResumeClient = () => {
  const [activeTab, setActiveTab] = useState("form");

  const tabs = [
    {
      id: "form",
      label: "Resume Form",
      icon: FileText,
      description: "Fill in your details",
    },
    {
      id: "preview",
      label: "Preview",
      icon: Eye,
      description: "View your resume",
    },
    {
      id: "ats",
      label: "ATS Score",
      icon: BarChart3,
      description: "Check compatibility",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutTemplate className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Resume Builder
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Create a professional resume that stands out
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{tab.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Resume Progress</span>
            <span>
              {tabs.findIndex((tab) => tab.id === activeTab) + 1} of{" "}
              {tabs.length} steps
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((tabs.findIndex((tab) => tab.id === activeTab) + 1) /
                    tabs.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {activeTab === "form" && <ResumeForm />}
          {activeTab === "preview" && <ResumeBuilding />}
          {activeTab === "ats" && <CheckAtsScore />}
        </div>

        {/* Navigation Help */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {activeTab === "form" &&
              "Fill in all sections to build your resume"}
            {activeTab === "preview" &&
              "Review and customize your resume design"}
            {activeTab === "ats" &&
              "Optimize your resume for applicant tracking systems"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeClient;
