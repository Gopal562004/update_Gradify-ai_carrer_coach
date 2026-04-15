"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserResume, updateResume } from "@/actions/resume";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Download,
  Edit,
  Save,
  Eye,
  LayoutTemplate,
  Palette,
  Type,
  Bold,
  Italic,
  ZoomIn,
  ZoomOut,
  Undo,
  MousePointer,
  Sparkles,
} from "lucide-react";

// ========== 6 TEMPLATE STYLES ==========
const TEMPLATES = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    color: "from-blue-500 to-blue-600",
    accent: "#2563eb",
    headingFont: "'Segoe UI', sans-serif",
    bodyFont: "'Segoe UI', sans-serif",
  },
  {
    id: "classic-black",
    name: "Classic Black",
    color: "from-gray-700 to-gray-900",
    accent: "#1f2937",
    headingFont: "'Georgia', serif",
    bodyFont: "'Times New Roman', serif",
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    color: "from-purple-500 to-pink-500",
    accent: "#7c3aed",
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    id: "minimal-green",
    name: "Minimal Green",
    color: "from-emerald-500 to-emerald-600",
    accent: "#059669",
    headingFont: "'Helvetica', sans-serif",
    bodyFont: "'Helvetica', sans-serif",
  },
  {
    id: "executive-gold",
    name: "Executive Gold",
    color: "from-amber-500 to-amber-600",
    accent: "#b45309",
    headingFont: "'Palatino', serif",
    bodyFont: "'Palatino', serif",
  },
  {
    id: "tech-dark",
    name: "Tech Dark",
    color: "from-slate-700 to-slate-900",
    accent: "#0ea5e9",
    headingFont: "'Consolas', monospace",
    bodyFont: "'Segoe UI', sans-serif",
  },
];

