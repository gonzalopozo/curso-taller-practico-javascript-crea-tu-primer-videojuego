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
const btnRestart = document.querySelector('.restart');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

class CanvasItem {
    constructor(type, posX, posY) {
        this.type = type;
        this.posX = posX;
        this.posY = posY;
    }
}

class Obstacle extends CanvasItem {
    constructor(posX, posY) {
        super('X', posX, posY);
    }

    collisihed() {
        this.type = 'OBSTACLE_COLLISION';
    }
}

const player = new CanvasItem('PLAYER', undefined, undefined);

const castle = new CanvasItem('I', undefined, undefined);

let obstaclePositions = [];
let collisihedObstacles = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    // canvasSize = Math.floor(canvasSize);
    canvasSize = Math.floor(canvasSize);

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = (canvasSize / 10) - 1;

    player.posX = undefined;
    player.posY = undefined;

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
    // obstaclePositions.splice(0, obstaclePositions.length);
    obstaclePositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);
    
    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            let emoji = emojis[col];
            const posX = elementsSize * (colI + 1.25);
            const posY = elementsSize * (rowI + 0.95);

            if (col == 'O') {

                if (!player.posX && !player.posY) {
                    player.posX = posX;
                    player.posY = posY;

                    console.log({player});
                }
                
            } else if (col == 'I') {

                castle.posX = posX;
                castle.posY = posY;

            } else if (col == 'X') {

                obstaclePositions.push(new Obstacle(posX, posY));

                // El profesor, lo hace de forma que no crea un constructor de bomba, unicamente le hace push de un objeto con los atributos "x" e "y".
                // obstaclePositions.push({
                //     x: posX,
                //     y: posY
                // })

            }

            collisihedObstacles.forEach(collishedObs => {
                const collishedObsX = Math.floor(collishedObs.posX) == Math.floor(posX);
                const collishedObsY = Math.floor(collishedObs.posY) == Math.floor(posY);
                const collishedObsPos = collishedObsX && collishedObsY;

                if (collishedObsPos) {
                    emoji = emojis['OBSTACLE_COLLISION'];
                }
            });

            console.log(`Número de fila es ${rowI} y el número de columna es ${colI}`);

            game.fillText(emoji, posX, posY);

        })
    });

    movePlayer();   
}

function movePlayer() {
    // 1º Forma de la que se hizo.
    // const realPlayerPosX = Math.floor(player.posX);
    // const realPlayerPosY = Math.floor(player.posY);
    // const realGiftPosX = Math.floor(castle.posX);
    // const realGiftPosY = Math.floor(castle.posY);


    // if ((realPlayerPosX === realGiftPosX) && (realPlayerPosY === realGiftPosY)) {
    //     console.log("¡GANO ESE WUEON!");
    // }

    // 2º Forma de la que se hizo, en teoria más optima.
    const castleCollisionX = Math.floor(player.posX) === Math.floor(castle.posX);
    const castleCollisionY = Math.floor(player.posY) === Math.floor(castle.posY);
    const castleCollision = castleCollisionX && castleCollisionY;

    // En primera instancia yo hice una función que devolvia true o false, dependiendo si el jugador se encontraba sobre una bomba.
    // const collisionWithBomb = playerCollisionWithBomb(player.posX, player.posY);

    if (castleCollision) {
        levelWin();
    } /* else if (collisionWithBomb) {
        console.log("WUEON, BOMBA CABRON");
    } */

    // TODO: turn obstacles into the obstacle_collision emoji

    const collisionWithObstacle = obstaclePositions.find(obstacle => {
        const obstacleCollisionX = Math.floor(obstacle.posX) == Math.floor(player.posX);
        const obstacleCollisionY = Math.floor(obstacle.posY) == Math.floor(player.posY);

        if (obstacleCollisionX && obstacleCollisionY) {
            const collishedObstacle = new Obstacle(obstacle.posX, obstacle.posY);
            
            collishedObstacle.collisihed();
            
            collisihedObstacles.push(collishedObstacle);
        }

        return obstacleCollisionX && obstacleCollisionY;
    })

    console.log({collisionWithObstacle});

    if (collisionWithObstacle) {
        levelFail();
    }

    game.fillText(emojis[player.type], player.posX, player.posY);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    collisihedObstacles = [];
    startGame();
}

function levelFail() {
    console.log('Chocaste con un obstaculo');

    lives--;

    if (lives <= 0) {
        
        level = 0;
        lives = 3;
        timeStart = undefined;
        clearInterval(timeInterval);

        collisihedObstacles = [];

    }

    player.posX = undefined;
    player.posY = undefined;
    
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
    spanTime.innerHTML = formatedTime(Date.now() - timeStart);
}

function showRecord() {
    const recordTime = localStorage.getItem('record_time');

    if (recordTime) {
        spanRecord.innerHTML = formatedTime(recordTime);
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
    if ((player.posY - elementsSize) > 0) {
        player.posY -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log("¡Me quiero mover hacia la izquierda!");
    if ((player.posX - elementsSize) > elementsSize) {
        player.posX -= elementsSize;
        startGame();
    }

}

function moveRight() {
    console.log("¡Me quiero mover hacia la derecha!");
    if ((player.posX + elementsSize) <= (elementsSize * (9 + 1.25))) {
        player.posX += elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log("¡Me quiero mover hacia abajo!");
    if ((player.posY + elementsSize) <= canvasSize) {
        player.posY += elementsSize;
        startGame();
    }
}

btnRestart.addEventListener('click', restartGame);

function restartGame() {
    level = 0;
    lives = 3;
    timeStart = undefined;
    clearInterval(timeInterval);

    pResult.innerHTML = '';

    player.posX = undefined;
    player.posY = undefined;
    
    startGame();
}

function formatedTime(time) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    seconds = Math.floor(time / 1000);

    if (seconds / 60 >= 1) {
        minutes = Math.floor(seconds / 60);
    } else {
        minutes = 0;
    }

    if (minutes / 60 >= 1) {
        hours = Math.floor(minutes / 60);
    } else {
        hours = 0;
    }
    

    let formated = `${hours}h : ${minutes}min : ${seconds}s`;

    return formated;

}

// Función que devovlia true si el jugador se encotraba sobre una bomba.
// function playerCollisionWithObstacle(playerPosX, playerPosY) {
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