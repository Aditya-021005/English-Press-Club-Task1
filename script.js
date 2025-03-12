let player1, player2;
let currentPlayer = 1;
let score = [0, 0];
let currentQuestionIndex = 0;
let answered = false;
let timer;
let timeLeft = 30;

const correctSound = new Audio('correct-6033.mp3');
const wrongSound = new Audio('buzzer-or-wrong-answer-20582.mp3');

const questionElement = document.getElementById('question');
const options = {
  A: document.getElementById('optionA'),
  B: document.getElementById('optionB'),
  C: document.getElementById('optionC'),
  D: document.getElementById('optionD'),
};
const timerElement = document.getElementById('timer');
const nextButton = document.getElementById('nextButton');
const winnerScreen = document.getElementById('winnerScreen');
const winnerMessage = document.getElementById('winnerMessage');

// Quiz Data
const quizData = [
  {
    question: "What is the capital of France?",
    answers: { A: "Paris", B: "London", C: "Rome", D: "Berlin" },
    correct: "A",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: { A: "Earth", B: "Venus", C: "Mars", D: "Jupiter" },
    correct: "C",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    answers: { A: "Harper Lee", B: "George Orwell", C: "Mark Twain", D: "Jane Austen" },
    correct: "A",
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: { A: "Atlantic Ocean", B: "Indian Ocean", C: "Arctic Ocean", D: "Pacific Ocean" },
    correct: "D",
  },
];

// ✅ Start Game
function startGame() {
  player1 = document.getElementById('player1').value || 'Player 1';
  player2 = document.getElementById('player2').value || 'Player 2';

  document.getElementById('registerContainer').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';

  resetGameState(); // Reset game state before starting
  loadQuestion();
}

// ✅ Load Question
function loadQuestion() {
  answered = false;
  nextButton.disabled = true;

  // Reset timer
  resetTimer();

  const currentQuestion = quizData[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  
  options.A.textContent = `A: ${currentQuestion.answers.A}`;
  options.B.textContent = `B: ${currentQuestion.answers.B}`;
  options.C.textContent = `C: ${currentQuestion.answers.C}`;
  options.D.textContent = `D: ${currentQuestion.answers.D}`;

  // Re-enable buttons for next round
  Object.values(options).forEach(option => {
    option.disabled = false;
  });
}

// ✅ Reset Timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  timerElement.style.color = '#00ff00';

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 10) timerElement.style.color = '#ffff00';
    if (timeLeft <= 5) timerElement.style.color = '#ff0000';

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

// ✅ Handle Timeout
function handleTimeout() {
  if (answered) return;
  
  answered = true;

  const correctAnswer = quizData[currentQuestionIndex].correct;
  options[correctAnswer].classList.add('correct'); // Highlight correct answer

  nextButton.disabled = false;
}

// ✅ Handle First Button (Positive)
function handlePositive() {
  if (answered) return;
  answered = true;

  correctSound.currentTime = 0;
  correctSound.play();

  // Check correct answer
  checkAnswer(quizData[currentQuestionIndex].correct);

  setTimeout(() => {
    nextQuestion();
    switchPlayer();
  }, 1000);
}

// ✅ Handle Second Button (Negative)
function handleNegative() {
  if (answered) return;
  answered = true;

  wrongSound.currentTime = 0;
  wrongSound.play();

  // Pass invalid value to simulate wrong answer
  checkAnswer('X');

  setTimeout(() => {
    answered = false;
  }, 1000);
}

// ✅ Handle Answer Selection and Highlight Correct/Wrong
function checkAnswer(answer) {
  if (answered) return;
  answered = true;

  const currentQuestion = quizData[currentQuestionIndex];
  
  if (answer === currentQuestion.correct) {
    options[answer].classList.add('correct');
    score[currentPlayer - 1]++;
  } else {
    options[answer]?.classList.add('wrong');
    options[currentQuestion.correct].classList.add('correct');
  }

  updateScore();

  // Disable all options after answering
  Object.values(options).forEach(option => option.disabled = true);

  nextButton.disabled = false;
}

// ✅ Update Score
function updateScore() {
  document.getElementById('score1').textContent = score[0];
  document.getElementById('score2').textContent = score[1];
}

// ✅ Handle Next Question
function nextQuestion() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentQuestionIndex++;

  if (currentQuestionIndex >= quizData.length) {
    endGame();
  } else {
    clearSelection();
    loadQuestion();
  }
}

// ✅ Switch Player Turn
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updatePlayerTurn();
}

// ✅ Clear Styling and Reset Button State
function clearSelection() {
  Object.values(options).forEach(option => {
    option.classList.remove('correct', 'wrong');
    option.disabled = false; // Reset button state
  });
}

// ✅ Show Winning Screen
function endGame() {
  document.getElementById('quizContainer').style.display = 'none';
  winnerScreen.style.display = 'block';

  let winner;
  if (score[0] > score[1]) {
    winner = `${player1} wins!`;
  } else if (score[1] > score[0]) {
    winner = `${player2} wins!`;
  } else {
    winner = "It's a tie!";
  }

  winnerMessage.textContent = winner;
}

// ✅ Reset Game
function resetGame() {
  resetGameState();

  // Hide winning screen and return to registration
  winnerScreen.style.display = 'none';
  document.getElementById('registerContainer').style.display = 'block';
}

// ✅ Reset Game State
function resetGameState() {
  score = [0, 0];
  currentQuestionIndex = 0;
  currentPlayer = 1;
  answered = false;

  updateScore();
  clearSelection();
  updatePlayerTurn();
}

// ✅ Update Player Turn
function updatePlayerTurn() {
  const currentPlayerName = currentPlayer === 1 ? player1 : player2;
  document.getElementById('currentPlayer').textContent = currentPlayerName;
}
