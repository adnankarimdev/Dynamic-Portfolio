"use client";

import React, { useState, useEffect } from "react";
import RecordingLoader from "./RecordingLoaderMini";

const messages = [
  { text: "Gettings things set up", emoji: "🧑‍💻" },
  { text: "Upload initiated", emoji: "🚀" },
  { text: "That resume/cv is packed! You're a star", emoji: "⭐" },
  { text: "Finalizing things for the perfect portfolio", emoji: "✨" },
];

export default function ResumeUploadLoader() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        if (prevIndex < messages.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(messageInterval);
          return prevIndex;
        }
      });
    }, 5000); // Change message every 3 seconds

    const dotsInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500); // Animate dots every 0.5 seconds

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
      <div className="mb-4">
        <RecordingLoader />
      </div>
      <p className="text-xl font-semibold text-gray-800 mb-2">
        {messages[currentMessageIndex].text}{" "}
        {messages[currentMessageIndex].emoji}
      </p>
    </div>
  );
}
