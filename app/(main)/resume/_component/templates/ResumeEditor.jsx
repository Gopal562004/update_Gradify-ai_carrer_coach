"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Move,
  Type,
  Palette,
  Download,
  Save,
  Undo,
  Redo,
  Trash2,
  Edit3,
} from "lucide-react";

const ResumeEditor = ({ template, onSave, onClose }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editableElements, setEditableElements] = useState([]);
  const templateRef = useRef(null);

  // Parse HTML and make elements editable
  useEffect(() => {
    if (template?.htmlContent) {
      console.log("🎨 Setting up editable template:", template.name);
      setupEditableTemplate(template.htmlContent);
    }
  }, [template]);

  const setupEditableTemplate = (htmlContent) => {
    // Create a temporary container to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Find all editable elements in the template
    const editableNodes = tempDiv.querySelectorAll('[data-editable="true"]');
    const elements = [];

    editableNodes.forEach((element, index) => {
      const field = element.getAttribute("data-field") || `field-${index}`;
      const section = element.getAttribute("data-section") || "content";

      // Store original HTML and position data
      elements.push({
        id: field,
        element: element,
        originalHtml: element.outerHTML,
        content: element.textContent || "",
        field: field,
        section: section,
        styles: getElementStyles(element),
      });
    });

    setEditableElements(elements);
    console.log(
      "📝 Found editable elements:",
      elements.map((e) => e.field)
    );
  };

  const getElementStyles = (element) => {
    const computed = window.getComputedStyle(element);
    return {
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      color: computed.color,
      fontWeight: computed.fontWeight,
      textAlign: computed.textAlign,
      backgroundColor: computed.backgroundColor,
    };
  };

  const handleElementClick = (element, clientX, clientY) => {
    setSelectedElement(element);

    // Calculate offset for dragging
    const rect = templateRef.current.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleTextChange = (newContent) => {
    if (!selectedElement) return;

    // Update the element content
    const updatedElements = editableElements.map((el) =>
      el.id === selectedElement.id
        ? {
            ...el,
            content: newContent,
            element: updateElementContent(el.element, newContent),
          }
        : el
    );

    setEditableElements(updatedElements);
    setSelectedElement(
      updatedElements.find((el) => el.id === selectedElement.id)
    );
  };

  const updateElementContent = (element, newContent) => {
    if (element.tagName === "INPUT") {
      element.value = newContent;
    } else {
      element.textContent = newContent;
    }
    return element;
  };

  const handleStyleChange = (property, value) => {
    if (!selectedElement) return;

    const updatedElements = editableElements.map((el) => {
      if (el.id === selectedElement.id) {
        // Update the actual element style
        el.element.style[property] = value;
        return {
          ...el,
          styles: { ...el.styles, [property]: value },
        };
      }
      return el;
    });

    setEditableElements(updatedElements);
    setSelectedElement(
      updatedElements.find((el) => el.id === selectedElement.id)
    );
  };

  const handleMouseDown = (e) => {
    // Find if we clicked on an editable element
    let target = e.target;
    let clickedElement = null;

    while (target && target !== templateRef.current) {
      if (target.hasAttribute && target.hasAttribute("data-editable")) {
        clickedElement = editableElements.find(
          (el) => el.element === target || target.contains?.(el.element)
        );
        if (clickedElement) break;
      }
      target = target.parentNode;
    }

    if (clickedElement) {
      e.preventDefault();
      e.stopPropagation();
      handleElementClick(clickedElement, e.clientX, e.clientY);
      setIsDragging(true);
    } else {
      setSelectedElement(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return;

    const rect = templateRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update element position (you can implement drag functionality here)
    console.log("Dragging to:", x, y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    // Find editable element and make it directly editable
    let target = e.target;
    while (target && target !== templateRef.current) {
      if (target.hasAttribute && target.hasAttribute("data-editable")) {
        const element = editableElements.find(
          (el) => el.element === target || target.contains?.(el.element)
        );
        if (element) {
          setSelectedElement(element);
          // You could show a floating text editor here
          return;
        }
      }
      target = target.parentNode;
    }
  };

  const downloadResume = () => {
    // Get the final HTML content
    const finalHtml = templateRef.current?.innerHTML || template?.htmlContent;
    console.log("💾 Download resume HTML:", finalHtml);
    alert("PDF download would be implemented here!");
  };

  const handleSave = () => {
    const finalHtml = templateRef.current?.innerHTML;
    const resumeData = {
      template: template?.id,
      htmlContent: finalHtml,
      elements: editableElements,
      updatedAt: new Date().toISOString(),
    };
    onSave(resumeData);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300"
          >
            ← Back to Templates
          </Button>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                selectedElement ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {selectedElement
                ? `Editing: ${selectedElement.field}`
                : "Click any text to edit"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">{template?.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={downloadResume}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8 flex items-start justify-center">
          {/* Template Container */}
          <div
            ref={templateRef}
            className="bg-white shadow-2xl relative cursor-text"
            style={{
              width: "210mm",
              minHeight: "297mm",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            dangerouslySetInnerHTML={{ __html: template?.htmlContent }}
          />

          {/* Selection Highlight Overlay */}
          {selectedElement && (
            <div
              className="absolute border-2 border-blue-500 pointer-events-none"
              style={{
                left:
                  selectedElement.element.getBoundingClientRect?.().left + "px",
                top:
                  selectedElement.element.getBoundingClientRect?.().top + "px",
                width: selectedElement.element.offsetWidth + "px",
                height: selectedElement.element.offsetHeight + "px",
              }}
            />
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          {selectedElement ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">
                  Editing: {selectedElement.field}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedElement(null)}
                  className="border-gray-300"
                >
                  ×
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Content
                </label>
                <Textarea
                  value={selectedElement.content}
                  onChange={(e) => handleTextChange(e.target.value)}
                  rows={4}
                  className="border-gray-300 focus:border-blue-500"
                  placeholder="Enter your content here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Font Size
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedElement.styles.fontSize || "16px"}
                    onChange={(e) =>
                      handleStyleChange("fontSize", e.target.value)
                    }
                  >
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                    <option value="32px">32px</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Color
                  </label>
                  <Input
                    type="color"
                    value={selectedElement.styles.color || "#000000"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Font Family
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedElement.styles.fontFamily || "Arial"}
                  onChange={(e) =>
                    handleStyleChange("fontFamily", e.target.value)
                  }
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Font Weight
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedElement.styles.fontWeight || "normal"}
                  onChange={(e) =>
                    handleStyleChange("fontWeight", e.target.value)
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="600">Semibold</option>
                  <option value="300">Light</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Edit3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-gray-600">Click to Edit</p>
              <p className="text-sm text-gray-500 mt-1">
                Click on any text in the resume to start editing
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Tips:</h4>
                <ul className="text-blue-800 text-sm space-y-1 text-left">
                  <li>• Click any text to select it</li>
                  <li>• Edit content in the sidebar</li>
                  <li>• Change colors and fonts</li>
                  <li>• Double-click for quick edit</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
