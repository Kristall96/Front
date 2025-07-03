import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import secureAxios from "../../../utils/secureAxios";
import { useAuth } from "../../../context/AuthContext"; // ← Import your hook

const ComplaintDetail = () => {
  const { query } = useRouter();
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // ← Grab user (with role!) from context

  // Helper: Get base path by user role
  const getBasePath = () => {
    if (!user) return "/complaints"; // fallback
    if (user.role === "admin" || user.role === "moderator")
      return "/admin/complaints";
    return "/complaints"; // for regular users
  };

  const fetchComplaint = async () => {
    if (!query.id) return;
    const { data } = await secureAxios.get(`${getBasePath()}/${query.id}`);
    setComplaint(data);
  };

  const sendMessage = async () => {
    await secureAxios.post(`${getBasePath()}/${query.id}/message`, {
      message,
    });
    setMessage("");
    fetchComplaint();
  };

  useEffect(() => {
    if (query.id && user) fetchComplaint();
    // eslint-disable-next-line
  }, [query.id, user]);

  if (!user) return <div>Loading user…</div>;
  if (!complaint) return <div>Loading...</div>;

  return (
    <div>
      <h1>{complaint.subject}</h1>
      <div>
        {complaint.messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ComplaintDetail;
