"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FlashcardProps {
  front: string;
  back: string;
}

export default function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-64 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center border-2 border-gray-600 hover:border-blue-500 transition-colors">
            <p className="text-gray-100 font-semibold text-lg text-center">
              {front}
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 flex items-center justify-center">
            <p className="text-white font-medium text-center leading-relaxed">
              {back}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

