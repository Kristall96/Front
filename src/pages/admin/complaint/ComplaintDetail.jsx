import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import secureAxios from "../../../utils/secureAxios";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchComplaint = async () => {
    try {
      const { data } = await secureAxios.get(`/admin/complaints/${id}`);
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const postMessage = async () => {
    try {
      await secureAxios.post(`/admin/complaints/${id}/message`, { message });
      setMessage("");
      fetchComplaint();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  if (!complaint) return <p>Loading complaint...</p>;

  return (
    <div>
      <button
        className="mb-4 text-blue-400"
        onClick={() => navigate("/dashboard/admin/complaints")}
      >
        ← Back to list
      </button>
      <h2 className="text-2xl mb-2">{complaint.subject}</h2>
      <p className="mb-4">
        Status: <strong>{complaint.status}</strong>
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <section className="bg-slate-700 p-4 rounded mb-4 max-h-64 overflow-y-auto">
        {complaint.messages.map((m, i) => (
          <div key={i} className="mb-3">
            <div className="text-sm text-gray-400">
              <strong>{m.role}</strong> on {new Date(m.sentAt).toLocaleString()}
            </div>
            <div className="mt-1">{m.message}</div>
          </div>
        ))}
      </section>

      <textarea
        value={message}
        rows={4}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 bg-[#1e293b] rounded text-white"
        placeholder="Type your message…"
      />

      <button
        className="mt-2 bg-green-600 px-4 py-2 rounded"
        onClick={postMessage}
      >
        Send Message
      </button>
    </div>
  );
};

export default ComplaintDetail;
