"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

export default function TestPage() {
  const { exam_id } = useParams(); // "sap" or "saa"
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/test/${exam_id}`);
        const data = await res.json();
        if (!mounted) return;
        const loadedQuestions = Array.isArray(data) ? data : [];
        setQuestions(loadedQuestions);
        
        // Store exam type and mode for results page
        localStorage.setItem("examType", exam_id as string);
        const isMini = exam_id?.toString().endsWith("-mini");
        localStorage.setItem("isMiniQuiz", isMini ? "true" : "false");

        // Try to resume previous progress
        try {
          const savedAnswers = localStorage.getItem(`answers-${exam_id}`);
          const savedFlags = localStorage.getItem(`flags-${exam_id}`);
          const savedCurrent = localStorage.getItem(`current-${exam_id}`);
          
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
          if (savedFlags) {
            setFlags(JSON.parse(savedFlags));
          }
          if (savedCurrent) {
            setCurrent(parseInt(savedCurrent, 10));
          }
        } catch (e) {
          console.warn("Could not load previous progress", e);
        }
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

    // Auto-save answers whenever they change
    useEffect(() => {
      if (questions.length > 0 && Object.keys(answers).length > 0) {
        try {
          localStorage.setItem(`answers-${exam_id}`, JSON.stringify(answers));
          localStorage.setItem(`current-${exam_id}`, String(current));
          // Also save the questions themselves for mini quizzes (since they're random)
          const isMini = exam_id?.toString().endsWith("-mini");
          if (isMini) {
            localStorage.setItem(`questions-${exam_id}`, JSON.stringify(questions));
          }
        } catch (e) {
          console.warn("Could not save progress", e);
        }
      }
    }, [answers, current, exam_id, questions.length]);

  const getAnswerCount = () => Object.keys(answers).filter(key => answers[key] !== '' && answers[key] !== undefined).length;

  const getQuestionId = (index: number) => {
    const q = questions[index];
    return q?.["Q#"] ?? q?.id ?? String(index);
  };

  const toggleFlag = () => {
    const idKey = getQuestionId(current);
    const newFlags = { ...flags, [idKey]: !flags[idKey] };
    setFlags(newFlags);
    try {
      localStorage.setItem(`flags-${exam_id}`, JSON.stringify(newFlags));
    } catch (e) {
      console.warn("Could not save flags", e);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrent(index);
    setShowGrid(false);
  };

  const goToPrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const goToNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // Get current question safely
  const q = questions[current];

  // Read options (safe with ?)
  const optionA = q?.["Option A"]?.trim() || q?.["Option a"]?.trim() || "";
  const optionB = q?.["Option B"]?.trim() || q?.["Option b"]?.trim() || "";
  const optionC = q?.["Option C"]?.trim() || q?.["Option c"]?.trim() || "";
  const optionD = q?.["Option D"]?.trim() || q?.["Option d"]?.trim() || "";
  const optionE = q?.["Option E"]?.trim() || q?.["Option e"]?.trim() || "";
  const optionF = q?.["Option F"]?.trim() || q?.["Option f"]?.trim() || "";
  
  // Combine all options from individual columns, filtering out empty values
  const options = [
    optionA,
    optionB,
    optionC,
    optionD,
    optionE,
    optionF
  ].filter((opt): opt is string => Boolean(opt));
  
  // Use useMemo to shuffle only when current question changes
  const shuffledOptions = useMemo(() => {
    return [...options].sort(() => Math.random() - 0.5);
  }, [current, optionA, optionB, optionC, optionD, optionE, optionF]);

  // Check if this is a "choose 2" or multiple selection question
  // Use the new "Multi-Select" column if available
  const isMultipleChoice = q?.["Multi-Select"]?.toLowerCase() === "true" || 
                           q?.Question?.toLowerCase().includes("select two") || 
                           q?.Question?.toLowerCase().includes("choose two") ||
                           q?.Question?.toLowerCase().includes("select 2") ||
                           q?.Question?.toLowerCase().includes("choose 2");

  // Now handle answer restoration after variables are defined
  useEffect(() => {
    const idKey = getQuestionId(current);
    const savedAnswer = answers[idKey];
    
    if (savedAnswer && savedAnswer !== '') {
      // Restore single select
      if (!isMultipleChoice && savedAnswer.length === 1) {
        const optionMap: Record<string, string> = {};
        if (optionA) optionMap['A'] = optionA;
        if (optionB) optionMap['B'] = optionB;
        if (optionC) optionMap['C'] = optionC;
        if (optionD) optionMap['D'] = optionD;
        if (optionE) optionMap['E'] = optionE;
        if (optionF) optionMap['F'] = optionF;
        
        const selectedText = optionMap[savedAnswer];
        if (selectedText) setSelected(selectedText);
        else setSelected("");
      } 
      // Restore multi-select
      else if (isMultipleChoice && savedAnswer.length > 1) {
        const optionMap: Record<string, string> = {};
        if (optionA) optionMap['A'] = optionA;
        if (optionB) optionMap['B'] = optionB;
        if (optionC) optionMap['C'] = optionC;
        if (optionD) optionMap['D'] = optionD;
        if (optionE) optionMap['E'] = optionE;
        if (optionF) optionMap['F'] = optionF;
        
        const selectedTexts = savedAnswer.split('').map(letter => optionMap[letter]).filter(Boolean);
        if (selectedTexts.length > 0) setSelectedMultiple(selectedTexts);
        else setSelectedMultiple([]);
      } else {
        setSelected("");
        setSelectedMultiple([]);
      }
    } else {
      setSelected("");
      setSelectedMultiple([]);
    }
  }, [current, isMultipleChoice, optionA, optionB, optionC, optionD, optionE, optionF, answers, questions]);

  if (loading) return <p className="text-center mt-10">Loading questions...</p>;
  if (questions.length === 0)
    return <p className="text-center mt-10">No questions found.</p>;

  function nextQuestion() {
    const idKey = q?.["Q#"] ?? q?.id ?? String(current);
    
    let value = "";
    if (isMultipleChoice && selectedMultiple.length > 0) {
      // For multi-select, map selected text to original option letters
      const selectedLetters = selectedMultiple
        .map(text => {
          // Find which original option (A-F) this selected text corresponds to
          if (text === optionA) return 'A';
          if (text === optionB) return 'B';
          if (text === optionC) return 'C';
          if (text === optionD) return 'D';
          if (text === optionE) return 'E';
          if (text === optionF) return 'F';
          return '';
        })
        .filter(Boolean)
        .sort()
        .join('');
      value = selectedLetters;
    } else {
      // For single-select, map selected text to original option letter
      if (selected === optionA) value = 'A';
      else if (selected === optionB) value = 'B';
      else if (selected === optionC) value = 'C';
      else if (selected === optionD) value = 'D';
      else if (selected === optionE) value = 'E';
      else if (selected === optionF) value = 'F';
    }
    
    const newAnswers = { ...answers, [idKey]: value };
    setAnswers(newAnswers);

    setSelected("");
    setSelectedMultiple([]);
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      try {
        localStorage.setItem("answers", JSON.stringify(newAnswers));
        // Save the specific questions used for mini quizzes
        const isMini = exam_id?.toString().endsWith("-mini");
        if (isMini) {
          localStorage.setItem("testQuestions", JSON.stringify(questions));
        }
      } catch (e) {
        console.warn("Could not write answers to localStorage", e);
      }
      window.location.href = "/results";
    }
  }

  // Handler for multi-select checkboxes
  const handleMultipleSelect = (option: string) => {
    setSelectedMultiple(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const progress = ((current + 1) / questions.length) * 100;
  const answeredCount = getAnswerCount();
  const isCurrentFlagged = flags[getQuestionId(current)];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">
            Question {current + 1} of {questions.length}
          </h2>
          <span className="text-sm text-gray-600">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Navigation Grid */}
      {showGrid && (
        <div className="mb-6 bg-white border-3 border-gray-300 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-gray-800">Jump to Question</h3>
            <button 
              onClick={() => setShowGrid(false)}
              className="text-gray-600 hover:text-red-600 font-bold text-2xl transition-colors bg-gray-100 hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center"
              title="Close"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-10 gap-2 max-h-80 overflow-y-auto p-2 bg-gray-50 rounded-xl">
            {questions.map((_, idx) => {
              const qId = getQuestionId(idx);
              const hasAnswer = answers[qId] && answers[qId] !== '';
              const isFlagged = flags[qId];
              const isActive = idx === current;
              
              return (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className={`h-10 w-10 rounded-lg text-sm font-bold transition-all hover:scale-110 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-300 scale-110' 
                      : hasAnswer 
                        ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  } ${isFlagged ? 'ring-2 ring-yellow-500' : ''}`}
                  title={`Question ${idx + 1}${isFlagged ? ' (Flagged)' : ''}${hasAnswer ? ' (Answered)' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <p className="flex-1 text-lg leading-relaxed">{q?.Question ?? "No question text"}</p>
          <button
            onClick={toggleFlag}
            className={`text-2xl transition ${isCurrentFlagged ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            title={isCurrentFlagged ? "Remove flag" : "Flag for review"}
          >
            📌
          </button>
        </div>

        {isMultipleChoice && (
          <p className="mb-4 text-sm text-blue-600 font-medium">
            Select 2 answers:
          </p>
        )}

        {shuffledOptions.length > 0 ? (
          shuffledOptions.map((opt: string, i: number) => {
            const trimmed = opt.trim();
            return (
              <div key={i} className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition">
                  <input
                    type={isMultipleChoice ? "checkbox" : "radio"}
                    name="answer"
                    value={trimmed}
                    checked={isMultipleChoice ? selectedMultiple.includes(trimmed) : selected === trimmed}
                    onChange={() => isMultipleChoice ? handleMultipleSelect(trimmed) : setSelected(trimmed)}
                  />
                  <span className="flex-1 leading-relaxed">{trimmed}</span>
                </label>
              </div>
            );
          })
        ) : (
          <p>No options available for this question.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          {showGrid ? 'Hide Grid' : 'Show Questions'}
        </button>
        
        <button
          onClick={goToPrevious}
          disabled={current === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={isMultipleChoice ? selectedMultiple.length < 2 : !selected}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          {current + 1 < questions.length ? "Next →" : "Submit Test"}
        </button>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-green-600 rounded-lg shadow-sm"></div>
          <span className="font-medium text-gray-700">Answered</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-blue-600 rounded-lg shadow-sm ring-2 ring-blue-300"></div>
          <span className="font-medium text-gray-700">Current</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-white border-2 border-yellow-500 rounded-lg shadow-sm"></div>
          <span className="font-medium text-gray-700">Flagged</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
          <div className="w-5 h-5 bg-white border-2 border-gray-400 rounded-lg shadow-sm"></div>
          <span className="font-medium text-gray-700">Unanswered</span>
        </div>
      </div>
    </div>
  );
}
