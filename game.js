const canvas = document.querySelector("#game");
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

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

let bombsPositions = [];

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

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 1);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    console.log({ map, mapRows, mapRowsCols });

    showLives();

    // Hemos cambiado el tipo de variable 'const' a 'let', pero usando el siguiente código se podria limpiar el array manteniendo la variable como 'const':
    // bombsPositions.splice(0, bombsPositions.length);
    bombsPositions = [];
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

                // El profesor, lo hace de forma que no crea un constructor de bomba, unicamente le hace push de un objeto con los atributos "x" e "y".
                // bombsPositions.push({
                //     x: posX,
                //     y: posY
                // })

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
    const giftCollisionX = Math.floor(playerPosition.x) === Math.floor(giftPosition.x);
    const giftCollisionY = Math.floor(playerPosition.y) === Math.floor(giftPosition.y);
    const giftCollision = giftCollisionX && giftCollisionY;

    // En primera instancia yo hice una función que devolvia true o false, dependiendo si el jugador se encontraba sobre una bomba.
    // const collisionWithBomb = playerCollisionWithBomb(playerPosition.x, playerPosition.y);

    if (giftCollision) {
        levelWin();
    } /* else if (collisionWithBomb) {
        console.log("WUEON, BOMBA CABRON");
    } */

    const collisionWithBomb = bombsPositions.find(bomb => {
        const bombCollisionX = Math.floor(bomb.posX) == Math.floor(playerPosition.x);
        const bombCollisionY = Math.floor(bomb.posY) == Math.floor(playerPosition.y);

        return bombCollisionX && bombCollisionY;
    })

    console.log({collisionWithBomb});

    if (collisionWithBomb) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function levelFail() {
    console.log('Chocaste con bomba');

    lives--;

    if (lives <= 0) {
        
        level = 0;
        lives = 3;
        timeStart = undefined;
        clearInterval(timeInterval);

    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    
    startGame();

}

function gameWin() {
    console.log('¡Ganaste cabron!');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = '¡SUPERASTE EL RECORD! 🏆';
        } else {
            pResult.innerHTML = '¡NO SUPERASTE EL RECORD! 😭';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = '¡Para ser la primera vez, lo hiciste bien, pero sé que puedes hacerlo mejor 💪!';
    }

    // 1º Propuesta, realizada por mi.
    // if (!localStorage.getItem('record')) {
    //     localStorage.setItem('record', Date.now() - timeStart);
    // } else if (localStorage.getItem('record') < Date.now() - timeStart) {
    //     console.log("Record no superado");
    // } else if (localStorage.getItem('record') > Date.now() - timeStart) {
    //     console.log("Record superado");
    //     localStorage.setItem('record', Date.now() - timeStart);
    // }
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']); // [1, 2, 3]

    console.log(heartsArray);

    spanLives.innerHTML = ""; 
    heartsArray.forEach(heart => spanLives.append(heart));

}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    const recordTime = localStorage.getItem('record_time');

    if (recordTime) {
        spanRecord.innerHTML = recordTime;
    } else {
        spanRecord.innerHTML = '¡No hay record actual!';
    }
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

// Función que devovlia true si el jugador se encotraba sobre una bomba.
// function playerCollisionWithBomb(playerPosX, playerPosY) {
//     let collision = false;
// 
//     bombsPositions.forEach(element => {
// 
//         const collisionX = Math.floor(playerPosX) === Math.floor(element.posX);
//         const collisionY = Math.floor(playerPosY) === Math.floor(element.posY);
// 
//         if (collisionX && collisionY) {
// 
//             collision = collisionX && collisionY;
//             return collision;
// 
//         }
//         
//     });
// 
//     return collision;
// }