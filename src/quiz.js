// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Creates the initial state for a quiz without changing the question input.
 */
function createQuiz(questions) {
  return {
    questions: shuffle(questions),
    current: 0,
    score: 0,
    answered: false,
  };
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Records an answer in a new state object.
 */
function answerQuestion(state, selectedIndex) {
  if (state.answered) {
    return { state: { ...state }, correct: false };
  }

  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answered: true,
    },
    correct,
  };
}

/**
 * Returns true when all questions have been answered.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns an encouraging message for a grade.
 */
function getFeedbackMessage(grade) {
  switch (grade) {
    case "A":
      return "Excellent work!";
    case "B":
      return "Great job!";
    case "C":
      return "Nice effort!";
    default:
      return "Keep practicing!";
  }
}

/**
 * Formats the remaining question time for display.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${Math.max(0, Math.floor(seconds))}s`;
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shuffle,
    createQuiz,
    answerQuestion,
    isQuizFinished,
    isCorrect,
    calculatePercentage,
    getGrade,
    getFeedbackMessage,
    formatTimeLeft,
  };
}
