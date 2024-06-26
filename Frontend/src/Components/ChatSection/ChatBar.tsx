import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useDrawingStore } from "../../store/DrawingState";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

type chatType = { username: string | undefined; message: string };

const ChatBar: React.FC = () => {
  const [chatSection, setChatSection] = useState<boolean>(false);
  const [userInput, setUserInput] = useState(""); 
  const [messages, setMessages] = useState<chatType[]>([]);
  const { username } = useDrawingStore();

  let { id, name } = useParams();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("chatConnect", { username, roomId: id, id: socket.id });
    });

    socket.on("initChat", (data: chatType[]) => {
      setMessages(data);
    });

    socket.on("chatMessage", (data: { username: string; message: string }) => {
      console.log("message received", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("initChat");
      socket.off("chatMessage");
    };
  }, [username, id]);

  const handleSend = () => {
    if (userInput.trim() !== "") {
      const messageData = {
        username: name,
        message: userInput.trim(),
        roomId: id,
      };

      console.log("chatMessage", messageData);
      socket.emit("chatMessage", messageData);
      setUserInput("");
    }
  };

  useEffect(() => {
    console.log("user", username);
    console.log("roomid", id);
    console.log("roomid", name);
  }, [chatSection]);

  return (
    <div className="fixed top-2 right-0 mb-4 mr-4">
      <div
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        onClick={() => {
          setChatSection((prev) => !prev);
        }}
      >
        {chatSection ? (
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
            alt="multiply"
            className="size-6"
          />
        ) : (
          <img
            width="64"
            height="64"
            src="https://img.icons8.com/glyph-neue/64/FFFFFF/chat.png"
            alt="chat"
            className="size-6"
          />
        )}
      </div>

      <div
        className={`${chatSection ? "" : "hidden"} fixed top-2 right-4 w-96`}
        id="chat-container"
      >
        <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
          <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <p className="text-xl font-semibold tracking-widest">Chat</p>
            <button
              className="text-gray-300 hover:text-white hover:scale-105 focus:outline-none"
              onClick={() => setChatSection(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div id="chatbox" className="p-4 h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <Message
                key={index}
                message={msg.message}
                sender={msg.username}
              />
            ))}
          </div>

          <div className="p-4 border-t flex">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-3 py-2 border rounded-l-md outline-none border-none"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-blue-500 text-white py-2 px-3 rounded-r-md hover:bg-blue-600 transition duration-300 outline-none border-none"
              onClick={handleSend}
            >
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/paper-plane.png"
                alt="paper-plane"
                className="size-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
