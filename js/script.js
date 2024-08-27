let mainScreen = document.querySelector('.main-screen');
let startScreen = document.querySelector('.start-screen');
let question = document.querySelector('.question');
let answers = document.querySelector('.answers');
let answerButtons = document.querySelectorAll('.answer-btn');
let statisticsDisplay = document.querySelector('.statistics');
let timerDisplay = document.querySelector('.timer');

let correctAnswersCount = 0;
let totalAnswersCount = 0;
let countdownInterval;
let questionLimit = 10; 

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomSign() {
    const signs = ['+', '-', '*', '/'];
    return signs[randint(0, signs.length - 1)];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

class Question {
    constructor() {
        this.a = randint(1, 30);
        this.b = randint(1, 30);
        this.sign = getRandomSign();
        this.question = `${this.a} ${this.sign} ${this.b}`;

        if (this.sign === '+') {
            this.correct = this.a + this.b;
        } else if (this.sign === '-') {
            this.correct = this.a - this.b;
        } else if (this.sign === '*') {
            this.correct = this.a * this.b;
        } else {
            this.b = this.b === 0 ? 1 : this.b;
            this.correct = Math.round(this.a / this.b);
        }

        this.answers = new Set([this.correct]);
        while (this.answers.size < 4) {
            this.answers.add(randint(this.correct - 15, this.correct + 15));
        }
        this.answers = Array.from(this.answers);
        shuffle(this.answers);
    }

    display() {
        question.innerHTML = this.question;
        for (let i = 0; i < this.answers.length; i++) {
            answerButtons[i].innerHTML = this.answers[i];
            answerButtons[i].classList.remove('correct', 'incorrect');
        }
        startCountdown();
    }
}

let currentQuestion = new Question();

function startQuiz() {
    startScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    currentQuestion.display();
}

answerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        totalAnswersCount++;
        answerButtons.forEach(btn => btn.classList.remove('correct', 'incorrect'));

        if (button.innerHTML == currentQuestion.correct) {
            correctAnswersCount++;
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }

        clearInterval(countdownInterval);

        if (totalAnswersCount < questionLimit) {
            setTimeout(() => {
                currentQuestion = new Question();
                currentQuestion.display();
            }, 1000);
        } else {
            endQuiz();
        }
    });
});

document.getElementById('skip-btn').addEventListener('click', function () {
    clearInterval(countdownInterval);
    if (totalAnswersCount < questionLimit) {
        currentQuestion = new Question();
        currentQuestion.display();
    } else {
        endQuiz();
    }
});

function displayStatistics() {
    let accuracy = Math.round(correctAnswersCount * 100 / totalAnswersCount);
    let message = `Правильно: ${correctAnswersCount}\nУсього: ${totalAnswersCount}\nТочність: ${accuracy}%`;
    statisticsDisplay.innerHTML = `Ви дали ${correctAnswersCount} правильних відповідей із ${totalAnswersCount}. Точність - ${accuracy}%`;
}

function endQuiz() {
    clearInterval(countdownInterval);
    displayStatistics();
    mainScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function startCountdown() {
    let countdownTime = 10;
    timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            if (totalAnswersCount < questionLimit) {
                currentQuestion = new Question();
                currentQuestion.display();
            } else {
                endQuiz();
            }
        }
    }, 1000);
}

document.getElementById('start-btn').addEventListener('click', startQuiz);