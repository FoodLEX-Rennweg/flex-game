document.addEventListener("keydown", keyDown, false);

function keyDown(e) {
    let keys = {
        65: 'left',
        37: 'left',
        39: 'right',
        68: 'right',
        40: 'down',
        83: 'down',
        38: 'rotate',
        87: 'rotate',
        32: 'drop',
        67: 'end',
    };
    if (typeof keys[e.keyCode] != 'undefined') {
        keyPress(keys[e.keyCode]);
        renderTetris();
    }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            keyPress('left');
        } else {
            keyPress('right');
        }
    } else {
        if (yDiff < 0) {
            keyPress('down');
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}
