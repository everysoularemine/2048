// Отключаем двойное нажатие и масштабирование на мобильных устройствах
document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault(); // Отключаем двойное нажатие
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // Отключаем двойное нажатие
    }
    lastTouchEnd = now;
}, { passive: false });

// Инициализация игрового поля 4x4
let grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
    addRandomTile();
    addRandomTile();
    updateGrid();
    document.addEventListener('keydown', handleKeyPress);

    // Обработчики событий для кнопок
    document.getElementById('up').addEventListener('click', () => {
        if (moveUp()) {
            addRandomTile();
            updateGrid();
        }
    });

    document.getElementById('down').addEventListener('click', () => {
        if (moveDown()) {
            addRandomTile();
            updateGrid();
        }
    });

    document.getElementById('left').addEventListener('click', () => {
        if (moveLeft()) {
            addRandomTile();
            updateGrid();
        }
    });

    document.getElementById('right').addEventListener('click', () => {
        if (moveRight()) {
            addRandomTile();
            updateGrid();
        }
    });
});

function addRandomTile() {
    let available = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                available.push({ x: i, y: j });
            }
        }
    }
    if (available.length > 0) {
        let random = available[Math.floor(Math.random() * available.length)];
        grid[random.x][random.y] = Math.random() > 0.9 ? 4 : 2;
    }
}

function updateGrid() {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach((cell, index) => {
        const x = Math.floor(index / 4);
        const y = index % 4;
        cell.textContent = grid[x][y] === 0 ? '' : grid[x][y];
        cell.style.backgroundColor = getColor(grid[x][y]);
    });

    document.getElementById('score').textContent = score;
}

function getColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#cdc1b4';
    }
}

// Проверка доступных движений
function canMove() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            // Проверка на пустую клетку
            if (grid[row][col] === 0) {
                return true; // Есть доступная клетка
            }
            // Проверка на возможность объединения плиток
            if (col < 3 && grid[row][col] === grid[row][col + 1]) {
                return true; // Можно объединить плитки по горизонтали
            }
            if (row < 3 && grid[row][col] === grid[row + 1][col]) {
                return true; // Можно объединить плитки по вертикали
            }
        }
    }
    return false; // Движений больше нет
}

// Функция, вызываемая при окончании игры
function endGame() {
    alert("Игра окончена! Вы можете перезапустить игру.");
    location.reload(); // Перезагрузка страницы
}

function handleKeyPress(event) {
    let moved = false;
    if (event.key === 'w' || event.key === 'W') moved = moveUp(); // Вверх
    if (event.key === 's' || event.key === 'S') moved = moveDown(); // Вниз
    if (event.key === 'a' || event.key === 'A') moved = moveLeft(); // Влево
    if (event.key === 'd' || event.key === 'D') moved = moveRight(); // Вправо

    if (moved) {
        addRandomTile();
        updateGrid();
        if (!canMove()) { // Проверяем возможность движения после перемещения
            endGame();
        }
    }
}


function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let stack = [];
        for (let row = 0; row < 4; row++) {
            if (grid[row][col] !== 0) {
                stack.push(grid[row][col]);
            }
        }
        for (let row = 0; row < stack.length; row++) {
            if (row > 0 && stack[row] === stack[row - 1]) {
                stack[row - 1] *= 2;
                score += stack[row - 1];
                stack[row] = 0;
                moved = true;
            }
        }
        for (let i = 0; i < 4; i++) {
            grid[i][col] = stack[i] || 0;
        }
        if (stack.length > 0 && stack.length < 4) {
            moved = true;
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let stack = [];
        for (let row = 3; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                stack.push(grid[row][col]);
            }
        }
        for (let row = 0; row < stack.length; row++) {
            if (row > 0 && stack[row] === stack[row - 1]) {
                stack[row - 1] *= 2;
                score += stack[row - 1];
                stack[row] = 0;
                moved = true;
            }
        }
        for (let i = 3; i >= 0; i--) {
            grid[i][col] = stack[3 - i] || 0;
        }
        if (stack.length > 0 && stack.length < 4) {
            moved = true;
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let stack = [];
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] !== 0) {
                stack.push(grid[row][col]);
            }
        }
        for (let col = 0; col < stack.length; col++) {
            if (col > 0 && stack[col] === stack[col - 1]) {
                stack[col - 1] *= 2;
                score += stack[col - 1];
                stack[col] = 0;
                moved = true;
            }
        }
        for (let i = 0; i < 4; i++) {
            grid[row][i] = stack[i] || 0;
        }
        if (stack.length > 0 && stack.length < 4) {
            moved = true;
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let stack = [];
        for (let col = 3; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                stack.push(grid[row][col]);
            }
        }
        for (let col = 0; col < stack.length; col++) {
            if (col > 0 && stack[col] === stack[col - 1]) {
                stack[col - 1] *= 2;
                score += stack[col - 1];
                stack[col] = 0;
                moved = true;
            }
        }
        for (let i = 3; i >= 0; i--) {
            grid[row][i] = stack[3 - i] || 0;
        }
        if (stack.length > 0 && stack.length < 4) {
            moved = true;
        }
    }
    return moved;
}
