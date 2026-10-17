// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_LIMIT = 15;
const BEST_SCORE_STORAGE_KEY = "dev-days-quiz-best-score";
let state = createQuiz([]);
let timeLeft = 0;
let timerId = null;
let bestScore = loadBestScore();

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timerText = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");
const startBestScoreText = document.getElementById("start-best-score");
const resultBestScoreText = document.getElementById("result-best-score");
const newBestText = document.getElementById("new-best");

function loadBestScore() {
  try {
    const storedScore = localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    if (storedScore === null) return null;

    const score = Number(storedScore);
    return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
  } catch (error) {
    console.warn("Unable to read the best score from localStorage.", error);
    return null;
  }
}

function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch (error) {
    console.warn("Unable to save the best score to localStorage.", error);
  }
}

function renderBestScore(element) {
  element.hidden = bestScore === null;
  if (bestScore !== null) {
    element.textContent = `Best score: ${bestScore}%`;
  }
}

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopTimer();
  state = createQuiz(QUESTIONS);
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopTimer();
  const question = state.questions[state.current];
  timeLeft = QUESTION_TIME_LIMIT;
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  updateTimer();
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      finishQuestion();
    }
  }, 1000);
}

function updateTimer() {
  timerText.textContent = formatTimeLeft(timeLeft);
  timerText.classList.toggle("low-time", timeLeft <= 5);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function finishQuestion(selectedIndex, selectedButton) {
  if (state.answered) return;
  stopTimer();

  const question = state.questions[state.current];
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  const result = answerQuestion(state, selectedIndex);
  state = result.state;
  if (selectedButton && result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = "Correct!";
  } else if (selectedButton) {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Not quite. The correct answer is highlighted.";
  } else {
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = "Time's up!";
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function selectAnswer(selectedIndex, selectedButton) {
  finishQuestion(selectedIndex, selectedButton);
}

function nextQuestion() {
  stopTimer();
  state = { ...state, current: state.current + 1, answered: false };
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  const newBest = isNewBestScore(percentage, bestScore);
  if (newBest) {
    bestScore = percentage;
    saveBestScore(bestScore);
  }

  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  renderBestScore(resultBestScoreText);
  newBestText.hidden = !newBest;
  renderBestScore(startBestScoreText);
  showScreen(resultScreen);
}

renderBestScore(startBestScoreText);
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
