"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserResume, updateResume } from "@/actions/resume";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import {
  Download,
  Edit,
  Save,
  Eye,
  LayoutTemplate,
  Plus,
  X,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ResumeBuilding = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedResume, setEditedResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeSection, setActiveSection] = useState(null);

  const templates = [
    {
      id: "modern",
      name: "Modern",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      id: "professional",
      name: "Professional",
      color: "bg-gradient-to-r from-gray-700 to-gray-900",
    },
    {
      id: "creative",
      name: "Creative",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      id: "minimal",
      name: "Minimal",
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getUserResume();
        setResume(data);
        setEditedResume(data);
      } catch (error) {
        toast.error("Failed to load resume");
        console.error("Resume error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  const handleEdit = () => {
    setEditing(true);
    setEditedResume({ ...resume });
  };

  const handleSave = async () => {
    try {
      await updateResume(editedResume);
      setResume(editedResume);
      setEditing(false);
      toast.success("Resume updated successfully!");
    } catch (error) {
      toast.error("Failed to update resume");
    }
  };

  const handleCancel = () => {
    setEditedResume(resume);
    setEditing(false);
    setActiveSection(null);
  };

  const handleSectionEdit = (section, value) => {
    setEditedResume((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const addItem = (section) => {
    const newItem = "";
    setEditedResume((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const removeItem = (section, index) => {
    setEditedResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (section, index, value) => {
    setEditedResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? value : item)),
    }));
  };

  const downloadPDF = () => {
    if (!resume) return;

    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("RESUME", 105, y, { align: "center" });
    y += 15;

    const addSection = (title, items) => {
      if (!items || items.length === 0) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title.toUpperCase(), 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.line(20, y - 2, 190, y - 2);
      y += 5;

      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 170);
        lines.forEach((line) => {
          if (y >= 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 25, y);
          y += 5;
        });
        y += 2;
      });

      y += 8;
    };

    if (resume.summary) addSection("PROFESSIONAL SUMMARY", [resume.summary]);
    if (resume.skills) addSection("SKILLS", resume.skills);
    if (resume.experience) addSection("EXPERIENCE", resume.experience);
    if (resume.education) addSection("EDUCATION", resume.education);
    if (resume.projects) addSection("PROJECTS", resume.projects);

    doc.save("professional_resume.pdf");
  };

  const renderTemplatePreview = () => {
    const templateStyles = {
      modern: "bg-white border-2 border-blue-200 shadow-lg",
      professional: "bg-gray-50 border-2 border-gray-300 shadow-md",
      creative:
        "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg",
      minimal: "bg-white border border-gray-200 shadow-sm",
    };

    return (
      <div className={`p-6 rounded-lg ${templateStyles[selectedTemplate]}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-black mb-2">John Doe</h3>
          <p className="text-black">Software Engineer | john@example.com</p>
        </div>

        {resume?.summary && (
          <SectionPreview title="Summary" template={selectedTemplate}>
            <p className="text-black">{resume.summary}</p>
          </SectionPreview>
        )}

        {resume?.skills && resume.skills.length > 0 && (
          <SectionPreview title="Skills" template={selectedTemplate}>
            <div className="flex flex-wrap gap-2">
              {resume.skills.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SectionPreview>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
        <Card className="bg-white border-gray-200 shadow-lg w-full max-w-6xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-black">Loading resume preview...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
      <Card className="bg-white border-gray-200 shadow-lg w-full max-w-6xl mx-auto">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header with Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Resume Preview & Editor
              </h2>
              <p className="text-black">
                Edit and customize your resume in real-time
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {resume && (
                <>
                  {!editing ? (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="border-blue-300 text-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Resume
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 text-black"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={downloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Template Selector */}
          <div className="space-y-4">
            <Label className="text-black font-semibold flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Choose Template
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`h-8 rounded-md ${template.color} mb-2`}
                  ></div>
                  <p className="text-sm font-medium text-black">
                    {template.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {!resume ? (
            <div className="text-center py-12">
              <p className="text-black text-lg mb-4">No resume found.</p>
              <p className="text-black">
                Fill out the form to generate your resume.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Template Preview */}
              <div className="xl:col-span-2">
                <div className="space-y-6">
                  {editing ? (
                    /* Editable View */
                    <div className="space-y-6">
                      <EditableSection
                        title="Professional Summary"
                        content={editedResume.summary}
                        onEdit={(value) => handleSectionEdit("summary", value)}
                        isEditing={activeSection === "summary"}
                        onToggle={() =>
                          setActiveSection(
                            activeSection === "summary" ? null : "summary"
                          )
                        }
                        type="textarea"
                      />

                      <EditableSection
                        title="Skills"
                        items={editedResume.skills}
                        onAdd={() => addItem("skills")}
                        onRemove={(index) => removeItem("skills", index)}
                        onUpdate={(index, value) =>
                          updateItem("skills", index, value)
                        }
                        isEditing={activeSection === "skills"}
                        onToggle={() =>
                          setActiveSection(
                            activeSection === "skills" ? null : "skills"
                          )
                        }
                        placeholder="Add a skill"
                      />

                      <EditableSection
                        title="Experience"
                        items={editedResume.experience}
                        onAdd={() => addItem("experience")}
                        onRemove={(index) => removeItem("experience", index)}
                        onUpdate={(index, value) =>
                          updateItem("experience", index, value)
                        }
                        isEditing={activeSection === "experience"}
                        onToggle={() =>
                          setActiveSection(
                            activeSection === "experience" ? null : "experience"
                          )
                        }
                        placeholder="Add experience"
                      />

                      <EditableSection
                        title="Education"
                        items={editedResume.education}
                        onAdd={() => addItem("education")}
                        onRemove={(index) => removeItem("education", index)}
                        onUpdate={(index, value) =>
                          updateItem("education", index, value)
                        }
                        isEditing={activeSection === "education"}
                        onToggle={() =>
                          setActiveSection(
                            activeSection === "education" ? null : "education"
                          )
                        }
                        placeholder="Add education"
                      />

                      <EditableSection
                        title="Projects"
                        items={editedResume.projects}
                        onAdd={() => addItem("projects")}
                        onRemove={(index) => removeItem("projects", index)}
                        onUpdate={(index, value) =>
                          updateItem("projects", index, value)
                        }
                        isEditing={activeSection === "projects"}
                        onToggle={() =>
                          setActiveSection(
                            activeSection === "projects" ? null : "projects"
                          )
                        }
                        placeholder="Add project"
                      />
                    </div>
                  ) : (
                    /* Preview View */
                    <div className="space-y-6 text-black">
                      {resume.summary && (
                        <Section title="Professional Summary">
                          <p>{resume.summary}</p>
                        </Section>
                      )}

                      {resume.skills && resume.skills.length > 0 && (
                        <Section title="Skills">
                          <div className="flex flex-wrap gap-2">
                            {resume.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </Section>
                      )}

                      {resume.experience && resume.experience.length > 0 && (
                        <Section title="Experience">
                          <ul className="space-y-3">
                            {resume.experience.map((exp, i) => (
                              <li
                                key={i}
                                className="border-l-4 border-blue-500 pl-4 py-1"
                              >
                                {exp}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      )}

                      {resume.education && resume.education.length > 0 && (
                        <Section title="Education">
                          <ul className="space-y-2">
                            {resume.education.map((edu, i) => (
                              <li key={i}>• {edu}</li>
                            ))}
                          </ul>
                        </Section>
                      )}

                      {resume.projects && resume.projects.length > 0 && (
                        <Section title="Projects">
                          <ul className="space-y-2">
                            {resume.projects.map((proj, i) => (
                              <li key={i}>• {proj}</li>
                            ))}
                          </ul>
                        </Section>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Template Preview Sidebar */}
              <div className="xl:col-span-1">
                <div className="sticky top-4">
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Template Preview
                  </h3>
                  {renderTemplatePreview()}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Tips</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Keep each section concise</li>
                      <li>• Use action verbs in experience</li>
                      <li>• Tailor content to job applications</li>
                      <li>• Update skills regularly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="border-b border-gray-200 pb-6 last:border-b-0">
    <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
    {children}
  </div>
);

const SectionPreview = ({ title, children, template }) => (
  <div className="mb-4">
    <h4 className="font-semibold text-black mb-2 text-sm uppercase tracking-wide">
      {title}
    </h4>
    {children}
  </div>
);

const EditableSection = ({
  title,
  content,
  items,
  onEdit,
  onAdd,
  onRemove,
  onUpdate,
  isEditing,
  onToggle,
  type = "list",
  placeholder,
}) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="border-gray-300 text-black"
      >
        {isEditing ? "Preview" : "Edit"}
      </Button>
    </div>

    {isEditing ? (
      <div className="space-y-3">
        {type === "textarea" ? (
          <Textarea
            value={content || ""}
            onChange={(e) => onEdit(e.target.value)}
            placeholder={placeholder}
            className="min-h-[100px] border-gray-300 text-black"
          />
        ) : (
          <div className="space-y-2">
            {items?.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => onUpdate(index, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 border-gray-300 text-black"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={onAdd}
              variant="outline"
              className="border-gray-300 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        )}
      </div>
    ) : (
      <div className="text-black">
        {type === "textarea" ? (
          <p>{content || "No content added"}</p>
        ) : (
          <ul className="space-y-1">
            {items?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

export default ResumeBuilding;
