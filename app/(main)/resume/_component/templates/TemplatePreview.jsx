// TemplatePreview.jsx
import React, { useState } from "react";

const TemplatePreview = ({ template, data, isEditable, onFieldUpdate }) => {
  const [editingField, setEditingField] = useState(null);

  const handleFieldClick = (fieldPath) => {
    if (isEditable) {
      setEditingField(fieldPath);
    }
  };

  const handleFieldBlur = (value, fieldPath) => {
    onFieldUpdate(fieldPath, value);
    setEditingField(null);
  };

  return (
    <div className="template-preview">
      <div className="preview-container">
        {/* This would render the actual template component */}
        <div
          className="editable-field"
          onClick={() => handleFieldClick("personalInfo.name")}
        >
          {editingField === "personalInfo.name" ? (
            <input
              autoFocus
              defaultValue={data.personalInfo.name}
              onBlur={(e) =>
                handleFieldBlur(e.target.value, "personalInfo.name")
              }
            />
          ) : (
            data.personalInfo.name || "Your Name"
          )}
        </div>

        {/* More editable fields would go here */}
      </div>
    </div>
  );
};

export default TemplatePreview;
