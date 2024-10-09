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

const handleAnswerOne = (randomQuestion) => {
    if (randomQuestion.correct_answer === 'False') {
        questionCount++;
        startingPoint.innerHTML = `
        <h2>Wrong Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    } else {
        questionCount++;
        winCount++;
        startingPoint.innerHTML = `
        <h2>Right Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    }

    gameCount.innerHTML = `
    ${winCount} / ${questionCount}
    `;
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', startGame);
}

const handleAnswerTwo = (randomQuestion) => {
    if (randomQuestion.incorrect_answers[0] === 'False') {
        questionCount++;
        startingPoint.innerHTML = `
        <h2>Wrong Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    } else {
        questionCount++;
        winCount++;
        startingPoint.innerHTML = `
        <h2>Right Answer!</h2>
        <button id="next-btn" class="btn">Next Question</button>
        `;
    }

    gameCount.innerHTML = `
    ${winCount} / ${questionCount}
    `;
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', startGame);
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
    <button id="answer-one" class="btn">${randomQuestion.correct_answer}</button>
    <button id="answer-two" class="btn">${randomQuestion.incorrect_answers[0]}</button>
    `;
    }
    document.getElementById('answer-one').addEventListener('click', () => handleAnswerOne(randomQuestion));
    document.getElementById('answer-two').addEventListener('click', () => handleAnswerTwo(randomQuestion));

   
}

startBtn.addEventListener('click', startGame);

