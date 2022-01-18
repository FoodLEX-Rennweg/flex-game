const COLS = 7;
const ROWS = 16;

const DEFAULT_TICK_DELAY = 400;
const SPEED_INCREASE_MILLIS = 30;
const MIN_TICK_DELAY = 150;
const GAME_DURATION = 20;

let speedUpFlag;

let tickDelay;

let board = [];
let currentCountries = [];

const seasonId = 1;
let tickInterval;
let renderInterval;
let speedUpInterval;
let timerInterval;

let tickCount;

let fallingFoodNames = [];
const foodNameTxt = document.getElementById('food-name-span');


let score;
const scoreTxt = document.getElementById('score-txt');

let wrongItems = {};
let penaltyCo2 = 0;

// creates a new 4x4 shape in global variable 'current'
function updateFoodNameTxt() {
    foodNameTxt.innerText = fallingFoodNames[fallingFoodNames.length - 1];
}

// 4x4 so as to cover the size when the shape is rotated
function newFood() {
    let food = new Food(Math.floor(Math.random() * (foodNames.length) + 1));
    let rnd = Math.floor(Math.random() * COLS);
    board[0][rnd] = food;

    fallingFoodNames.unshift(foodNames[food.foodId - 1]);
    updateFoodNameTxt()
}

// clears the board
function initBoard() {
    for (let y = 0; y < ROWS; ++y) {
        board[y] = [];
        for (let x = 0; x < COLS; ++x) {
            board[y][x] = 0;
        }
    }
}

function shiftBoard(offsetX = 0, offsetY = 0) {

    if (offsetY > 0) {
        board.unshift(Array(COLS).fill(0));
        board.pop();
    } else if (offsetY < 0) {
        board.push(Array(COLS).fill(0))
        board.shift();
    }

    if (offsetX > 0) {
        board.forEach((row, index) => {
            board[index].unshift(0);
            if (row[row.length - 1]) {
                board[index][row.length - 2] = row[row.length - 1];
            }
            board[index].pop();
        });
    } else if (offsetX < 0) {
        board.forEach((row, index) => {
            board[index].push(0);
            if (row[0]) {
                board[index][1] = row[0];
            }
            board[index].shift();
        });
    }
}

function updateScoreTxt() {
    scoreTxt.innerText = score;
}

function evaluateLastRow() {
    function addWrongItem(foodId, co2 = 0) {
        if (wrongItems[foodId]) {
            wrongItems[foodId]++;
        } else {
            wrongItems[foodId] = 1;
        }
        penaltyCo2 += co2
    }

    board[board.length - 1].forEach((e, index) => {
            if (e) {
                const usedBasket = baskets[index];
                const regioEntry = foodRegionalities[e.foodId - 1];

                const regionalSeason = regioEntry['R']
                const country = regioEntry['NR']
                const co2Usages = regioEntry['CO2']

                switch (usedBasket.charAt(0)) {
                    case 'R':
                        if (regionalSeason === seasonId) {
                            score += 50;
                        } else {
                            addWrongItem(e.foodId);
                        }
                        break;
                    case 'C':
                        let basketNum = Number(usedBasket.charAt(1));
                        if (currentCountries[basketNum - 1] === country) {
                            score += 150;
                        }
                        break;
                    case 'N':
                        if (regionalSeason !== seasonId) {
                            score += 50;
                        } else {
                            addWrongItem(e.foodId, co2Usages[1]);
                        }
                        break;
                }
                fallingFoodNames.pop();

                updateFoodNameTxt()
                updateScoreTxt();
            }
        }
    )
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    shiftBoard(0, 1);
    if (tickCount % 8 === 0) {
        newFood();
    }
    tickCount++;
    evaluateLastRow();
    renderBaskets();

    if (speedUpFlag) {
        clearInterval(tickInterval);
        tickInterval = setInterval(tick, tickDelay);
    }
}

function keyPress(key) {
    switch (key) {
        case 'left':
            shiftBoard(-1);
            break;
        case 'right':
            shiftBoard(1);
            break;
        case 'down':
            tick();
            break;
        case 'rotate':
            shiftBoard(0, -1);
            break;
        case 'drop':
            while (valid(0, 1)) {
                ++currentY;
            }
            tick();
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid(offsetX, offsetY, newCurrent) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (newCurrent[y][x]) {
                if (typeof board[y + offsetY] == 'undefined'
                    || typeof board[y + offsetY][x + offsetX] == 'undefined'
                    || board[y + offsetY][x + offsetX]
                    || x + offsetX < 0
                    || y + offsetY >= ROWS
                    || x + offsetX >= COLS) {
                    if (offsetY == 1 && freezed) {
                        lose = true; // lose if the current shape is settled at the top most row
                        document.getElementById('play-btn').disabled = false;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function startGame() {
    newGame();
    document.getElementById("play-btn").disabled = true;
}

function retryGame() {
    currentCountries = getRandomizedCountries();
    renderBaskets();
    startGame();
    updateScoreTxt();
}

function stopGame() {
    clearAllIntervals();
}

function generateRandomSeason() {
    const seasonImg = document.getElementById("season-img");
    let rnd = Math.floor(Math.random() * 4 + 1)
    seasonImg.src = '../media/seasons/' + rnd + '.png'

    seasonImg.style.display = 'block';
}

function increaseSpeed() {
    if (tickDelay - SPEED_INCREASE_MILLIS > MIN_TICK_DELAY) {
        tickDelay -= SPEED_INCREASE_MILLIS;
    } else {
        tickDelay = MIN_TICK_DELAY;
        clearInterval(speedUpInterval);
    }
    speedUpFlag = true;
}

function newGame() {
    generateRandomSeason();

    tickDelay = DEFAULT_TICK_DELAY;
    clearAllIntervals();
    tickCount = 0;
    score = 0;
    fallingFoodNames = [];
    initBoard();

    renderInterval = setInterval(renderTetris, 30);
    tickInterval = setInterval(tick, tickDelay);
    speedUpInterval = setInterval(increaseSpeed, 10000);


    const timerSpan = document.getElementById("timer-span");
    startTimer(GAME_DURATION, timerSpan);
}

function clearAllIntervals() {
    clearInterval(renderInterval);
    clearInterval(tickInterval);
    clearInterval(speedUpInterval);
    clearInterval(timerInterval);
}

function getRandomizedCountries() {
    let result = [];

    for (let i = 0; i < 3; i++) {
        let n = Math.floor(Math.random() * (flagNames.length - 1) + 2)
        if (!result.includes(n)) {
            result[i] = n;
        } else {
            i--;
        }
    }
    return result;
}

function showResults() {
    let game = document.getElementsByClassName("container")[0];
    let results = document.getElementsByClassName("results-container")[0];
    results.style.visibility = 'visible';
    results.style.opacity = '1';
    game.style.opacity = '0';

    for (let key in wrongItems) {
        let wrongList = document.getElementById('wrong-list');
        let listEntry = document.createElement('div');
        listEntry.className = 'wrong-item';
        listEntry.innerHTML =
            `<img src="../media/food-icons/${key}.png">
             <span class="wrong-item-text">x ${wrongItems[key]}</span>`
        wrongList.appendChild(listEntry);
    }

    document.getElementById('co2-span').innerText = penaltyCo2;
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    tickTimer()

    timerInterval = setInterval(tickTimer, 1000);

    function tickTimer() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            stopGame();
            showResults();
        }
    }
}

function printBoard() {
    let result = ""
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                result += " " + (board[y][x].toString()) + " ";
            } else {
                result += " . "
            }
            result += ", "
        }
        result += "\n";
    }
    console.log(result)
}