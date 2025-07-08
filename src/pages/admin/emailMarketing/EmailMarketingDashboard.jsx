import React, { useState, useEffect } from "react";
import EmailTemplateEditor from "./EmailTemplateEditor";
import secureAxios from "../../../utils/secureAxios";

const EmailMarketingDashboard = () => {
  const [templates, setTemplates] = useState([]);
  const [editingDesign, setEditingDesign] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch existing templates from your backend
  useEffect(() => {
    secureAxios
      .get("/admin/rich-documents")
      .then((res) => setTemplates(res.data))
      .catch(() => setTemplates([]));
  }, []);

  // Save design to backend
  const handleSave = async (design) => {
    if (editingId) {
      await secureAxios.put(`/admin/rich-documents/${editingId}`, { design });
    } else {
      await secureAxios.post("/admin/rich-documents", { design });
    }
    window.location.reload(); // Reload for simplicity
  };

  // Export HTML (for sending, preview, etc)
  const handleExport = (data) => {
    // Example: show HTML in a modal or send it to backend for sending
    alert("HTML exported. Ready to send!");
    // data.html contains the HTML, data.design the design JSON
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Email Campaigns</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setEditingDesign({});
            setEditingId(null);
          }}
        >
          + New Template
        </button>
      </div>

      {editingDesign ? (
        <EmailTemplateEditor
          initialDesign={editingDesign}
          onSave={handleSave}
          onExport={handleExport}
        />
      ) : (
        <div>
          <ul>
            {templates.map((tpl) => (
              <li
                key={tpl._id}
                className="mb-3 flex justify-between items-center bg-slate-800 rounded p-3"
              >
                <span>{tpl.name || "Untitled Template"}</span>
                <div>
                  <button
                    className="mr-3 text-blue-400"
                    onClick={() => {
                      setEditingDesign(tpl.design);
                      setEditingId(tpl._id);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailMarketingDashboard;
