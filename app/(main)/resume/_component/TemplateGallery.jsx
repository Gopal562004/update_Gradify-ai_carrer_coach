"use client";

import React, { useState, useEffect } from "react";
import ResumeEditor from "./templates/ResumeEditor";
import { TemplateCard } from "./templates/TemplateCard";
import { TemplateCategories } from "./templates/TemplateCategories";
import {
  templatesData,
  templateCategories,
  loadTemplateHtml,
} from "./templates/index";

const TemplateGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Load templates immediately
  useEffect(() => {
    setTemplates(templatesData);
    console.log("Available templates:", templatesData); // Debug
  }, []);

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((template) => template.category === selectedCategory);

  const handleEditTemplate = async (template) => {
    setLoading(true);
    try {
      console.log("Opening template:", template.name); // Debug
      const templateWithHtml = await loadTemplateHtml(template.id);
      setCurrentTemplate(templateWithHtml);
      setEditorOpen(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error loading template: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setCurrentTemplate(null);
  };

  if (editorOpen && currentTemplate) {
    return (
      <ResumeEditor
        template={currentTemplate}
        onSave={(data) => {
          console.log("Saving:", data);
          alert("Resume saved!");
        }}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Choose Your Resume Template
        </h1>
        <p className="text-xl text-gray-600">
          Found {templates.length} templates
        </p>
      </div>

      <TemplateCategories
        categories={templateCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Opening editor...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={handleEditTemplate}
            loading={loading}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No templates found.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
