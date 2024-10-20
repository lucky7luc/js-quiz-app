const startBtn = document.getElementById('start-btn');
const startingPoint = document.getElementById('starting-point');
//const quizUrl = 'https://opentdb.com/api.php?amount=14&category=9&difficulty=medium&type=boolean';
const quizUrl = 'https://opentdb.com/api.php?amount=50&type=multiple';
const gameCount = document.getElementById('count');
let questionCount = 0;
let winCount = 0;

const fetchData = async () => {
    try {
        const res = await fetch(quizUrl);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error('Error fetchting the data: ', e);
        return null;
    }
}

const getRandomQuestion = (data) => {
   if (data && data.results.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const randomQuestion = data.results[randomIndex];
    return randomQuestion;
    } else {
        console.error('No question available.');
        return null;
    }
}

const shuffleAnswers = (answers) => {
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
}

const resetGame = () => {
    questionCount = 0;
    winCount = 0;

    startingPoint.innerHTML = `
    <span id="count">${winCount} / ${questionCount}</span>
        <h2>!?QUIZ?!</h2>
        <button id="start-btn" class="btn">start</button>
        `;

    
    const newStartBtn = document.getElementById('start-btn');
    newStartBtn.addEventListener('click', startGame);        
}

const handleAnswer = (randomQuestion, userAnswer) => {
    questionCount++;

    if (randomQuestion.correct_answer === userAnswer) {
        winCount++;
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>Right Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    } else {
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>Wrong Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    }


    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', startGame);

    if (questionCount >= 6 || winCount >= 3) {
        startingPoint.innerHTML = `
        <span id="count">${winCount} / ${questionCount}</span>
        <h2>${winCount >= 3 ? 'You Win!' : 'You Loose!'}</h2>
        <button id="reset-btn" class="btn">Reset the Game</button>
        `;
    }
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', resetGame);
}


const startGame = async () => {
    const quizData = await fetchData();
    const randomQuestion = getRandomQuestion(quizData);

    let answers = [...randomQuestion.incorrect_answers];
        answers.push(randomQuestion.correct_answer);

        answers = shuffleAnswers(answers);

    if (randomQuestion) {
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
    }
    
    document.getElementById('answer-one').addEventListener('click', () => handleAnswer(randomQuestion, answers[0]));
    document.getElementById('answer-two').addEventListener('click', () => handleAnswer(randomQuestion, answers[0]));
    document.getElementById('answer-three').addEventListener('click', () => handleAnswer(randomQuestion, answers[0]));
    document.getElementById('answer-four').addEventListener('click', () => handleAnswer(randomQuestion, answers[0]));
}

startBtn.addEventListener('click', startGame);

