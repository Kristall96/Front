import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function useChatSocket(user) {
  const [rooms, setRooms] = useState([]); // List of rooms
  const [currentRoom, setCurrentRoom] = useState(null); // Current active room
  const [messages, setMessages] = useState({}); // Stores messages for each room
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Pass token explicitly if necessary
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      query: { token: document.cookie.split("=")[1] }, // Access token from cookies
    });

    socketRef.current = socket;

    // Listen for available rooms/channels
    socket.on("roomList", (roomList) => {
      setRooms(roomList);
    });

    // Listen for new messages and update state
    socket.on("message", (msg) => {
      setMessages((prev) => ({
        ...prev,
        [msg.roomId]: [
          ...(prev[msg.roomId] || []),
          {
            ...msg,
            senderName: msg.senderName, // Ensure sender's name is included
            senderId: msg.senderId, // Ensure sender's ID is included
          },
        ],
      }));
    });

    // Get room list on connect
    socket.emit("getRooms");

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Function to manually refresh the room list
  const refreshRooms = () => {
    if (socketRef.current) {
      socketRef.current.emit("getRooms");
    }
  };

  // Function to join a room and fetch messages
  const joinRoom = (roomId) => {
    setCurrentRoom(roomId);
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", roomId); // Join the room and get the history
    }
  };

  useEffect(() => {
    if (!currentRoom) return;

    socketRef.current?.on("roomMessages", (messages) => {
      const updatedMessages = messages.map((msg) => ({
        ...msg,
        senderName: msg.sender ? msg.sender.name : "Unknown", // Add sender's name
      }));

      setMessages((prev) => ({
        ...prev,
        [currentRoom]: updatedMessages,
      }));
    });

    return () => {
      socketRef.current?.off("roomMessages");
    };
  }, [currentRoom]);

  // Function to send a message
  const sendMessage = (roomId, message, user) => {
    if (socketRef.current && user) {
      socketRef.current.emit("sendMessage", {
        roomId,
        text: message,
        sender: user.id, // Ensure sender is included
        senderName: user.name, // Ensure sender name is included
      });
    }
  };

  return {
    socket: socketRef.current,
    rooms,
    currentRoom,
    messages,
    joinRoom,
    refreshRooms,
    sendMessage, // Return sendMessage
  };
}
