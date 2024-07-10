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
const modal = document.querySelector('.modal');
const closeBtnModal = document.querySelector('#close');
const gameContainer = document.querySelector('.game-container');
const countries = document.querySelectorAll('#flags-container > button');
const titleModal = document.querySelector('.modal > h1');
const countriesContainer = document.querySelector('#flags-container');
const paragraphModal = document.querySelector('.modal > p');
const btnHelp = document.querySelector('.messages button');
const header = document.querySelector('header');
const btnChangeLang = document.querySelector('#change-lang');

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

const door = new CanvasItem('O', undefined, undefined);

let obstaclePositions = [];
let collisihedObstacles = [];

window.addEventListener('load', openModal);
window.addEventListener('load', addEventsListenerToEachCountry);
window.addEventListener('load', setCanvasSize);
closeBtnModal.addEventListener('click', closeModal);
window.addEventListener('resize', setCanvasSize);
btnHelp.addEventListener('click', showHelpModal);
btnChangeLang.addEventListener('click', changeLangModal);


function openModal() {
    const lang = localStorage.getItem('lang');

    if (!lang) {
        header.style.display = 'none'
        modal.style.display = 'block';
        gameContainer.style.display = 'none';
        closeBtnModal.style.display = 'none';
    } else {
        return;
    }
}

function selectLang(lang) {
    if (lang === 'uk' || lang === 'es') {
        localStorage.setItem('lang', lang);
        console.log('lenguaje seleccionado');
    } else {
        console.error('AAAAAAAAA');
    }
}

function addEventsListenerToEachCountry() {
    countries.forEach(button => {
        button.addEventListener('click', () => selectLang(button.value));
        button.addEventListener('click', turnModalIntoHelpModal);
    });
}

function turnModalIntoHelpModal () {
    const lang = localStorage.getItem('lang');

    btnChangeLang.style.display = 'block';
    

    closeBtnModal.style.display = 'block';
    countriesContainer.style.display = 'none';

    if (lang === 'uk') {
        titleModal.innerHTML = `How to play Dragon's Gate Journey?`;
        paragraphModal.innerHTML = `<b>Dragon's Gate Journey</b> is an exciting adventure game where you control a <b>dragon</b> 🐉. The goal is to guide the dragon from the <b>torii gate</b> ⛩️ to the <b>Japanese castle</b> 🏯, dodging the <b>chopsticks</b> 🥢 which, if hit, will turn into <b>bowls of ramen</b> 🍜. <br><br> If you manage to complete all levels, you will reach the <b>lantern walk</b> 🏮, celebrating your victory. However, if you lose all your lives (three hearts ❤️), the <b>oni demon</b> 👹 will appear, indicating your defeat.
        
        <br><br>

        <b>Controls:</b>

        <ul>
            <li><b>On a computer or device with a keyboard:</b> you can move using the WASD keys, the arrow keys or on-screen buttons.</li>
            <li><b>On a mobile device:</b> you can only move using the on-screen buttons.</li>
        </ul>
        `;
    } else if (lang === 'es') {
        titleModal.innerHTML = `¿Como jugar a Dragon's Gate Journey?`;
        paragraphModal.innerHTML = `<b>Dragon's Gate Journey</b> es un emocionante juego de aventura en el que controlas a un <b>dragón</b> 🐉. El objetivo es guiar al dragón desde la <b>puerta torii</b> ⛩️ hasta el <b>castillo japonés</b> 🏯, esquivando los <b>palillos</b> 🥢 que, si los chocas, se convertirán en <b>tazones de ramen</b> 🍜. <br><br> Si logras completar todos los niveles, llegarás al <b>paseo de las linternas</b> 🏮, celebrando tu victoria. Sin embargo, si pierdes todas tus vidas (tres corazones ❤️), aparecerá el <b>demonio oni</b> 👹, indicando tu derrota.
        
        <br><br>

        <b>Controles:</b>
        
        <ul>
            <li><b>En ordenador o dispositivo con teclado:</b> puedes moverte usando las teclas WASD, las flechas o con los botones en pantalla.</li>
            <li><b>En dispositivo móvil:</b> solo podrás moverte usando los botones en pantalla.</li>
        </ul>`;
    }

}

function closeModal() {
    modal.style.display = 'none';
    gameContainer.style.display = 'flex';
    header.style.display = 'block';
}

function showHelpModal() {
    turnModalIntoHelpModal();

    const lang = localStorage.getItem('lang');

    if (lang) {
        // btnChangeLang.style.display = 'block'
        modal.style.display = 'block';
        gameContainer.style.display = 'none';
        header.style.display = 'none';
    } else {
        return;
    }
}

