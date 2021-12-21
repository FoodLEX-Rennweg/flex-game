let canvas = document.getElementById('tetris-canvas');

const CANVAS_WIDTH = 150, CANVAS_HEIGHT = 300; // TODO: unify (get width and height from element)
const FOOD_WIDTH = CANVAS_WIDTH / COLS
const FOOD_HEIGHT = CANVAS_HEIGHT / ROWS;

let ctx = canvas.getContext('2d');

// draw a single square at (x, y)
function drawBlock(x, y) {
    ctx.fillRect(FOOD_WIDTH * x, FOOD_HEIGHT * y, FOOD_WIDTH, FOOD_HEIGHT);
}

// draws the board and the moving shape
function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let x = 0; x < COLS; ++x) {
        for (let y = 0; y < ROWS; ++y) {
            if (board[y][x]) {
                ctx.fillStyle = 'green';
                drawBlock(x, y);
            }
        }
    }
}