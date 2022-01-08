let tetrisCanvas = document.getElementById('tetris-canvas');
let basketCanvas = document.getElementById('basket-canvas');

const TETRIS_WIDTH = tetrisCanvas.width
const TETRIS_HEIGHT = tetrisCanvas.height;
const BASKETS_HEIGHT = basketCanvas.height; // TODO: unify (get width and height from element)
const FOOD_WIDTH = TETRIS_WIDTH / COLS
const FOOD_HEIGHT = TETRIS_HEIGHT / ROWS;

const FLAG_WIDTH = FOOD_WIDTH / 2 ;
const FLAG_HEIGHT = BASKETS_HEIGHT / 2;

let tetrisCtx = tetrisCanvas.getContext('2d');
let basketCtx = basketCanvas.getContext('2d');


function renderTetris() {
    tetrisCtx.clearRect(0, 0, TETRIS_WIDTH, TETRIS_HEIGHT);

    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            if (board[y][x]) {
                tetrisCtx.fillStyle = 'green';
                drawFood(x, y, board[y][x]);
            }
        }
    }
}

// draws the board and the moving shape
// draw a single square at (x, y)
function drawFood(x, y, food) {
    tetrisCtx.drawImage(foodIcons[food.foodId - 1], FOOD_WIDTH * x, FOOD_HEIGHT * y, FOOD_WIDTH, FOOD_HEIGHT);
}

function renderBaskets() {
    basketCtx.clearRect(0, 0, TETRIS_WIDTH, BASKETS_HEIGHT);

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


    for (let i = 0; i < length; i++) {
        let img;
        if (length <= 1) {
            img = basketImages[3]
        } else if (i === 0) {
            img = basketImages[0];
        } else if (i === length - 1) {
            img = basketImages[2];
        } else {
            img = basketImages[1];
        }
        basketCtx.drawImage(img, FOOD_WIDTH * (index - length + i), 0, FOOD_WIDTH, BASKETS_HEIGHT);
    }

    basketCtx.drawImage(flagImages[1], FOOD_WIDTH * (index - length) + ((length - 1) * (FOOD_WIDTH / 2)) + FLAG_WIDTH/2, (BASKETS_HEIGHT/2 - FLAG_HEIGHT / 2), FOOD_WIDTH/2, BASKETS_HEIGHT/2);

}