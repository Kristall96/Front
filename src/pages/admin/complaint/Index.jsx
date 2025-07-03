import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import secureAxios from "../../../utils/secureAxios";
// import { useAuth } from ...  // If you have a context to get current user role

const ComplaintDetail = ({ role }) => {
  const { query } = useRouter();
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState("");
  // const { user } = useAuth(); // if you have an Auth context

  // fallback: If you have no Auth context, pass `role` as a prop when using this component
  // role = user?.role || 'admin';

  // Dynamically choose endpoint based on role
  const getBasePath = () =>
    role === "admin" || role === "moderator"
      ? "/admin/complaints"
      : "/complaints";

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
    if (query.id) fetchComplaint();
    // eslint-disable-next-line
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
