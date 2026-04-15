"use client";

import React, { useState } from "react";
import ResumeForm from "./ResumeForm";
import ResumeBuilding from "./ResumeBuilding";
import CheckAtsScore from "./CheckAtsScore";
import TemplateGallery from "./TemplateGallery";
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
      id: "templates",
      label: "Templates",
      icon: LayoutTemplate,
      description: "Choose a design",
    },
    {
      id: "preview",
      label: "Preview & Edit",
      icon: Eye,
      description: "Canvas editor",
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutTemplate className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Resume Builder
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Create, edit, and optimize your professional resume
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm flex gap-1.5 flex-wrap justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-6">
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
        {activeTab === "preview" ? (
          // Preview tab gets full-width canvas layout without the card wrapper
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden" style={{ minHeight: "80vh" }}>
            <ResumeBuilding />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {activeTab === "form" && <ResumeForm />}
            {activeTab === "templates" && <TemplateGallery />}
            {activeTab === "ats" && <CheckAtsScore />}
          </div>
        )}

        {/* Navigation Help */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            {activeTab === "form" && "Fill in all sections, then click Generate to create your AI-powered resume"}
            {activeTab === "templates" && "Browse and select a template — use it in the Preview & Edit tab"}
            {activeTab === "preview" && "Click any text on the canvas to edit inline • Switch templates on the left"}
            {activeTab === "ats" && "Upload a PDF or check your saved resume for ATS compatibility"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeClient;