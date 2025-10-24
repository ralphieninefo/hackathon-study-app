"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TestPage() {
  const { exam_id } = useParams(); // "sap" or "saa"
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/test/${exam_id}`);
        const data = await res.json();
        if (!mounted) return;
        setQuestions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading questions", e);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    if (exam_id) fetchQuestions();
    return () => {
      mounted = false;
    };
  }, [exam_id]);

  useEffect(() => {
    setSelected("");
  }, [current]);

  if (loading) return <p className="text-center mt-10">Loading questions...</p>;
  if (questions.length === 0)
    return <p className="text-center mt-10">No questions found.</p>;

  const q = questions[current];

  function parseOptions(optString: string | undefined) {
    if (!optString) return [];
    // Split on "A.", "B.", ... and remove the leading marker (A., B., etc.)
    return optString
      .split(/(?=\b[A-Z]\.)/)
      .map((s) => s.replace(/^[A-Z]\.\s*/, "").trim())
      .filter(Boolean);
  }

  const options = parseOptions(q?.["Other Options"]);

  function nextQuestion() {
    const idKey = q?.["Q#"] ?? q?.id ?? String(current);
    const value = selected?.trim() ?? "";

    const newAnswers = { ...answers, [idKey]: value };
    setAnswers(newAnswers);

    setSelected("");
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      try {
        localStorage.setItem("answers", JSON.stringify(newAnswers));
      } catch (e) {
        console.warn("Could not write answers to localStorage", e);
      }
      window.location.href = "/results";
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Question {current + 1} of {questions.length}
      </h2>

      <p className="mb-6">{q?.Question ?? "No question text"}</p>

      {options.length > 0 ? (
        options.map((opt: string, i: number) => {
          const trimmed = opt.trim();
          return (
            <div key={i} className="mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value={trimmed}
                  checked={selected === trimmed}
                  onChange={() => setSelected(trimmed)}
                />
                <span>{trimmed}</span>
              </label>
            </div>
          );
        })
      ) : (
        <p>No options available for this question.</p>
      )}

      <button
        onClick={nextQuestion}
        disabled={!selected}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {current + 1 < questions.length ? "Next" : "Submit Test"}
      </button>
    </div>
  );
}
