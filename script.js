const startBtn = document.getElementById('start-btn');
const startingPoint = document.getElementById('starting-point');
const quizUrl = 'https://opentdb.com/api.php?amount=14&category=9&difficulty=medium&type=boolean';
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

const resetGame = () => {
    questionCount = 0;
    winCount = 0;

    startingPoint.innerHTML = `
        <h2>!?QUIZ?!</h2>
        <button id="start-btn" class="btn">start</button>
        `;

    gameCount.innerHTML = `${winCount} / ${questionCount}`;
    
    const newStartBtn = document.getElementById('start-btn');
    newStartBtn.addEventListener('click', startGame);        
}

const handleAnswer = (randomQuestion, userAnswer) => {
    questionCount++;

    if (randomQuestion.correct_answer === userAnswer) {
        winCount++;
        startingPoint.innerHTML = `
        <h2>Right Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    } else {
        startingPoint.innerHTML = `
        <h2>Wrong Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    }

    gameCount.innerHTML = `${winCount} / ${questionCount}`;

    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', startGame);

    if (questionCount >= 6 || winCount >= 3) {
        startingPoint.innerHTML = `
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

    gameCount.innerHTML = `
    ${winCount} / ${questionCount}
    `;

    if (randomQuestion) {
    startingPoint.innerHTML = `
    <span id="category">${randomQuestion.category}</span>
    <h2>${randomQuestion.question}</h2>
    <button id="answer-true" class="btn">True</button>
    <button id="answer-false" class="btn">False</button>
    `;
    }
    
    document.getElementById('answer-true').addEventListener('click', () => handleAnswer(randomQuestion, 'True'));
    document.getElementById('answer-false').addEventListener('click', () => handleAnswer(randomQuestion, 'False'));
}

startBtn.addEventListener('click', startGame);

