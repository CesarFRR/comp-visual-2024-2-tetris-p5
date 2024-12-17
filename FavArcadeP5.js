// [processing-p5-convert] import java.util.LinkedList;
// [processing-p5-convert] import java.util.Queue;
// Realizado por:
// - Juan Esteban Mahecha 
// - David Felipe Marin Rosas
// - Cesar Rincon 
// - Juan Andres Carreño
// Retro Tetris en Processing

//  ! Variables globales
let retroFont; // Fuente retro
let sfx_tetris_song, sfx_tetris_menu; // Música de fondo
let sfx_lego_move_l, sfx_lego_move_r, sfx_lego_rotate, sfx_lego_drop; // Efectos de sonido
let sfx_got_score, sfx_game_over, sfx_321_go, sfx_pause_game, sfx_select_option;

// Estado del juego
let gameState = "start"; // Estado del juego
let currentPieceIndex; // Índice de la pieza actual
let currentPiece; // Representación de la pieza actual
let slotPieceIndex = 7; // Índice de la pieza en el slot
let pieceIndexQueue = new JQueue(); // Cola de piezas
let pieceRow, pieceCol;             // Posición de la pieza actual
let gameOver = false;
let score = 0; // Celdas de la cuadrícula de juego
let grid; // Matriz de celdas, juego
let gridColors; // Matriz de colores, juego
let rows = 20; // Filas en la cuadrícula de juego
let cols = 10; // Columnas en la cuadrícula de juego
let blockSize = 30; // Tamaño de las celdas en pixeles
// Piezas
let pieceColor;


let countdown = 3;
let countdownActive = false;
let countdownInterval;

let shadowRow = 0;
let checkForShadow = true;
let isTetrisSongPaused = false;
firstState = true;

let typeOfPiece = [[ // I piece
    [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [ // L piece
    [0, 0, 1], [1, 1, 1], [0, 0, 0]], [ // J piece
    [1, 0, 0], [1, 1, 1], [0, 0, 0]], [ // S piece
    [0, 1, 1], [1, 1, 0], [0, 0, 0]], [ // T piece
    [0, 1, 0], [1, 1, 1], [0, 0, 0]], [ // Z piece
    [1, 1, 0], [0, 1, 1], [0, 0, 0]], [ // O piece
    [1, 1], [1, 1]]]; // Se crea la cuadricual completa, tanto de la parte jugable como de lo que no, cada bloque es de 30x30 pixeles
function settings() {
} // Se inicializa la cuadricula y se hace aparecer una pieza

function windowResized() {
    // Calcular el tamaño del bloque en función de la altura de la ventana
    blockSize = windowHeight / rows;
    let canvasWidth = cols * blockSize + blockSize * 10;
    let canvasHeight = rows * blockSize;

    textSize(blockSize * 0.5); // Ajusta este valor según sea necesario

    resizeCanvas(canvasWidth, canvasHeight);

}

function setup() {
    // Calcular el tamaño del bloque en función de la altura de la ventana
    blockSize = windowHeight / rows;
    let canvasWidth = cols * blockSize + blockSize * 10;
    let canvasHeight = rows * blockSize;
    createCanvas(canvasWidth, canvasHeight);
    pieceColor = [lerpColor(color(0, 255, 255), color(255, 255, 255), 0.5), // I piece
    lerpColor(color(255, 165, 0), color(255, 255, 255), 0.5), // L piece
    lerpColor(color(0, 0, 255), color(255, 255, 255), 0.5), // J piece
    lerpColor(color(0, 255, 0), color(255, 255, 255), 0.5), // S piece
    lerpColor(color(128, 0, 128), color(255, 255, 255), 0.5), // T piece
    lerpColor(color(255, 0, 0), color(255, 255, 255), 0.5), // Z piece
    lerpColor(color(255, 255, 0), color(255, 255, 255), 0.5) // O piece
    ];
    console.log(cols * blockSize + blockSize * 10);
    console.log(rows * blockSize);
    textFont(retroFont);
    grid = initializeGrid(rows, cols);
    gridColors = initializeGrid(rows, cols); // Initialize grid colors
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            gridColors[r][c] = color(30); // Default color for empty cells
        }
    }
    spawnPiece();
}

