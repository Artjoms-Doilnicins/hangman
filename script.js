import { words } from './words.js';

const wordEl = document.getElementById('word');
const wrongLettersContainerEl = document.getElementById('wrong-letters');
const playAgainBtnEl = document.getElementById('play-button');
const popupEl = document.getElementById('popup-container');
const notificationEl = document.getElementById('notification-container');
const finalMessageEl = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');
const correctWordsScoreEl = document.querySelector('.correct-words');
const wrongWordsScoreEl = document.querySelector('.wrong-words');

const score = JSON.parse(localStorage.getItem('score')) || {
    correct: 0,
    wrong: 0,
};
let word = '';
let gameOver = false;
const correctGuesses = [];
const wrongGuesses = [];

const saveToLS = () => {
    localStorage.setItem('score', JSON.stringify(score));
};

const updateScoreFromLS = () => {
    correctWordsScoreEl.textContent = `${score.correct} correct words`;
    wrongWordsScoreEl.textContent = `${score.wrong} wrong words`;
};
updateScoreFromLS();

const generateLetters = () => {
    for (let i = 0; i < word.length; i++) {
        const newLetterEl = document.createElement('span');
        newLetterEl.classList.add('letter');
        wordEl.appendChild(newLetterEl);
    }
};

const getRandomWord = async () => {
    const randNum = Math.floor(Math.random() * words.length);
    word = words[randNum];
    console.log('Correct word:', word);
    console.log('Try to guess! Do not cheat :)');
    generateLetters();
};
getRandomWord();

const playAgain = () => {
    window.location.reload();
    notificationEl.classList.remove('show');
};

const userGuess = (keyPressed) => {
    if (gameOver) return;
    const nodeLetters = wordEl.children;

    // Correct guess logic
    if (word.includes(keyPressed)) {
        const matchedIndexes = [];

        // Check if correct guess has more than one of the same letter
        for (let i = 0; i < word.length; i++) {
            if (word[i] === keyPressed) {
                matchedIndexes.push(i);
            }
        }
        matchedIndexes.forEach((index) => {
            nodeLetters[index].textContent = keyPressed;
        });

        if (!correctGuesses.includes(keyPressed)) {
            correctGuesses.push(keyPressed);
            notificationEl.classList.remove('show');
        } else {
            notificationEl.classList.add('show');
        }

        const uniqueLetters = [...new Set(word.split(''))];
        if (correctGuesses.length === uniqueLetters.length) {
            popupEl.style.display = 'block';
            finalMessageEl.textContent = `You win 🥳🤗 Nicely done!`;
            score.correct++;
            updateScoreFromLS();
            saveToLS();
            gameOver = true;
        }
        // Wrong guess logic
    } else {
        if (wrongGuesses.length < 1) {
            const message = document.createElement('p');
            message.textContent = 'Wrong letters: ';
            wrongLettersContainerEl.appendChild(message);
        }

        if (!wrongGuesses.includes(keyPressed)) {
            wrongGuesses.push(keyPressed);
            const wrongLetterEl = document.createElement('p');
            wrongLetterEl.textContent = keyPressed;
            wrongLettersContainerEl.appendChild(wrongLetterEl);
            notificationEl.classList.remove('show');

            figureParts.forEach((part, index) => {
                if (index < wrongGuesses.length) {
                    part.style.display = 'block';
                } else {
                    part.style.display = 'none';
                }
            });

            if (wrongGuesses.length > figureParts.length - 1) {
                popupEl.style.display = 'block';
                finalMessageEl.textContent = `You lose 😭😔\nCorrect word was: ${word}`;
                score.wrong++;
                updateScoreFromLS();
                saveToLS();
                gameOver = true;
                playAgainBtnEl.addEventListener('click', playAgain);
                document.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        playAgain();
                    }
                });
            }
        } else {
            notificationEl.classList.add('show');
        }
    }
};

playAgainBtnEl.addEventListener('click', playAgain);
document.addEventListener('keypress', (e) => {
    if (popupEl.style.display === 'block' && e.key === 'Enter') {
        playAgain();
    }
});

document.addEventListener('keydown', (event) => {
    const isAlphabetLetter = (char) => {
        return /^[a-zA-Z]$/.test(char);
    };

    const keyPressed = event.key;
    if (isAlphabetLetter(keyPressed)) {
        userGuess(keyPressed);
    }
});
