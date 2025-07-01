import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import secureAxios from "../../../utils/secureAxios";

const ComplaintDetail = () => {
  const { query } = useRouter();
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");

  const fetchComplaint = async () => {
    const { data } = await secureAxios.get(`/admin/complaints/${query.id}`);
    setComplaint(data);
  };

  const sendMessage = async () => {
    await secureAxios.post(`/admin/complaints/${query.id}/message`, {
      message,
    });
    setMessage("");
    fetchComplaint();
  };

  useEffect(() => {
    if (query.id) fetchComplaint();
  }, [query.id]);

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
