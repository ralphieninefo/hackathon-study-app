"use client";

import { useEffect, useState, useMemo } from "react";
import Flashcard from "../components/Flashcard";

interface FlashcardData {
  id: number;
  service: string;
  category: string;
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "all",
    "DevOps",
    "Disaster Recovery",
    "Storage",
    "Networking",
    "Security",
    "Compute",
    "Database",
    "Monitoring"
  ];

  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Use useMemo to filter cards reactively
  const filteredCards = useMemo(() => {
    if (flashcards.length === 0) {
      return [];
    }

    let filtered = flashcards;

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((card) =>
        card.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.front.toLowerCase().includes(query) ||
          card.back.toLowerCase().includes(query) ||
          (card.service && card.service.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [flashcards, category, searchQuery]);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      // Fetch all flashcards at once
      const res = await fetch("/api/flashcards");
      const data = await res.json();
      setFlashcards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

  const displayCards = useMemo(() => {
    if (shuffledOrder.length > 0 && shuffledOrder.length === filteredCards.length) {
      return shuffledOrder.map(index => filteredCards[index]);
    }
    return filteredCards;
  }, [filteredCards, shuffledOrder]);

  const shuffleCards = () => {
    const indices = Array.from({ length: filteredCards.length }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    setShuffledOrder(shuffled);
  };

  // Reset shuffle when filters change
  useEffect(() => {
    setShuffledOrder([]);
  }, [category, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AWS Flashcards
          </h1>
          <p className="text-gray-300">
            Click any card to flip and reveal the answer
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition text-white"
              >
                {categories.map((cat) => (
                <option key={cat.toLowerCase()} value={cat.toLowerCase()}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by question, answer, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition text-white placeholder-gray-400"
              />
            </div>

            {/* Shuffle Button */}
            <div className="flex items-end">
              <button
                onClick={shuffleCards}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                🔀 Shuffle Cards
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-300">
              Showing {filteredCards.length} of {flashcards.length} flashcards
              {category !== "all" && ` in ${category}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Flashcard Grid */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
            <p className="text-xl text-gray-300">
              {searchQuery
                ? "No flashcards match your search"
                : "No flashcards available for this category"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-400 hover:text-blue-300 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCards.map((card, index) => (
              <Flashcard
                key={`${card.category || 'unknown'}-${card.service || 'unknown'}-${card.id || index}-${index}`}
                front={card.front}
                back={card.back}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

