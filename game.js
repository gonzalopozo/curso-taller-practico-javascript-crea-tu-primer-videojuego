const canvas = document.querySelector("#game");
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

let canvasSize;
let elementsSize;

const playerPosition = {
    x: undefined,
    y: undefined
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize / 10) - 1;

    startGame();
}

function startGame() {
    console.log({ canvasSize, elementsSize });

    // game.font = elementsSize + "px Verdana";
    game.font = `${elementsSize}px Verdana`;
    game.textAlign = "end";

    const map = maps[1];
    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    console.log({ map, mapRows, mapRowsCols });

    game.clearRect(0, 0, canvasSize, canvasSize);
    
    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1.25);
            const posY = elementsSize * (rowI + 0.95);

            if (col == 'O') {

                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;

                    console.log({playerPosition});
                }
                
            }

            game.fillText(emoji, posX, posY);

        })
    });

    movePlayer();   
}

function movePlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

// 1º Forma de la que se hizo.
// 
// windows.addEventListener('keydown', moveByKeys);
// 
// function moveByKeys(event) {
//     if (event.key == 'ArrowUp') moveUp();
//     else if (event.key == 'ArrowLeft') moveLeft();
//     else if (event.key == 'ArrowRight') moveRight();
//     else if (event.key == 'ArrowDown') moveDown();
// }

// 2º Forma y más optima
window.addEventListener('keydown', (e) => {
    const tecla = e.key;

    const moveFunctions = {
        ArrowUp: moveUp,
        ArrowLeft: moveLeft,
        ArrowRight: moveRight,
        ArrowDown: moveDown
    }

    const moveFunction = moveFunctions[tecla];

    if (moveFunction) {
        moveFunction();
    }
});

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveUp() {
    console.log("¡Me quiero mover hacia arriba!");
    if ((playerPosition.y - elementsSize) > 0) {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log("¡Me quiero mover hacia la izquierda!");
    if ((playerPosition.x - elementsSize) > elementsSize) {
        playerPosition.x -= elementsSize;
        startGame();
    }

}

function moveRight() {
    console.log("¡Me quiero mover hacia la derecha!");
    if ((playerPosition.x + elementsSize) <= (elementsSize * (9 + 1.25))) {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log("¡Me quiero mover hacia abajo!");
    if ((playerPosition.y + elementsSize) <= canvasSize) {
        playerPosition.y += elementsSize;
        startGame();
    }
}