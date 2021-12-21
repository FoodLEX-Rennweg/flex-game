const COLS = 10;
const ROWS = 20;
let board = [];
const foods = ['banana', 'apple'];

let tickInterval;
let renderInterval;

let tickCount;

let score;

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newFood() {
    let food = new Food(1);
    let rnd = Math.floor(Math.random() * COLS);
    board[0][rnd] = food;
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
    // function shiftSpace(y, x, row) {
    //     let food = board[y][x];
    //     let newX = x + offsetX;
    //     let newY = y + offsetY;
    //     if (food) {
    //         if(newX < row.length && newX >= 0) {
    //             board[y][x] = 0;
    //         }
    //         if (newX < row.length && newX >= 0 && newY < board.length && newY >= 0) {
    //             board[newY][newX] = food;
    //         }
    //         if (newY >= board.length) {
    //             score+= 50;
    //             console.log(score);
    //         }
    //     }
    // }
    //
    // for (let y = board.length - 1; y >= 0; y--) {
    //     const row = board[y];
    //     if (offsetX > 0) {
    //         for (let x = row.length - 1; x >= 0; x--) {
    //             shiftSpace(y, x, row);
    //         }
    //     } else {
    //         for (let x = 0; x < row.length; x++) {
    //             shiftSpace(y, x, row);
    //         }
    //     }
    // }


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

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    shiftBoard(0, 1);
    if (tickCount % 5 === 0) {
        newFood();
    }
    tickCount++;
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
                        document.getElementById('playbutton').disabled = false;
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function playButtonClicked() {
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() {
    clearAllIntervals();
    tickCount = 0;
    score = 0;
    renderInterval = setInterval(render, 30);
    initBoard();

    tickInterval = setInterval(tick, 400);
}

function clearAllIntervals() {
    clearInterval(renderInterval);
    clearInterval(tickInterval);
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