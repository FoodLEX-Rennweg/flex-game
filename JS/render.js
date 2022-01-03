let tetrisCanvas = document.getElementById('tetris-canvas');
let basketCanvas = document.getElementById('basket-canvas');

const TETRIS_WIDTH = 150, TETRIS_HEIGHT = 300; // TODO: unify (get width and height from element)
const BASKETS_HEIGHT = 30; // TODO: unify (get width and height from element)
const FOOD_WIDTH = TETRIS_WIDTH / COLS
const FOOD_HEIGHT = TETRIS_HEIGHT / ROWS;

let tetrisCtx = tetrisCanvas.getContext('2d');
let basketCtx = basketCanvas.getContext('2d');

// draw a single square at (x, y)
function drawBlock(x, y) {
    tetrisCtx.fillRect(FOOD_WIDTH * x, FOOD_HEIGHT * y, FOOD_WIDTH, FOOD_HEIGHT);
}

// draws the board and the moving shape
function renderTetris() {
    tetrisCtx.clearRect(0, 0, TETRIS_WIDTH, TETRIS_HEIGHT);

    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            if (board[y][x]) {
                tetrisCtx.fillStyle = 'green';
                drawBlock(x, y);
            }
        }
    }
}

function renderBaskets() {
    let currentBasket = baskets[0];
    let currentBasketLength = 0;
    baskets.forEach((b, i) => {
        if (b !== currentBasket) {
            drawBasket(currentBasket, currentBasketLength, i);
            currentBasket = b;
            currentBasketLength = 1;
        } else {
            currentBasketLength++;
        }

    });
    drawBasket(currentBasket, currentBasketLength, baskets.length);
}

function drawBasket(basket, length, index) {
    gap = 5;

    switch (basket.charAt(0)) {
        case 'R':
            basketCtx.fillStyle = 'red';
            break;
        case 'N':
            basketCtx.fillStyle = 'blue';
            break;
        case 'C' :
            basketCtx.fillStyle = 'grey';
            break;
        default:
            basketCtx.fillStyle = 'magenta';
            break;
    }

    basketCtx.fillRect(FOOD_WIDTH * (index - length), 0, FOOD_WIDTH * length, BASKETS_HEIGHT);
}