function initializeGrid(rows, cols) {
    let grid = [];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

function preload() {

    retroFont = loadFont("PressStart2P-Regular.ttf");

    soundFormats('mp3', 'ogg');
    sfx_tetris_song = loadSound('./media/tetris-song.mp3');
    sfx_tetris_menu = loadSound('./media/main-menu.mp3');
    sfx_lego_move_l = loadSound('./media/lego-move-l.mp3');
    sfx_lego_move_r = loadSound('./media/lego-move-r.mp3');
    sfx_lego_rotate = loadSound('./media/lego-rotate.mp3');
    sfx_lego_drop = loadSound('./media/lego-drop.mp3');
    sfx_got_score = loadSound('./media/got-score-sound.mp3');
    sfx_game_over = loadSound('./media/game-over.mp3');
    sfx_321_go = loadSound('./media/3-2-1-go.mp3');
    sfx_pause_game = loadSound('./media/pause-game.mp3');
    sfx_select_option = loadSound('./media/select-option.mp3');



}// Se repite cada frame para dibujar la pantalla

function soundChecker() {
    if (gameState == "play" && !gameOver && !countdownActive) {
        if (!sfx_tetris_song.isPlaying()) {
            if (isTetrisSongPaused) {
                sfx_tetris_song.play();
                isTetrisSongPaused = false;
            } else {
                sfx_tetris_song.loop();
                sfx_tetris_menu.stop();
            }
        }
    } else {
        if (sfx_tetris_song.isPlaying()) {
            sfx_tetris_song.stop();
        }
    }

    if ((gameState == "start" || gameState == "instructions_inicial") && !gameOver && !countdownActive) {
        if (!sfx_tetris_menu.isPlaying()) {
            sfx_tetris_menu.loop();
            sfx_tetris_song.stop();
        }
    } else {
        if (sfx_tetris_menu.isPlaying()) {
            sfx_tetris_menu.stop();
        }
    }
}

function draw() {




    background(0);

    soundChecker();


    if (countdownActive) drawCountdown();

    else if (gameState == "start") {
        drawStartScreen();
    } else if (gameState == "instructions" || gameState == "instructions_inicial") {
        drawInstructionsScreen();
    } else if (gameState == "play" || gameState == "pause") { // Aquí ocurre la magía
        if (!gameOver) {
            drawGameScreen();
        } else {
            drawGameOverScreen();

        }
    }

}

function drawCountdown() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    if (countdown > 0) {
        text(countdown, width / 2, height / 2);
    } else {
        text("Go!", width / 2, height / 2);
    }
}




function drawStartScreen() {
    fill(255); textAlign(CENTER);
    textSize(32);
    text("Retro Tetris", width / 2, height / 4);
    textSize(16);
    text("Presiona 'I' para Instrucciones", width / 2, height / 2);
    text("Presiona 'P' para Jugar", width / 2, height / 1.5);
}

function drawInstructionsScreen() {
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("Instrucciones", width / 2, blockSize * 2);
    text("- Flecha Izquierda:\n Mover pieza a la izquierda", width / 2, blockSize * 4);
    text("- Flecha Derecha:\n Mover pieza a la derecha", width / 2, blockSize * 6);
    text("- Flecha Abajo:\n Acelerar caída", width / 2, blockSize * 8);
    text("- s: Rotar positivamente", width / 2, blockSize * 10);
    text("- a: Rotar negativamente", width / 2, blockSize * 12);
    text("- d: Cambiar pieza", width / 2, blockSize * 14);
    text("- space: Dejar caer pieza", width / 2, blockSize * 16);
    text("Presiona 'P' para comenzar", width / 2, blockSize * 17);
    textSize(15);
    text("presiona ESC para volver al menu principal", width / 2, blockSize * 19);
} // Dibuja la pantalla de juego

function drawGameScreen() {
    drawGrid();
    drawPiece();
    drawSidebar(pieceIndexQueue.peek());
    if (gameState == "play") {
        updateGame();
    }
}

function drawGameOverScreen() {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    text("Presiona 'R' para Reiniciar", width / 2, height / 1.5);
} // Dibuja la cuadrícula de juego

function drawGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 10; c++) {
            if (grid[r][c] == 1) {
                fill(gridColors[r][c]);
            } else { fill(30); }
            stroke(0);
            rect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
    }
}
function drawPiece() {
    fill(255, 100, 100);
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            if (currentPiece[r][c] == 1) {
                fill(pieceColor[currentPieceIndex]);
                rect((pieceCol + c) * blockSize, (pieceRow + r) * blockSize, blockSize, blockSize);
            }
        }
    }
    drawShadow();
}


