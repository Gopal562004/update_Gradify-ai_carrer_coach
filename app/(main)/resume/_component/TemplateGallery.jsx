"use client";

import React, { useState } from "react";
import { TemplateCategories } from "./templates/TemplateCategories";
import { templatesData, templateCategories } from "./templates/index";
import {
  Check,
  Crown,
  Star,
  Eye,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TemplateGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates =
    selectedCategory === "all"
      ? templatesData
      : templatesData.filter((t) => t.category === selectedCategory);

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutTemplate className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Resume Templates
            </h1>
            <p className="text-gray-600 text-lg">
              Choose a template, then edit on the Preview tab
            </p>
          </div>
        </div>
      </div>

      <TemplateCategories
        categories={templateCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
              selectedTemplate === template.id
                ? "border-blue-500 ring-4 ring-blue-100 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            {/* Template Preview Visual */}
            <div className="relative h-52 overflow-hidden">
              {/* Mini resume preview */}
              <div
                className="absolute inset-0 p-4"
                style={{ backgroundColor: template.id === "tech-dark" ? "#0f172a" : "#f9fafb" }}
              >
                {/* Header bar */}
                <div
                  className={`rounded-lg p-3 mb-2`}
                  style={{ backgroundColor: template.accent }}
                >
                  <div className="h-3 w-24 bg-white/30 rounded mb-1.5" />
                  <div className="h-2 w-32 bg-white/20 rounded" />
                </div>
                {/* Content lines */}
                <div className="space-y-2 px-1">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="h-2 w-16 rounded" style={{ backgroundColor: `${template.accent}40` }} />
                  </div>
                  {[80, 70, 60, 50, 65].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded"
                      style={{
                        width: `${w}%`,
                        backgroundColor: template.id === "tech-dark" ? "#334155" : "#e5e7eb",
                      }}
                    />
                  ))}
                  <div className="flex items-center gap-1 mt-3 mb-2">
                    <div className="h-2 w-20 rounded" style={{ backgroundColor: `${template.accent}40` }} />
                  </div>
                  {[90, 75, 55, 85].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded"
                      style={{
                        width: `${w}%`,
                        backgroundColor: template.id === "tech-dark" ? "#334155" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                {/* Skill pills */}
                <div className="flex gap-1 mt-3 px-1">
                  {[16, 20, 14].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded-full"
                      style={{
                        width: `${w}%`,
                        backgroundColor: `${template.accent}20`,
                        border: `1px solid ${template.accent}30`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview in Editor
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-2 right-2 flex gap-1.5">
                {template.popular && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3" /> Popular
                  </span>
                )}
                {template.premium && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>

              {/* Selected */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${template.color}`} />
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {template.features.map((f, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No templates in this category.</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 text-center">
        <Sparkles className="h-6 w-6 text-blue-600 mx-auto mb-2" />
        <h3 className="font-semibold text-blue-900 mb-1">How to use templates</h3>
        <p className="text-blue-700 text-sm max-w-md mx-auto">
          Browse and select a template here. Then switch to the <strong>Preview</strong> tab
          to see your resume rendered in that style. You can switch templates and edit
          text directly on the canvas.
        </p>
      </div>
    </div>
  );
};

export default TemplateGallery;
