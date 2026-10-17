// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  createQuiz,
  answerQuestion,
  isQuizFinished,
  isNewBestScore,
  isCorrect,
  calculatePercentage,
  getGrade,
  getFeedbackMessage,
  formatTimeLeft,
} = require("../src/quiz.js");

test("createQuiz returns a fresh initial state", () => {
  const questions = [{ question: "One", options: ["a"], answer: 0 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, {
    questions,
    current: 0,
    score: 0,
    answered: false,
  });
  assert.notStrictEqual(state, questions);
  assert.notStrictEqual(state.questions, questions);
});

test("answerQuestion returns a new state and records a correct answer", () => {
  const state = {
    questions: [{ question: "One", options: ["a", "b"], answer: 1 }],
    current: 0,
    score: 0,
    answered: false,
  };

  const result = answerQuestion(state, 1);

  assert.equal(result.correct, true);
  assert.deepEqual(result.state, { ...state, score: 1, answered: true });
  assert.deepEqual(state, {
    questions: state.questions,
    current: 0,
    score: 0,
    answered: false,
  });
  assert.notStrictEqual(result.state, state);
});

test("answerQuestion records an incorrect answer without mutating state", () => {
  const state = {
    questions: [{ question: "One", options: ["a", "b"], answer: 1 }],
    current: 0,
    score: 2,
    answered: false,
  };

  const result = answerQuestion(state, 0);

  assert.equal(result.correct, false);
  assert.deepEqual(result.state, { ...state, answered: true });
  assert.equal(state.answered, false);
});

test("isQuizFinished reports whether every question is complete", () => {
  assert.equal(isQuizFinished({ questions: [{}, {}], current: 1 }), false);
  assert.equal(isQuizFinished({ questions: [{}, {}], current: 2 }), true);
});

test("isNewBestScore treats a first score as a new best", () => {
  assert.equal(isNewBestScore(80, null), true);
});

test("isNewBestScore returns true only for a higher score", () => {
  assert.equal(isNewBestScore(81, 80), true);
  assert.equal(isNewBestScore(80, 80), false);
  assert.equal(isNewBestScore(79, 80), false);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75% and a C for exactly 50%", () => {
  assert.equal(getGrade(75), "B");
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns encouragement for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
  assert.equal(getFeedbackMessage("B"), "Great job!");
  assert.equal(getFeedbackMessage("C"), "Nice effort!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing!");
});

test("formatTimeLeft formats a positive number of seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft preserves the five-second warning boundary", () => {
  assert.equal(formatTimeLeft(5), "⏱ 5s");
});

test("formatTimeLeft formats zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("formatTimeLeft clamps negative seconds to zero", () => {
  assert.equal(formatTimeLeft(-1), "⏱ 0s");
});

test("formatTimeLeft treats null seconds as zero", () => {
  assert.equal(formatTimeLeft(null), "⏱ 0s");
});
