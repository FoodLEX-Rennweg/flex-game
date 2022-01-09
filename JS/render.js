let tetrisCanvas = document.getElementById('tetris-canvas');
let basketCanvas = document.getElementById('basket-canvas');

const TETRIS_WIDTH = tetrisCanvas.width
const TETRIS_HEIGHT = tetrisCanvas.height;
const BASKETS_HEIGHT = basketCanvas.height; // TODO: unify (get width and height from element)
const BOX_WIDTH = TETRIS_WIDTH / COLS
const BOX_HEIGHT = TETRIS_HEIGHT / ROWS;

const FOOD_WIDTH = BOX_WIDTH * 0.7;
const FOOD_HEIGHT = BOX_HEIGHT * 0.7;

const FLAG_WIDTH = BOX_WIDTH / 2;
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
    tetrisCtx.drawImage(foodIcons[food.foodId - 1], BOX_WIDTH * x + FOOD_WIDTH / 4, BOX_HEIGHT * y, BOX_WIDTH * 0.7, BOX_WIDTH * 0.7);
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
    let flagImg;
    switch (basket.charAt(0)) {
        case 'R':
            flagImg = flagImages[0];
            break;
        case 'N':
            flagImg = globeImg;
            basketCtx.filter = 'hue-rotate(200deg) brightness(70%) saturate(50%)';
            break;
        case 'C' :
            let basketNum = Number(basket.charAt(1));
            flagImg = flagImages[currentCountries[basketNum - 1] - 1];
            basketCtx.filter = 'saturate(30%) brightness(120%)';
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
        basketCtx.drawImage(img, BOX_WIDTH * (index - length + i), 0, BOX_WIDTH, BASKETS_HEIGHT);
    }

    basketCtx.filter = 'none';
    basketCtx.drawImage(flagImg, BOX_WIDTH * (index - length) + ((length - 1) * (BOX_WIDTH / 2)) + FLAG_WIDTH / 2, (BASKETS_HEIGHT / 2 - FLAG_HEIGHT / 2), BOX_WIDTH / 2, BASKETS_HEIGHT / 2);


}