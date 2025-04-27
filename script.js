const nameScreen = document.getElementById('name-screen');
const nameSubmitBtn = document.getElementById('name-submit-btn');
const userNameInput = document.getElementById('user-name');
const welcomeText = document.getElementById('welcome-text');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

const quizScreen = document.getElementById('quiz-screen');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

const resultScreen = document.getElementById('result-screen');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5;
let userName = "";

// Helper function to decode HTML entities
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// 1. User enters their name
nameSubmitBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (name === "") {
        alert('Please enter your name.');
        return;
    }
    userName = name;
    nameScreen.style.display = 'none';
    startScreen.style.display = 'block';
});

// 2. User selects number of questions
startBtn.addEventListener('click', async () => {
    const count = document.getElementById('question-count').value;
    if (count < 1 || count > 50) {
        alert('Please enter a number between 1 and 50.');
        return;
    }
    totalQuestions = count;
    await fetchQuestions(totalQuestions);
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    welcomeText.textContent = `Welcome, ${userName}!`;
    showQuestion();
});

// 3. Show questions
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

// 4. Restart quiz
restartBtn.addEventListener('click', () => {
    location.reload();
});

// Fetch questions from API
async function fetchQuestions(count) {
    const res = await fetch(`https://opentdb.com/api.php?amount=${count}`);
    const data = await res.json();
    questions = data.results;
}

// Show current question
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = decodeHTML(currentQuestion.question);
    
    optionsElement.innerHTML = '';
    const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    shuffleArray(options);

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = decodeHTML(option);
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(option, currentQuestion.correct_answer));
        optionsElement.appendChild(button);
    });
}

// Check answer
function selectAnswer(selected, correct) {
    if (selected === correct) {
        score++;
    }
    nextBtn.click();
}

// End the quiz
function endQuiz() {
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    scoreElement.textContent = `${userName}, your score is: ${score} / ${totalQuestions}`;
}

// Shuffle options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
