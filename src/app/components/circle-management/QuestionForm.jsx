import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const QuestionForm = ({ 
  questions, 
  updateQuestion, 
  updateAnswer, 
  setCorrectAnswer, 
  addQuestion, 
  removeQuestion,
  prefix = "" // For unique IDs in modal vs form
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Join Questions *
        </label>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          <Plus className="h-3 w-3" />
          <span>Add Question</span>
        </button>
      </div>

      {questions.map((question, qIndex) => (
        <div
          key={qIndex}
          className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Question {qIndex + 1}
            </h4>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-800 dark:text-red-400"
                aria-label="Remove question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Enter your question"
            value={question.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
            required
          />

          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select the correct answer:
            </p>
          </div>

          <div className="space-y-2">
            {question.answers.map((answer, aIndex) => (
              <div key={aIndex} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`correct-answer-${prefix}${qIndex}`}
                  id={`${prefix}q${qIndex}-a${aIndex}`}
                  checked={question.correctAnswer === aIndex}
                  onChange={() => setCorrectAnswer(qIndex, aIndex)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <input
                  type="text"
                  placeholder={`Answer ${aIndex + 1}`}
                  value={answer}
                  onChange={(e) =>
                    updateAnswer(qIndex, aIndex, e.target.value)
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  required
                />
                <label
                  htmlFor={`${prefix}q${qIndex}-a${aIndex}`}
                  className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer"
                >
                  {question.correctAnswer === aIndex ? "✓ Correct" : "Mark as correct"}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionForm;