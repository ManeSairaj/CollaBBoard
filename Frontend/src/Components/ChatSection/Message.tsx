// Message.tsx
import React from "react";
import { useParams } from "react-router-dom";

interface MessageProps {
  message: string;
  sender: string | undefined;
}

const Message: React.FC<MessageProps> = ({ message, sender }) => {
  let { name } = useParams();

  const messageClass = sender === name ? "text-right" : "";

  return (
    <div className={`mb-2 ${messageClass}`}>
      <div className="text-sky-500 font-bold tracking-wider p-1 py-2">
        {sender}
      </div>
      <p
        className={`rounded-lg py-2 px-4 inline-block text-wrap break-words max-w-[16rem] ${
          sender === name
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default Message;
