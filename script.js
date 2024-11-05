const startBtn = document.getElementById('start-btn');
const startingPoint = document.getElementById('starting-point');
const quizUrl = 'https://opentdb.com/api.php?amount=50&type=multiple';
const gameCount = document.getElementById('count');
const difficultyLevel = document.getElementById('difficulty-dropdown');
let questionCount = 0;
let winCount = 0;
let quizData = null; // to save the questions local

const fetchData = async () => {
    try {
        const res = await fetch(quizUrl);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetching the data:', e);
        return null;
    }
};

const getRandomQuestion = () => {
    if (!quizData || quizData.length === 0) {
        console.error('No questions available.');
        return null;
    }

    let filteredQuestions;
    if (difficultyLevel.value === 'easy') {
        filteredQuestions = quizData.filter(question => question.difficulty === 'easy');
    } else if (difficultyLevel.value === 'medium') {
        filteredQuestions = quizData.filter(question => question.difficulty === 'medium');
    } else if (difficultyLevel.value === 'hard') {
        filteredQuestions = quizData.filter(question => question.difficulty === 'hard');
    } else {
        filteredQuestions = quizData;
    }

    if (filteredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        const randomQuestion = filteredQuestions[randomIndex];
        // to remove the current question, so you it does not appear twice
        quizData = quizData.filter(question => question !== randomQuestion);
        return randomQuestion;
    } else {
        console.error('No questions available for selected difficulty.');
        return null;
    }
};

const shuffleAnswers = (answers) => {
    for (let i = answers.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
};

const resetGame = () => {
    questionCount = 0;
    winCount = 0;
    quizData = null;

    startingPoint.innerHTML = `
    <span id="count">${winCount} / ${questionCount}</span>
        <h2>!?QUIZ?!</h2>
        <button id="start-btn" class="btn">start</button>
    `;

    document.getElementById('start-btn').addEventListener('click', startGame);
};

const handleAnswer = (randomQuestion, userAnswer) => {
    questionCount++;

    if (randomQuestion.correct_answer === userAnswer) {
        winCount++;
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>Right Answer!</h2>
        <p>Your answer: <span class="bold">${randomQuestion.correct_answer}</span></p>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    } else {
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>Wrong Answer!</h2>
        <p>Correct answer: <span class="bold">${randomQuestion.correct_answer}</span></p>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    }

    if (questionCount >= 6 || winCount >= 3) {
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>${winCount >= 3 ? 'You Win!' : 'You Lose!'}</h2>
        <button id="reset-btn" class="btn">Reset the Game</button>
        `;
        document.getElementById('reset-btn').addEventListener('click', resetGame);
        return;
    }

    document.getElementById('next-btn').addEventListener('click', startGame);
};

const startGame = async () => {
    if (!quizData) {
        startingPoint.innerHTML = `<div class="spinner"></div>`;

        const data = await fetchData();
        if (!data) {
            startingPoint.innerHTML = `<h2>Error loading quiz. Please try again.</h2>`;
            return;
        }
        quizData = data.results; // is saving the loaded questions
    }

    const randomQuestion = getRandomQuestion();
    if (!randomQuestion) {
        startingPoint.innerHTML = `<h2>No question available. Please try again.</h2>`;
        return;
    }

    let answers = [...randomQuestion.incorrect_answers, randomQuestion.correct_answer];
    answers = shuffleAnswers(answers);

    startingPoint.innerHTML = `
    <span id="count">${winCount} / ${questionCount}</span>
    <span id="difficulty">${randomQuestion.difficulty}</span>
    <span id="category">${randomQuestion.category}</span>
    <h3>${randomQuestion.question}</h3>
    <button id="answer-one" class="btn">${answers[0]}</button>
    <button id="answer-two" class="btn">${answers[1]}</button>
    <button id="answer-three" class="btn">${answers[2]}</button>
    <button id="answer-four" class="btn">${answers[3]}</button>
    `;

    document.getElementById('answer-one').addEventListener('click', () => handleAnswer(randomQuestion, answers[0]));
    document.getElementById('answer-two').addEventListener('click', () => handleAnswer(randomQuestion, answers[1]));
    document.getElementById('answer-three').addEventListener('click', () => handleAnswer(randomQuestion, answers[2]));
    document.getElementById('answer-four').addEventListener('click', () => handleAnswer(randomQuestion, answers[3]));
};

startBtn.addEventListener('click', startGame);