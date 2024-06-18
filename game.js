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
const giftPosition = {
    x: undefined,
    y: undefined
}

function Bomb(posX, posY) {
    this.posX = posX;
    this.posY = posY;
}

const bombsPositions = [];

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

    const map = maps[0];
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
                
            } else if (col == 'I') {

                giftPosition.x = posX;
                giftPosition.y = posY;

            } else if (col == 'X') {

                bombsPositions.push(new Bomb(posX, posY));

            }

            game.fillText(emoji, posX, posY);

        })
    });

    movePlayer();   
}

function movePlayer() {
    // 1º Forma de la que se hizo.
    // const realPlayerPosX = Math.floor(playerPosition.x);
    // const realPlayerPosY = Math.floor(playerPosition.y);
    // const realGiftPosX = Math.floor(giftPosition.x);
    // const realGiftPosY = Math.floor(giftPosition.y);


    // if ((realPlayerPosX === realGiftPosX) && (realPlayerPosY === realGiftPosY)) {
    //     console.log("¡GANO ESE WUEON!");
    // }

    // 2º Forma de la que se hizo, en teoria más optima.
    const collisionX = Math.floor(playerPosition.x) === Math.floor(giftPosition.x);
    const collisionY = Math.floor(playerPosition.y) === Math.floor(giftPosition.y);
    const collision = collisionX && collisionY;
    const collisionWithBomb = playerCollisionWithBomb(playerPosition.x, playerPosition.y);

    if (collision) {
        console.log("¡GANO ESE WUEON!");
    } else if (collisionWithBomb) {
        console.log("WUEON, BOMBA CABRON");
    }



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

function playerCollisionWithBomb(playerPosX, playerPosY) {
    let collision = false;

    bombsPositions.forEach(element => {
        
        const collisionX = Math.floor(playerPosX) === Math.floor(element.posX);
        const collisionY = Math.floor(playerPosY) === Math.floor(element.posY);

        let a = Math.floor(playerPosX);
        let b = Math.floor(element.posX);
        let c = Math.floor(playerPosY);
        let d = Math.floor(element.posY);

        collision = collisionX && collisionY;

        if (collision) {
            console.log({ a, b, c, d, collisionX, collisionY, collision });
            console.log("llego cabron");
            return collision;
        }

        
    });

    return collision;
}