function drawShadow() {
    if (checkForShadow) {
        checkForShadow = false;
        shadowRow = dropPieceToBottom();
    }
    const pr = pieceRow;

    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            if (currentPiece[r][c] == 1) {
                fill(100, 100, 100, 100); // Color de la sombra con transparencia
                rect((pieceCol + c) * blockSize, (shadowRow + r) * blockSize, blockSize, blockSize);
            }
        }
    }
}

function drawSidebar(nextPieceIndex) {
    fill(255);
    textAlign(LEFT_ARROW);
    textSize(14);
    text("Score: " + score, 10 * blockSize + 10, 50);
    drawNextPiece(typeOfPiece[nextPieceIndex], nextPieceIndex);
    fill(255);
    textSize(14);
    text("- 'i' para ver\n instrucciones o\n pausar", 10 * blockSize + 10, 250); // Guardar una pieza
    text("Slot:", 10 * blockSize + 10, blockSize * 11);
    drawSlot();
}

function drawSlot() {
    textSize(16);
    if (slotPieceIndex != 7) {
        let slotPiece = typeOfPiece[slotPieceIndex];
        fill(pieceColor[slotPieceIndex]);
        for (let i = 0; i < slotPiece.length; i++) {
            for (let j = 0; j < slotPiece[i].length; j++) {
                if (slotPiece[i][j] == 1) {
                    rect(12 * blockSize + 30 + j * blockSize, blockSize * 12 + i * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}

function drawNextPiece(piece, index) {
    fill(255);
    textSize(16);
    text("Next Piece:", 10 * blockSize + 10, 100); // Título para identificar
    // Coordenadas base para dibujar la figura
    let xBase = 12 * blockSize + 30; let yBase = 130; // Dibujar la figura en base al array recibido
    fill(pieceColor[index]); for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j] == 1) { // Si el bloque está presente
                rect(xBase + j * blockSize, yBase + i * blockSize, blockSize, blockSize);
            }
        }
    }
} // Hace aparecer una nueva pieza en la parte superior de la cuadrícula, hacía el centro


function spawnPiece() {
    if (score == 0 && pieceIndexQueue.isEmpty()) {
        let firstPieceInd = floor(random(0, 7));
        pieceIndexQueue.add(firstPieceInd);
        console.log("First piece added:", firstPieceInd);
        console.log("Current piece index:", currentPieceIndex);
        console.log("Todos los datos importantes: " + pieceIndexQueue, firstPieceInd, currentPieceIndex);

    }
    let nextPieceInd = floor(random(0, 7));
    pieceIndexQueue.add(nextPieceInd);
    console.log("Next piece added:", nextPieceInd);
    currentPieceIndex = pieceIndexQueue.poll();
    console.log("Current piece index:", currentPieceIndex);
    currentPiece = typeOfPiece[currentPieceIndex];
    pieceRow = 0;
    pieceCol = Math.floor(cols / 2) - Math.floor(currentPiece[0].length / 2);
}

function GetFramesOfDificulty() {
    let maxFrames = 30; // Máximo número de frames (caída más lenta)
    let minFrames = 5; // Mínimo número de frames (caída más rápida)
    // Formula para calcular los frames según el puntaje
    let frames = maxFrames - (score / 20); // Asegurarse de que el número de frames no sea menor a minFrames
    return Math.max(minFrames, frames);
}

function updateGame() { // Caída automática
    if (frameCount % GetFramesOfDificulty() == 0) {
        if (canMovePieceTo(pieceRow + 1, pieceCol)) {
            pieceRow++;
        } else {
            mergePiece();
            checkLines();
            spawnPiece();
            if (!canMovePieceTo(pieceRow, pieceCol)) {
                gameOver = true;
                sfx_game_over.play();
                sfx_tetris_song.stop();

            }
        }
    }
}

function checkLines() {
    for (let r = rows - 1; r >= 0; r--) {
        let fullLine = true;
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] == 0) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            console.log("Full line at row: " + r);
            console.log("Current grid: " + grid);
            for (let rr = r; rr > 0; rr--) {
                console.log("Moving row: " + rr);
                console.log("Current row: " + grid[rr]);
                console.log("Previous row: " + grid[rr - 1]);
                grid[rr] = grid[rr - 1].slice(); // Usar slice() en lugar de clone()
            }
            grid[0] = new Array(cols).fill(0); // Inicializar la nueva fila
            sfx_got_score.play();
            score += 10;
            r++;
        }
    }
}
function mergePiece() {
    console.log("Merging piece");
    console.log("Piece row: " + pieceRow);
    console.log("Piece col: " + pieceCol);
    console.log("Current piece: " + currentPiece);
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            if (currentPiece[r][c] == 1) {
                grid[pieceRow + r][pieceCol + c] = 1;
                gridColors[pieceRow + r][pieceCol + c] = pieceColor[currentPieceIndex];
            }
        }
    }
}

