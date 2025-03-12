let player1, player2;
let currentPlayer = 1;
let score = [0, 0];
let currentQuestionIndex = 0;
let answered = false;
let timer;
let timeLeft = 30;
const correctSound = new Audio ('correct-6033.mp3');
const wrongSound = new Audio ('buzzer-or-wrong-answer-20582.mp3');
const winnerScreen = document.getElementById('winnerScreen');
const winnerMessage = document.getElementById('winnerMessage');


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

// Player registration
// ✅ Start Game with Validation
function startGame() {
  const player1Input = document.getElementById('player1');
  const player2Input = document.getElementById('player2');
  const errorMessage = document.getElementById('errorMessage');

  player1 = player1Input.value.trim(); // Remove whitespace
  player2 = player2Input.value.trim();

  // ✅ Check for empty fields
  if (player1 === "" || player2 === "") {
    errorMessage.textContent = "Both player names are required!";
    return;
  }

  // ✅ Clear error if filled
  errorMessage.textContent = "";

  // ✅ Start the game if validation passe
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
   // Enable "Next" button after timeout
}

// Handle answer selection
let wrongAnswer = false; 
nextButton.disabled = false;// Track if the answer was wrong

// Handle answer selection
function checkAnswer(answer) {
  if (answered) return; // Prevent multiple clicks

  const currentQuestion = quizData[currentQuestionIndex];

  if (answer === currentQuestion.correct) {
    // Correct answer
    options[answer].classList.add('correct');
    score[currentPlayer - 1]++;
    updateScore();
    clearInterval(timer); // Stop timer only for correct answers
    correctSound.play();
    wrongAnswer = false; // Reset wrong answer flag
    nextButton.disabled = false; // Enable "Next" button
  } 
  
  else {
    // Wrong answer
    options[answer].classList.add('wrong');
    options[currentQuestion.correct].classList.add('correct');
    wrongSound.play();
    wrongAnswer = true;
    nextButton.disabled = false;
    
  }

  answered = true;
   
}





// Update score display
function updateScore() {
  document.getElementById('score1').textContent = score[0];
  document.getElementById('score2').textContent = score[1];
}

// Handle "Next" button click

function nextQuestion() {
    if (!wrongAnswer) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    // ✅ Only increment once!
    currentQuestionIndex++; 
    
    updatePlayerTurn();

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

// ✅ Show Winning Screen
function endGame() {
    document.getElementById('quizContainer').style.display = 'none';

    let winner;
    if (score[0] > score[1]) {
        winner = `${player1} wins!`;
    } else if (score[1] > score[0]) {
        winner = `${player2} wins!`;
    } else {
        winner = "It's a tie!";
    }

    // Set winner message
    winnerMessage.textContent = winner;

    // Ensure display is set correctly
    winnerScreen.style.display = 'block'; 
    winnerScreen.classList.add('active'); // Activate visibility
}

// Reset Game
function resetGame() {
    document.getElementById('winnerScreen').classList.remove('active'); // Hide winning screen
    document.getElementById('registerContainer').style.display = 'block';

    score = [0, 0];
    currentQuestionIndex = 0;
    currentPlayer = 1;
    answered = false;
    wrongAnswer = false;

    // Clear previous selections and styling
    clearSelection();

    nextButton.disabled = true; // Disable Next button initially
    updateScore();
    loadQuestion(); // Load first question cleanly
}

// Clear styling and reset button state for next question
function clearSelection() {
    Object.values(options).forEach(option => {
        option.classList.remove('correct', 'wrong');
        option.disabled = false; // Re-enable buttons
    });
}

// Handle answer selection
function checkAnswer(answer) {
    if (answered) return;

    const currentQuestion = quizData[currentQuestionIndex];

    if (answer === currentQuestion.correct) {
        // ✅ Correct answer - update score
        options[answer].classList.add('correct');
        score[currentPlayer - 1]++; // ✅ Correctly increase score
        correctSound.play();
        clearInterval(timer);
        nextButton.disabled = false;
    } else {
        // ✅ Wrong answer logic
        options[answer].classList.add('wrong');
        options[currentQuestion.correct].classList.add('correct');
        wrongSound.play();
        nextButton.disabled = false;
    }

    // ✅ Disable buttons to prevent multiple clicks
    Object.values(options).forEach(option => option.disabled = true);

    answered = true;
    updateScore(); // ✅ Ensure score is updated properly
}
