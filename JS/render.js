let canvas = document.getElementById('game-canvas');

const CANVAS_WIDTH = 150, CANVAS_HEIGHT = 300; // TODO: unify (get width and height from element)
const FOOD_WIDTH = CANVAS_WIDTH / COLS, BLOCK_H = CANVAS_HEIGHT / ROWS;

let ctx = canvas.getContext( '2d' );

// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( FOOD_WIDTH * x, BLOCK_H * y, FOOD_WIDTH - 1 , BLOCK_H - 1 );
}

// draws the board and the moving shape
function render() {
    ctx.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    ctx.strokeStyle = 'black';
    for ( let x = 0; x < COLS; ++x ) {
        for ( let y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = 'green';
                drawBlock( x, y );
            }
        }
    }
}