function canMovePieceTo(newRow, newCol) {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            // Verificar una por una cada bloque de la pieza
            let gridRow = newRow + r;
            let gridCol = newCol + c;
            // Verificar solo si hay un bloque en la celda
            if (currentPiece[r][c] == 1) {
                // Casos en que hay algo en nuestra celda de llegada
                if (gridRow < 0 || gridRow >= rows || gridCol < 0 || gridCol >= cols || grid[gridRow][gridCol] == 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function canMovePiece(newPiece) { // Verificar si la nueva pieza es valida
    for (let r = 0; r < newPiece.length; r++) {
        for (let c = 0; c < newPiece[0].length; c++) { // Verificar una por una cada celda de la pieza
            let gridRow = pieceRow + r; let gridCol = pieceCol + c; // Verificar solo si hay un bloque en la celda
            if (newPiece[r][c] == 1) { // Casos en que hay algo en nuestra celda de llegada o se sale del grid de juego
                if (gridRow < 0 || gridRow >= rows || gridCol < 0 || gridCol >= cols || grid[gridRow][gridCol] == 1) { return false; }
            }
        }
    } return true;
}

function startCountdown() {
    countdown = 3;
    countdownActive = true;
    sfx_321_go.play();
    countdownInterval = setInterval(updateCountdown, 1000);
}
function updateCountdown() {
    countdown--;
    if (countdown < 0) {
        stopCountdown();
        // Inicia el juego aquí
        gameState = "play";
    }
}

function stopCountdown() {
    clearInterval(countdownInterval);
    countdownActive = false;
}




function keyPressed() {

    if (keyCode == ESCAPE && gameState != "start") {
        stopCountdown();
        sfx_321_go.stop();
        sfx_game_over.stop();
        sfx_got_score.stop();
        sfx_lego_drop.stop();
        sfx_lego_move_l.stop();
        sfx_lego_move_r.stop();
        sfx_lego_rotate.stop();
        sfx_pause_game.stop();

        sfx_select_option.play();
        resetGame();
        gameState = "start";
        return;
    }

    if (gameState == "start" && key == 'i') {
        sfx_select_option.play();
        gameState = "instructions_inicial";
    } else if (gameState == "start" && key == 'p') {
        sfx_select_option.play();
        // 3 2 1 go
        startCountdown();

    } else if ((gameState == "instructions" || gameState == "instructions_inicial") && key == 'p') {
        sfx_select_option.play();
        sfx_tetris_menu.stop();
        // 3 2 1 go
        startCountdown();
    } else if ((gameState == "instructions" || gameState == "instructions_inicial") && key == 'Escape') {
        sfx_select_option.play();
        resetGame();
        gameState = "Start";
    } else if (gameState == "instructions_inicial" && key == 'i') {
        sfx_select_option.play();

        gameState = "start";
    } else if (gameState == "instructions" && key == 'i') {
        sfx_select_option.play();

        gameState = "play";
    } else if (gameState == "play" && key == 'p') {
        sfx_tetris_song.pause();
        isTetrisSongPaused = true;
        sfx_pause_game.play();
        sfx_tetris_menu.stop();
        gameState = "pause";
    } else if (gameState == "pause" && key == 'p') {
        sfx_select_option.play();
        gameState = "play";
    } else if (gameState == "pause" && key == 'i') {
        gameState = "instructions";
    }
    else if (gameState == "pause" && key == 'Escape' || gameState == "instructions" && key == 'Escape') {

        sfx_select_option.play();
        resetGame();
        gameState = "start";
    }
    else if (gameState == "play") {
        checkForShadow = true;

        if (keyCode == LEFT_ARROW && canMovePieceTo(pieceRow, pieceCol - 1)) {
            sfx_lego_move_l.play();
            pieceCol--;
        } else if (keyCode == RIGHT_ARROW && canMovePieceTo(pieceRow, pieceCol + 1)) {
            sfx_lego_move_r.play();
            pieceCol++;
        }
        else if (keyCode == DOWN_ARROW && canMovePieceTo(pieceRow + 1, pieceCol)) {
            random(0, 1) > 0.5 ? sfx_lego_move_l.play() : sfx_lego_move_r.play();
            pieceRow++;
        } else if (key == ' ' && canMovePieceTo(pieceRow + 1, pieceCol)) {
            sfx_lego_drop.play();
            pieceRow = dropPieceToBottom();
            mergePiece();
            checkLines();
            spawnPiece();
        } else if (key == 's' || keyCode == UP_ARROW) {
            sfx_lego_rotate.play();
            rotatePieceRight();
        } else if (key == 'a' || keyCode == SHIFT) {
            sfx_lego_rotate.play();
            rotatePieceLeft();
        }
        else if (key == 'r') {
            sfx_select_option.play();
            resetGame();
            sfx_tetris_song.stop();
            gameState = "start";
            startCountdown();
        } else if (key == 'd') {
            sfx_select_option.play();
            exchangeSlotPiece();
        } else if (gameState == "play" && key == 'i') {
            sfx_pause_game.play();
            sfx_tetris_song.stop();
            gameState = "instructions";
        }
    } else if (gameOver && key == 'r') {
        resetGame();
    }
}

function mousePressed() {

    soundChecker();
    if (gameState == "start" && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (!sfx_tetris_menu.isPlaying()) {
            sfx_tetris_menu.loop();
        }
    }
    console.log("Mouse pressed");
}


function dropPieceToBottom() {
    let tempRow = pieceRow; // Comenzamos desde la posición actual
    // Sigue incrementando la fila temporal mientras pueda moverse hacia abajo
    while (canMovePieceTo(tempRow + 1, pieceCol)) {
        tempRow++;
        console.log("Piece moved to row: " + pieceRow);
    }
    console.log(tempRow);
    return tempRow--; // Devuelve la posición más baja posible
}

function resetGame() {
    grid = initializeGrid(rows, cols);
    spawnPiece();
    gameOver = false;
    score = 0;
    slotPieceIndex = 7;
}
function exchangeSlotPiece() {
    let nextPosiblePiece; // Verificar si hay slot piece
    if (slotPieceIndex == 7) { // Si no hay pieza en el slot, se guarda la pieza actual y se saca otra
        nextPosiblePiece = typeOfPiece[pieceIndexQueue.peek()]; // Verificar si se puede cambiar la pieza
        if (canMovePiece(nextPosiblePiece)) { // Se guarda la pieza actual en el slot y se cambia
            slotPieceIndex = currentPieceIndex;
            currentPieceIndex = pieceIndexQueue.poll();
            currentPiece = typeOfPiece[currentPieceIndex]; // Como sacamos una, agregamos otra a la fila
            let nextPieceInd = (floor(random(0, 7)));
            pieceIndexQueue.add(nextPieceInd);
        }
    } else { // Si hay pieza en el slot, primero se verifica
        nextPosiblePiece = typeOfPiece[slotPieceIndex]; // Verificar si se puede cambiar la pieza
        if (canMovePiece(nextPosiblePiece)) { // Se guarda la pieza actual en el slot y se cambia
            let temp = slotPieceIndex;
            slotPieceIndex = currentPieceIndex;
            currentPieceIndex = temp;
            currentPiece = nextPosiblePiece;
        }
    }
}

function rotatePieceRight() {
    let newPiece = initializeGrid(currentPiece[0].length, currentPiece.length);
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            newPiece[c][currentPiece.length - 1 - r] = currentPiece[r][c];
        }
    }
    if (canMovePieceTo(pieceRow, pieceCol) && canMovePiece(newPiece)) {
        currentPiece = newPiece;
    }
}

function rotatePieceLeft() {
    let newPiece = initializeGrid(currentPiece[0].length, currentPiece.length);

    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[0].length; c++) {
            newPiece[currentPiece[0].length - 1 - c][r] = currentPiece[r][c];
        }
    }
    if (canMovePieceTo(pieceRow, pieceCol) && canMovePiece(newPiece)) {
        currentPiece = newPiece;
    }
} 
