import React, { useRef } from "react";
import EmailEditor from "react-email-editor";

const EmailTemplateEditor = ({
  onSave,
  initialDesign,
  onExport,
  mode = "edit",
}) => {
  const emailEditorRef = useRef(null);

  // Load a template when editor loads
  const onLoad = () => {
    if (
      initialDesign &&
      typeof initialDesign === "object" &&
      Object.keys(initialDesign).length > 0
    ) {
      emailEditorRef.current.editor.loadDesign(initialDesign);
    }
  };

  // Save the email design JSON
  const handleSave = () => {
    if (emailEditorRef.current && emailEditorRef.current.editor) {
      emailEditorRef.current.editor.saveDesign((design) => {
        if (onSave) onSave(design);
      });
    }
  };

  // Export HTML for sending
  const handleExport = () => {
    if (emailEditorRef.current && emailEditorRef.current.editor) {
      emailEditorRef.current.editor.exportHtml((data) => {
        if (onExport) onExport(data);
      });
    }
  };

  return (
    <div style={{ minHeight: 800 }}>
      <EmailEditor
        ref={emailEditorRef}
        onLoad={onLoad}
        minHeight={700}
        options={{
          displayMode: "email",
          mergeTags: {
            "First Name": "{{user.firstName}}",
            "Last Name": "{{user.lastName}}",
            Email: "{{user.email}}",
          },
          appearance: {
            theme: "dark", // or dark, limited
          },
        }}
      />

      <div className="flex gap-4 mt-4">
        <button
          className="px-5 py-2 bg-blue-700 text-white rounded"
          onClick={handleSave}
        >
          Save Template
        </button>
        <button
          className="px-5 py-2 bg-green-600 text-white rounded"
          onClick={handleExport}
        >
          Export HTML
        </button>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
