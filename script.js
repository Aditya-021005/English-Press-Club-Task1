let player1, player2;
let currentPlayer = 1;
let score = [0, 0];
let currentQuestionIndex = 0;
let answered = false;
let timer;
let timeLeft = 30;

const questionElement = document.getElementById('question');
const options = {
  A: document.getElementById('optionA'),
  B: document.getElementById('optionB'),
  C: document.getElementById('optionC'),
  D: document.getElementById('optionD'),
};
const timerElement = document.getElementById('timer');
const nextButton = document.getElementById('nextButton');

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

// Start game after player registration
function startGame() {
  player1 = document.getElementById('player1').value || 'Player 1';
  player2 = document.getElementById('player2').value || 'Player 2';
  
  document.getElementById('registerContainer').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';

  updatePlayerTurn();
  loadQuestion();
}

// Load question and answers
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
}

// Start the timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  timerElement.style.color = '#00ff00'; // Green color

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 10) timerElement.style.color = '#ffff00'; // Yellow
    if (timeLeft <= 5) timerElement.style.color = '#ff0000'; // Red

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

// Handle timeout if player doesn't answer
function handleTimeout() {
  if (answered) return;

  const currentQuestion = quizData[currentQuestionIndex];
  options[currentQuestion.correct].classList.add('correct');
  
  answered = true;
  nextButton.disabled = false; // Enable "Next" button after timeout
}

// Handle answer selection
function checkAnswer(answer) {
  if (answered) return; // Prevent multiple clicks

  clearInterval(timer);
  const currentQuestion = quizData[currentQuestionIndex];

  if (answer === currentQuestion.correct) {
    // Correct answer
    options[answer].classList.add('correct');
    score[currentPlayer - 1]++;
    updateScore();
  } else {
    // Wrong answer
    options[answer].classList.add('wrong');
    options[currentQuestion.correct].classList.add('correct');
  }

  answered = true;
  nextButton.disabled = false; // Enable "Next" button
}

// Update score display
function updateScore() {
  document.getElementById('score1').textContent = score[0];
  document.getElementById('score2').textContent = score[1];
}

// Handle "Next" button click
function nextQuestion() {
  // Switch to next player
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updatePlayerTurn();

  // Move to next question
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizData.length) {
    endGame();
  } else {
    clearSelection();
    loadQuestion();
  }
}

// Update player turn display
function updatePlayerTurn() {
  const currentPlayerName = currentPlayer === 1 ? player1 : player2;
  document.getElementById('currentPlayer').textContent = currentPlayerName;
}

// Clear styling for next question
function clearSelection() {
  Object.values(options).forEach(option => {
    option.classList.remove('correct', 'wrong');
  });
}

// End game and show results
function endGame() {
  let winner;
  if (score[0] > score[1]) {
    winner = `${player1} wins!`;
  } else if (score[1] > score[0]) {
    winner = `${player2} wins!`;
  } else {
    winner = "It's a tie!";
  }

  setTimeout(() => {
    alert(`Game Over!\n${player1}: ${score[0]}\n${player2}: ${score[1]}\n${winner}`);
    resetGame();
  }, 500);
}

// Reset game to start over
function resetGame() {
  score = [0, 0];
  currentPlayer = 1;
  currentQuestionIndex = 0;

  updateScore();
  updatePlayerTurn();
  loadQuestion();
}