function changeLangModal() {
    btnChangeLang.style.display = 'none';
    closeBtnModal.style.display = 'none';
    countriesContainer.style.display = 'flex';

    titleModal.innerHTML = `¡SELECT YOUR LANGUAGE!`;
    paragraphModal.innerHTML = '';
}

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
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

                door.posX = posX;
                door.posY = posY;

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
        
        timeStart = undefined;
        clearInterval(timeInterval);

        game.fillText(emojis[door.type], door.posX, door.posY);
        game.fillText(emojis[castle.type], castle.posX, castle.posY);

        removeArrowKeyListeners();

        btnUp.removeEventListener('click', moveUp);
        btnLeft.removeEventListener('click', moveLeft);
        btnRight.removeEventListener('click', moveRight);
        btnDown.removeEventListener('click', moveDown);

        let delay = 0;
        // let counter = 0;

        obstaclePositions.forEach(obstacle => {
            setTimeout(() => {
                game.font = `${elementsSize}px Verdana`;
                game.textAlign = "end";
                game.fillText(emojis['GAME_OVER'], obstacle.posX, obstacle.posY);

                if (delay >= (obstaclePositions.length - 1) * 10) {
                    printResult('lost');
                }

                // counter++;
                // console.log({delay, counter});
            }, delay);

            delay += 10;
        });

        // console.log('Llamando a printResult');
        // printResult('lost');
    } else { 
        player.posX = undefined;
        player.posY = undefined;
        
        startGame();
    }

}

function gameWin() {
    console.log('¡Ganaste cabron!');

    removeArrowKeyListeners();

    btnUp.removeEventListener('click', moveUp);
    btnLeft.removeEventListener('click', moveLeft);
    btnRight.removeEventListener('click', moveRight);
    btnDown.removeEventListener('click', moveDown);

    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        pResult.style.display = 'block';

        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = '¡SUPERASTE EL RECORD! 🏆';
        } else {
            pResult.innerHTML = '¡NO SUPERASTE EL RECORD! 😭';
            console.log({recordTime, playerTime});
        }
    } else {
        pResult.style.display = 'block';
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = '¡Para ser la primera vez, lo hiciste bien, pero sé que puedes hacerlo mejor 💪!';
    }

    const map = maps[level - 1  ];

    console.log({map, level});

    // const mapRows = map.trim().split('\n');
    // const mapRowsCols = mapRows.map(row => row.trim().split(''));
    game.clearRect(0, 0, canvasSize, canvasSize);

    game.fillText(emojis[door.type], door.posX, door.posY);
    game.fillText(emojis[castle.type], castle.posX, castle.posY);

    let delay = 0;

    obstaclePositions.forEach(obstacle => {
        setTimeout(() => {
            game.font = `${elementsSize}px Verdana`;
            game.textAlign = "end";
            game.fillText(emojis['WIN'], obstacle.posX, obstacle.posY);

            if (delay >= (obstaclePositions.length - 1) * 20) {
                printResult('win');
            }
        }, delay);

        delay += 20;
    });

    


    // mapRowsCols.forEach((row, rowI) => {
    //     row.forEach((col, colI) =>  {
    //         setTimeout(() => {
    //             let emoji = emojis[col];
    //             const posX = elementsSize * (colI + 1.25);
    //             const posY = elementsSize * (rowI + 0.95);
    
    //             if (col === 'X') {
    //                 emoji = emojis['WIN'];
    //                 game.fillText(emoji, posX, posY);
    //             }
    
                
    //         }, delay);
    
    //         delay += 150;

    //     })
    // });


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
// window.addEventListener('keydown', (e) => {
//     const tecla = e.key;

//     const moveFunctions = {
//         ArrowUp: moveUp,
//         ArrowLeft: moveLeft,
//         ArrowRight: moveRight,
//         ArrowDown: moveDown
//     }

//     const moveFunction = moveFunctions[tecla];

//     if (moveFunction) {
//         moveFunction();
//     }
// });

// 3º Forma y definitiva, parecida a la versión anterior, pero que nos permite borrar los eventListener.
const handleKeyDown = (e) => {
    const tecla = e.key;

    const moveFunctions = {
        ArrowUp: moveUp,
        ArrowLeft: moveLeft,
        ArrowRight: moveRight,
        ArrowDown: moveDown,
        w: moveUp,
        a: moveLeft,
        d: moveRight,
        s: moveDown,
        
    };

    const moveFunction = moveFunctions[tecla];

    if (moveFunction) {
        moveFunction();
    }
};

window.addEventListener('keydown', handleKeyDown);