// ========== TEMPLATE RENDER COMPONENT ==========
function ResumeCanvas({ resume, template, editingField, onFieldClick, onFieldChange, canvasRef }) {
  const t = template;
  const data = resume || {};

  const editableProps = (fieldName) => ({
    onClick: (e) => {
      e.stopPropagation();
      onFieldClick(fieldName);
    },
    contentEditable: editingField === fieldName,
    suppressContentEditableWarning: true,
    onBlur: (e) => onFieldChange(fieldName, e.currentTarget.innerText),
    style: {
      outline: editingField === fieldName ? `2px solid ${t.accent}` : "none",
      borderRadius: editingField === fieldName ? "4px" : "0",
      padding: editingField === fieldName ? "2px 4px" : "0",
      cursor: "pointer",
      backgroundColor: editingField === fieldName ? `${t.accent}08` : "transparent",
      transition: "all 0.2s ease",
    },
  });

  const listEditableProps = (section, index) => ({
    onClick: (e) => {
      e.stopPropagation();
      onFieldClick(`${section}-${index}`);
    },
    contentEditable: editingField === `${section}-${index}`,
    suppressContentEditableWarning: true,
    onBlur: (e) => {
      const items = [...(data[section] || [])];
      items[index] = e.currentTarget.innerText;
      onFieldChange(section, items);
    },
    style: {
      outline: editingField === `${section}-${index}` ? `2px solid ${t.accent}` : "none",
      borderRadius: editingField === `${section}-${index}` ? "4px" : "0",
      padding: editingField === `${section}-${index}` ? "2px 4px" : "0",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  });

  // Render the correct template layout
  const isModern = t.id === "modern-blue" || t.id === "creative-purple" || t.id === "tech-dark";
  const isClassic = t.id === "classic-black" || t.id === "executive-gold";
  const isMinimal = t.id === "minimal-green";

  return (
    <div
      ref={canvasRef}
      id="resume-canvas"
      onClick={() => onFieldClick(null)}
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: t.id === "tech-dark" ? "#0f172a" : "white",
        fontFamily: t.bodyFont,
        color: t.id === "tech-dark" ? "#e2e8f0" : "#1f2937",
        padding: 0,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          background: isModern
            ? `linear-gradient(135deg, ${t.accent}, ${t.accent}dd)`
            : isClassic
            ? t.accent
            : isMinimal
            ? "white"
            : t.accent,
          color: isMinimal ? t.accent : "white",
          padding: isMinimal ? "30px 40px" : "35px 40px",
          borderBottom: isMinimal ? `3px solid ${t.accent}` : "none",
        }}
      >
        <h1
          {...editableProps("contactInfo.name")}
          style={{
            ...editableProps("contactInfo.name").style,
            fontSize: "28px",
            fontWeight: "bold",
            fontFamily: t.headingFont,
            letterSpacing: t.id === "tech-dark" ? "3px" : "1px",
            marginBottom: "6px",
            color: isMinimal ? t.accent : "white",
          }}
        >
          {data.contactInfo?.name || data.name || "YOUR NAME"}
        </h1>
        <div
          style={{
            fontSize: "13px",
            opacity: 0.9,
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            color: isMinimal ? "#6b7280" : "rgba(255,255,255,0.85)",
          }}
        >
          {(data.contactInfo?.email || data.email) && (
            <span>{data.contactInfo?.email || data.email}</span>
          )}
          {(data.contactInfo?.phone || data.phone) && (
            <span>• {data.contactInfo?.phone || data.phone}</span>
          )}
          {(data.contactInfo?.linkedin || data.linkedin) && (
            <span>• {data.contactInfo?.linkedin || data.linkedin}</span>
          )}
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div style={{ padding: "30px 40px" }}>
        {/* Summary */}
        {data.summary && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                fontFamily: t.headingFont,
                color: t.id === "tech-dark" ? t.accent : t.accent,
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderBottom: `2px solid ${t.accent}`,
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Professional Summary
            </h2>
            <p
              {...editableProps("summary")}
              style={{
                ...editableProps("summary").style,
                fontSize: "13px",
                lineHeight: "1.7",
                color: t.id === "tech-dark" ? "#cbd5e1" : "#374151",
              }}
            >
              {data.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                fontFamily: t.headingFont,
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderBottom: `2px solid ${t.accent}`,
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Technical Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  {...listEditableProps("skills", i)}
                  style={{
                    ...listEditableProps("skills", i).style,
                    padding: "4px 12px",
                    borderRadius: t.id === "tech-dark" ? "3px" : "16px",
                    fontSize: "12px",
                    fontWeight: "500",
                    background:
                      t.id === "tech-dark"
                        ? "rgba(14,165,233,0.15)"
                        : `${t.accent}12`,
                    color: t.accent,
                    border: `1px solid ${t.accent}30`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                fontFamily: t.headingFont,
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderBottom: `2px solid ${t.accent}`,
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Professional Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "14px",
                  paddingLeft: isModern ? "14px" : "0",
                  borderLeft: isModern ? `3px solid ${t.accent}40` : "none",
                }}
              >
                <p
                  {...listEditableProps("experience", i)}
                  style={{
                    ...listEditableProps("experience", i).style,
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: t.id === "tech-dark" ? "#cbd5e1" : "#374151",
                  }}
                >
                  {exp}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                fontFamily: t.headingFont,
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderBottom: `2px solid ${t.accent}`,
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <p
                  {...listEditableProps("education", i)}
                  style={{
                    ...listEditableProps("education", i).style,
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: t.id === "tech-dark" ? "#cbd5e1" : "#374151",
                  }}
                >
                  {edu}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                fontFamily: t.headingFont,
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "2px",
                borderBottom: `2px solid ${t.accent}`,
                paddingBottom: "6px",
                marginBottom: "12px",
              }}
            >
              Projects
            </h2>
            {data.projects.map((proj, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "14px",
                  paddingLeft: isModern ? "14px" : "0",
                  borderLeft: isModern ? `3px solid ${t.accent}40` : "none",
                }}
              >
                <p
                  {...listEditableProps("projects", i)}
                  style={{
                    ...listEditableProps("projects", i).style,
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: t.id === "tech-dark" ? "#cbd5e1" : "#374151",
                  }}
                >
                  {proj}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== MAIN COMPONENT ==========
const ResumeBuilding = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [editingField, setEditingField] = useState(null);
  const [zoom, setZoom] = useState(0.7);
  const [hasChanges, setHasChanges] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getUserResume();
        setResume(data);
      } catch (error) {
        console.error("Resume load error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handleFieldClick = useCallback((fieldName) => {
    setEditingField(fieldName);
  }, []);

  const handleFieldChange = useCallback((fieldName, value) => {
    setResume((prev) => {
      if (!prev) return prev;
      // Handle nested fields like "contactInfo.name"
      if (fieldName.includes(".")) {
        const [parent, child] = fieldName.split(".");
        return {
          ...prev,
          [parent]: { ...(prev[parent] || {}), [child]: value },
        };
      }
      // Handle array fields (already receives full array from list editable)
      if (Array.isArray(value)) {
        return { ...prev, [fieldName]: value };
      }
      return { ...prev, [fieldName]: value };
    });
    setHasChanges(true);
    setEditingField(null);
  }, []);

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await updateResume(resume);
      toast.success("Resume saved successfully!");
      setHasChanges(false);
    } catch (err) {
      toast.error("Failed to save resume");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    setEditingField(null);

    try {
      // Wait for content editable to blur
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: selectedTemplate.id === "tech-dark" ? "#0f172a" : "#ffffff",
        logging: false,
        width: canvasRef.current.scrollWidth,
        height: canvasRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);

      // Add extra pages if content overflows
      let remainingHeight = imgHeight - (pdfHeight / ratio);
      let pageOffset = pdfHeight / ratio;

      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -(pageOffset * ratio),
          finalWidth,
          finalHeight
        );
        remainingHeight -= pdfHeight / ratio;
        pageOffset += pdfHeight / ratio;
      }

      pdf.save(`resume_${selectedTemplate.id}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading your resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LayoutTemplate className="h-10 w-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resume Found</h3>
        <p className="text-gray-500">Fill out the Resume Form first to generate your resume, then come here to edit and customize it.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ===== TOP TOOLBAR ===== */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MousePointer className="h-3.5 w-3.5" />
            <span>Click any text on the resume to edit</span>
          </div>
          {editingField && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium animate-pulse">
              Editing: {editingField}
            </span>
          )}
          {hasChanges && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ZoomOut className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <span className="text-xs font-medium text-gray-600 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ZoomIn className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving..." : "Save"}
          </Button>

          {/* Download */}
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Template Sidebar */}
        <div className="w-56 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Templates
          </h3>
          <div className="space-y-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedTemplate.id === tmpl.id
                    ? "border-blue-500 bg-white shadow-md ring-2 ring-blue-100"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${tmpl.color} mb-2`}
                />
                <p className="text-xs font-semibold text-gray-800">{tmpl.name}</p>
              </button>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click text to edit inline</li>
              <li>• Switch templates instantly</li>
              <li>• Save changes to your profile</li>
              <li>• PDF matches what you see</li>
            </ul>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 overflow-auto p-8 flex justify-center">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
            }}
          >
            <ResumeCanvas
              resume={resume}
              template={selectedTemplate}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldChange={handleFieldChange}
              canvasRef={canvasRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilding;