const removeArrowKeyListeners = () => {
    window.removeEventListener('keydown', handleKeyDown);
};


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
    pResult.style.display = 'none';

    level = 0;
    lives = 3;

    collisihedObstacles = [];

    timeStart = undefined;
    clearInterval(timeInterval);

    pResult.innerHTML = '';

    player.posX = undefined;
    player.posY = undefined;
    
    window.addEventListener('keydown', handleKeyDown);
    btnUp.addEventListener('click', moveUp);
    btnLeft.addEventListener('click', moveLeft);
    btnRight.addEventListener('click', moveRight);
    btnDown.addEventListener('click', moveDown);

    startGame();
}

function formatedTime(time) {
    let initialTimeInSeconds = time / 1000;
    let seconds;
    let minutes;
    let hours;

    // seconds = Math.floor(time / 1000);

    hours = Math.trunc(initialTimeInSeconds / 3600);

    minutes = Math.trunc((initialTimeInSeconds % 3600) / 60);

    seconds = (initialTimeInSeconds % 3600) % 60;

    // minutes = Math.floor((seconds % 3600) / 60);
    

    // if (minutes / 60 >= 1) {
    //     hours = Math.floor(minutes / 60);
    // } else {
    //     hours = 0;
    // }
    

    let formated = `${hours}h : ${minutes}min : ${seconds.toFixed(2)}s`;

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

function printResult(result) {
    // Define base font sizes
    const baseFontSizeLarge = 3.75; // base rem for large text
    const baseFontSizeSmall = 22; // base px for small text (or you can use rem)

    // Calculate responsive font sizes
    const responsiveFontSizeLarge = (canvasSize / 500) * baseFontSizeLarge;
    const responsiveFontSizeSmall = (canvasSize / 500) * baseFontSizeSmall;

    const lang = localStorage.getItem('lang');

    if (result === 'lost') {
        if (lang === 'uk') {
            game.fillStyle = 'black';
            game.fillRect(0, canvasSize / 3, canvasSize, canvasSize / 3);

            game.fillStyle = 'red';
            game.font = `${responsiveFontSizeLarge}rem retroGaming`;
            game.textAlign = 'center';
            game.fillText('GAME OVER!', canvasSize / 2, canvasSize / 2);
            game.font = `${responsiveFontSizeSmall}px retroGaming`;
            game.textAlign = 'center';
            game.fillText(' Press the restart button', canvasSize / 2, canvasSize / 1.7);
            game.fillText(' to play again!', canvasSize / 2, canvasSize / 1.575);
        } else if (lang === 'es') {
            game.fillStyle = 'black';
            game.fillRect(0, canvasSize / 3, canvasSize, canvasSize / 3);

            game.fillStyle = 'red';
            game.font = `${responsiveFontSizeLarge - 1.1}rem retroGaming`;
            game.textAlign = 'center';
            game.fillText('¡FIN DE LA PARTIDA!', canvasSize / 2, canvasSize / 2);
            game.font = `${responsiveFontSizeSmall}px retroGaming`;
            game.textAlign = 'center';
            game.fillText('¡Pulsa el botón de restart', canvasSize / 2, canvasSize / 1.7);
            game.fillText('para volver a jugar!', canvasSize / 2, canvasSize / 1.575);
        }
    } else if (result === 'win') {
        if (lang === 'uk') {
            game.fillStyle = 'black';
            game.fillRect(0, canvasSize / 3, canvasSize, canvasSize / 3);

            game.fillStyle = '#D4AF37';
            game.font = `${responsiveFontSizeLarge}rem retroGaming`;
            game.textAlign = 'center';
            game.fillText('YOU WIN!', canvasSize / 2, canvasSize / 2);
            game.font = `${responsiveFontSizeSmall - 6}px retroGaming`;
            game.textAlign = 'center';
            
            game.fillText('Congratulations on your victory, press the', canvasSize / 2, canvasSize / 1.7);
            game.fillText('restart button to try to beat your record!', canvasSize / 2, canvasSize / 1.575);
        } else if (lang === 'es') {
            game.fillStyle = 'black';
            game.fillRect(0, canvasSize / 3, canvasSize, canvasSize / 3);

            game.fillStyle = '#D4AF37';
            game.font = `${responsiveFontSizeLarge}rem retroGaming`;
            game.textAlign = 'center';
            game.fillText('¡HAS GANADO!', canvasSize / 2, canvasSize / 2);
            game.font = `${responsiveFontSizeSmall - 5}px retroGaming`;
            game.textAlign = 'center';
            
            game.fillText('¡Enhorabuena por tu victoria, pulsa el botón', canvasSize / 2, canvasSize / 1.7);
            game.fillText('de restart para conseguir batir tu récord!', canvasSize / 2, canvasSize / 1.575);
        }
        
    }
}
