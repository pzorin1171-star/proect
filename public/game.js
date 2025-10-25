// Константы игры
const GRID_WIDTH = 24;
const GRID_HEIGHT = 24;

// Цвета в средневековом стиле
const COLORS = {
    BACKGROUND: '#5d4037',
    GRID: 'rgba(141, 110, 99, 0.3)',
    ROBOT: '#f5e8c8',
    ENEMY: '#ef5350',
    TARGET: '#4caf50',
    OBSTACLE: '#6d4c41',
    TEXT: '#f5e8c8'
};

// Текстуры персонажей
const textures = {
    robot: new Image(),
    enemy: new Image()
};

// Загрузка текстур с обработкой ошибок
textures.robot.onerror = function() {
    console.log('Robot image failed to load, using fallback');
};
textures.enemy.onerror = function() {
    console.log('Enemy image failed to load, using fallback');
};

// Пробуем разные пути к изображениям
const imagePaths = [
    'white_guy.png',
    'images/white_guy.png',
    '/white_guy.png',
    './white_guy.png'
];

let robotLoaded = false;
let enemyLoaded = false;

// Пробуем загрузить изображения по разным путям
imagePaths.forEach(path => {
    if (!robotLoaded) {
        const img = new Image();
        img.onload = function() {
            textures.robot = img;
            robotLoaded = true;
        };
        img.src = path;
    }
});

imagePaths.forEach(path => {
    if (!enemyLoaded) {
        const img = new Image();
        img.onload = function() {
            textures.enemy = img;
            enemyLoaded = true;
        };
        img.src = path.replace('white_guy', 'red_guy');
    }
});

// Игровое состояние
let gameState = {
    currentScreen: 'mode-selection',
    currentLevel: 0,
    levels: [
        {
            id: 'level1',
            title: "Движение вперед",
            description: "Переместите робота к цели, используя команду 'Идти вперед'",
            robot: {x: 2, y: 4},
            target: {x: 2, y: 1},
            enemies: [],
            obstacles: [],
            program: [],
            completed: false,
            unlocked: true,
            reward: 10
        },
        {
            id: 'level2',
            title: "Обход препятствия",
            description: "Обойдите препятствие, чтобы добраться до цели",
            robot: {x: 1, y: 4},
            target: {x: 5, y: 4},
            enemies: [],
            obstacles: [{x: 3, y: 4}],
            program: [],
            completed: false,
            unlocked: false,
            reward: 15
        },
        {
            id: 'level3',
            title: "Движение в разных направлениях",
            description: "Используйте команды движения в разных направлениях",
            robot: {x: 1, y: 1},
            target: {x: 5, y: 5},
            enemies: [],
            obstacles: [],
            program: [],
            completed: false,
            unlocked: false,
            reward: 20
        }
    ],
    program: [],
    isRunning: false,
    currentStep: 0,
    gameOver: false,
    gameResult: null,
    draggedBlock: null,
    draggedBlockIndex: null,
    levelOffset: {x: 0, y: 0},
    currentCommandSteps: 0,
    totalCommandSteps: 0,
    userData: {
        coins: 0,
        grades: [],
        customLevels: [],
        customLessons: [],
        completedLevels: [],
        studentId: null,
        teacherId: null
    }
};

// Получение элементов DOM
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI элементы
const currentLevelElement = document.getElementById('current-level');
const currentTaskElement = document.getElementById('current-task');
const gameUI = document.getElementById('game-ui');
const programmingArea = document.getElementById('programming-area');
const programSlots = document.getElementById('program-slots');
const deleteZone = document.getElementById('delete-zone');

// Переменные для динамического размера
let gridSize;
let gameAreaHeight;
let offsetX, offsetY;

// Инициализация игры
function init() {
    console.log('Initializing game...');
    setupButtons();
    setupDragAndDrop();
    window.addEventListener('resize', handleResize);
    handleResize();
    loadFromLocalStorage();
    gameLoop();
}

// Обработка изменения размера окна
function handleResize() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    gameAreaHeight = window.innerHeight - (programmingArea ? programmingArea.offsetHeight : 0);
    
    gridSize = Math.min(
        window.innerWidth / GRID_WIDTH,
        gameAreaHeight / GRID_HEIGHT
    );
    
    offsetX = (window.innerWidth - GRID_WIDTH * gridSize) / 2;
    offsetY = (gameAreaHeight - GRID_HEIGHT * gridSize) / 2;
}

// Настройка обработчиков кнопок
function setupButtons() {
    console.log('Setting up buttons...');
    
    // Кнопки программирования
    const runProgramBtn = document.getElementById('run-program-btn');
    const resetProgramBtn = document.getElementById('reset-program-btn');
    
    if (runProgramBtn) {
        runProgramBtn.addEventListener('click', runProgram);
        console.log('Run program button found');
    } else {
        console.log('Run program button NOT found');
    }
    
    if (resetProgramBtn) {
        resetProgramBtn.addEventListener('click', resetProgram);
    }
    
    // Кнопки навигации
    const levelsBackBtn = document.getElementById('levels-back-btn');
    const gameBackBtn = document.getElementById('game-back-btn');
    
    if (levelsBackBtn) {
        levelsBackBtn.addEventListener('click', () => {
            if (currentMode === 'teacher') {
                showScreen('teacher-menu');
            } else {
                showScreen('student-menu');
            }
        });
    }
    
    if (gameBackBtn) {
        gameBackBtn.addEventListener('click', () => {
            resetGame();
            if (currentMode === 'teacher') {
                showScreen('teacher-menu');
            } else {
                showScreen('student-menu');
            }
        });
    }
    
    // Кнопки результатов игры
    const nextLevelBtn = document.getElementById('next-level-btn');
    const levelsMenuBtn = document.getElementById('levels-menu-btn');
    const retryLevelBtn = document.getElementById('retry-level-btn');
    const failLevelsMenuBtn = document.getElementById('fail-levels-menu-btn');
    const retryEnemyBtn = document.getElementById('retry-enemy-btn');
    const enemyLevelsMenuBtn = document.getElementById('enemy-levels-menu-btn');
    
    if (nextLevelBtn) nextLevelBtn.addEventListener('click', nextLevel);
    if (levelsMenuBtn) levelsMenuBtn.addEventListener('click', () => showScreen('levels'));
    if (retryLevelBtn) retryLevelBtn.addEventListener('click', retryLevel);
    if (failLevelsMenuBtn) failLevelsMenuBtn.addEventListener('click', () => showScreen('levels'));
    if (retryEnemyBtn) retryEnemyBtn.addEventListener('click', retryLevel);
    if (enemyLevelsMenuBtn) enemyLevelsMenuBtn.addEventListener('click', () => showScreen('levels'));
}

// Настройка перетаскивания команд
function setupDragAndDrop() {
    const commands = document.querySelectorAll('.command');
    console.log('Found commands:', commands.length);
    
    commands.forEach(command => {
        command.addEventListener('dragstart', (e) => {
            const commandData = {
                command: command.getAttribute('data-command'),
                steps: 1
            };
            e.dataTransfer.setData('text/plain', JSON.stringify(commandData));
            e.dataTransfer.setData('source', 'panel');
        });
    });
    
    if (deleteZone) {
        deleteZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            deleteZone.classList.add('highlight');
        });
        
        deleteZone.addEventListener('dragleave', () => {
            deleteZone.classList.remove('highlight');
        });
        
        deleteZone.addEventListener('drop', (e) => {
            e.preventDefault();
            deleteZone.classList.remove('highlight');
            
            const source = e.dataTransfer.getData('source');
            
            if (source === 'slot' && gameState.draggedBlockIndex !== null) {
                gameState.program[gameState.draggedBlockIndex] = null;
                updateProgramSlots();
            }
        });
    }
}

// Показать экран
function showScreen(screenName) {
    console.log('Showing screen:', screenName);
    
    // Скрыть все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
    
    // Скрыть игровой UI и область программирования
    if (gameUI) gameUI.classList.add('hidden');
    if (programmingArea) programmingArea.classList.add('hidden');
    
    // Скрыть результаты игры
    const gameResultElement = document.getElementById('game-result');
    const gameFailElement = document.getElementById('game-fail');
    const enemyCollisionElement = document.getElementById('enemy-collision');
    
    if (gameResultElement) gameResultElement.classList.add('hidden');
    if (gameFailElement) gameFailElement.classList.add('hidden');
    if (enemyCollisionElement) enemyCollisionElement.classList.add('hidden');
    
    // Убрать блокировку взаимодействия
    if (gameUI) gameUI.classList.remove('blocked');
    if (programmingArea) programmingArea.classList.remove('blocked');
    
    // Показать выбранный экран
    if (screenName === 'game') {
        if (gameUI) gameUI.classList.remove('hidden');
        if (programmingArea) programmingArea.classList.remove('hidden');
        setupProgramSlots();
    } else {
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.remove('hidden');
        } else {
            console.error('Screen not found:', screenName);
        }
    }
    
    gameState.currentScreen = screenName;
    
    // Обновление контента экрана
    if (screenName === 'levels') {
        renderLevelsScreen();
    } else if (screenName === 'shop') {
        updateCoinsDisplay();
        if (typeof initShop === 'function') initShop();
    } else if (screenName === 'join-lesson') {
        if (typeof loadActiveLessons === 'function') loadActiveLessons();
    } else if (screenName === 'workshop') {
        if (typeof initWorkshop === 'function') initWorkshop();
    }
}

// Рендер экрана уровней
function renderLevelsScreen() {
    const container = document.getElementById('levels-container');
    if (!container) {
        console.log('Levels container not found');
        return;
    }
    
    container.innerHTML = '';
    
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    console.log('Rendering levels:', allLevels.length);
    
    allLevels.forEach((level, index) => {
        const card = document.createElement('div');
        card.className = `level-card ${level.unlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="level-number">${index + 1}</div>
            <div class="level-title">${level.title}</div>
            <div class="level-description">${level.description}</div>
            ${level.unlocked ? '' : '<div class="lock-icon">🔒</div>'}
            ${level.completed ? '<div style="position:absolute; bottom:10px; color:#81c784;">✓ Пройден</div>' : ''}
            ${level.isCustom ? '<div style="position:absolute; top:10px; left:10px; color:#ffd54f;">★</div>' : ''}
            ${level.isFromLesson ? '<div style="position:absolute; top:10px; right:10px; color:#64b5f6;">👨‍🏫</div>' : ''}
        `;
        
        if (level.unlocked) {
            card.addEventListener('click', () => {
                startLevel(index);
            });
        }
        
        container.appendChild(card);
    });
}

// Начать уровень
function startLevel(levelIndex) {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    if (levelIndex >= allLevels.length || !allLevels[levelIndex].unlocked) {
        console.log('Level not available:', levelIndex);
        return;
    }
    
    gameState.currentLevel = levelIndex;
    const level = allLevels[levelIndex];
    
    console.log('Starting level:', level.title);
    
    // Сброс состояния игры
    resetLevelState(levelIndex);
    
    // Вычисление смещения для центрирования уровня
    calculateLevelOffset(level);
    
    // Обновление UI
    if (currentLevelElement) currentLevelElement.textContent = levelIndex + 1;
    if (currentTaskElement) currentTaskElement.textContent = level.description;
    
    showScreen('game');
}

// Вычислить смещение для центрирования уровня
function calculateLevelOffset(level) {
    // Собираем все объекты уровня
    const objects = [
        level.robot,
        level.target,
        ...(level.enemies || []),
        ...(level.obstacles || [])
    ];
    
    // Находим минимальные и максимальные координаты
    let minX = GRID_WIDTH, maxX = 0;
    let minY = GRID_HEIGHT, maxY = 0;
    
    objects.forEach(obj => {
        if (obj && obj.x !== undefined && obj.y !== undefined) {
            minX = Math.min(minX, obj.x);
            maxX = Math.max(maxX, obj.x);
            minY = Math.min(minY, obj.y);
            maxY = Math.max(maxY, obj.y);
        }
    });
    
    // Вычисляем центр уровня
    const levelCenterX = (minX + maxX) / 2;
    const levelCenterY = (minY + maxY) / 2;
    
    // Центр игрового поля
    const gridCenterX = GRID_WIDTH / 2;
    const gridCenterY = GRID_HEIGHT / 2;
    
    // Вычисляем смещение для центрирования уровня
    gameState.levelOffset = {
        x: gridCenterX - levelCenterX,
        y: gridCenterY - levelCenterY
    };
}

// Сброс состояния уровня
function resetLevelState(levelIndex) {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[levelIndex];
    
    // Сохраняем начальное состояние если его нет
    if (!level.initialState) {
        level.initialState = {
            robot: {...level.robot},
            enemies: [...level.enemies],
            obstacles: [...level.obstacles]
        };
    }
    
    // Восстановление начального состояния уровня
    level.robot = {...level.initialState.robot};
    level.enemies = [...level.initialState.enemies];
    level.obstacles = [...level.initialState.obstacles];
    
    gameState.program = [];
    gameState.isRunning = false;
    gameState.currentStep = 0;
    gameState.gameOver = false;
    gameState.gameResult = null;
    gameState.currentCommandSteps = 0;
    gameState.totalCommandSteps = 0;
    
    updateProgramSlots();
}

// Настройка слотов программы
function setupProgramSlots() {
    if (!programSlots) {
        console.log('Program slots container not found');
        return;
    }
    
    programSlots.innerHTML = '';
    
    // Создаем 20 слотов для программы
    for (let i = 0; i < 20; i++) {
        const slot = document.createElement('div');
        slot.className = 'program-slot';
        slot.textContent = i + 1;
        slot.dataset.index = i;
        
        // Обработчики для перетаскивания блоков между слотами
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('highlight');
        });
        
        slot.addEventListener('dragleave', () => {
            slot.classList.remove('highlight');
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('highlight');
            
            try {
                const commandData = JSON.parse(e.dataTransfer.getData('text/plain'));
                const source = e.dataTransfer.getData('source');
                const targetIndex = parseInt(slot.dataset.index);
                
                if (source === 'panel') {
                    // Добавляем новую команду из панели
                    if (!gameState.program[targetIndex]) {
                        gameState.program[targetIndex] = commandData;
                    }
                } else if (source === 'slot') {
                    // Перемещаем блок между слотами
                    if (gameState.draggedBlockIndex !== null && gameState.draggedBlockIndex !== targetIndex) {
                        // Меняем местами блоки
                        const temp = gameState.program[targetIndex];
                        gameState.program[targetIndex] = gameState.program[gameState.draggedBlockIndex];
                        gameState.program[gameState.draggedBlockIndex] = temp;
                    }
                }
                
                updateProgramSlots();
            } catch (error) {
                console.error('Error handling drop:', error);
            }
        });
        
        programSlots.appendChild(slot);
    }
    
    updateProgramSlots();
}

// Обновить отображение слотов программы
function updateProgramSlots() {
    if (!programSlots) return;
    
    const slots = programSlots.querySelectorAll('.program-slot');
    
    slots.forEach((slot, index) => {
        const commandData = gameState.program[index];
        
        // Очищаем слот
        slot.innerHTML = '';
        slot.textContent = index + 1;
        slot.classList.remove('filled');
        
        if (commandData) {
            // Создаем блок команды
            const block = document.createElement('div');
            block.className = 'program-block';
            
            // Текст команды
            const commandText = document.createElement('div');
            commandText.textContent = getCommandText(commandData);
            block.appendChild(commandText);
            
            // Добавляем ввод количества шагов для команд движения
            if (commandData.command !== 'attack') {
                const stepsContainer = document.createElement('div');
                stepsContainer.className = 'steps-input-container';
                
                const stepsInput = document.createElement('input');
                stepsInput.type = 'number';
                stepsInput.className = 'steps-input';
                stepsInput.min = 1;
                stepsInput.max = 99;
                stepsInput.value = commandData.steps;
                stepsInput.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 99) {
                        commandData.steps = value;
                        updateProgramSlots();
                    } else {
                        e.target.value = commandData.steps;
                    }
                });
                
                const stepsLabel = document.createElement('span');
                stepsLabel.className = 'steps-label';
                stepsLabel.textContent = 'клетки';
                
                stepsContainer.appendChild(stepsInput);
                stepsContainer.appendChild(stepsLabel);
                block.appendChild(stepsContainer);
            }
            
            block.draggable = true;
            block.dataset.index = index;
            
            // Обработчики для перетаскивания блоков
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(commandData));
                e.dataTransfer.setData('source', 'slot');
                gameState.draggedBlockIndex = index;
            });
            
            // Добавляем кнопку удаления
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                gameState.program[index] = null;
                updateProgramSlots();
            });
            
            block.appendChild(deleteBtn);
            slot.appendChild(block);
            slot.classList.add('filled');
        }
    });
}

// Получить текст команды
function getCommandText(commandData) {
    const commandTexts = {
        'forward': 'Вперед',
        'backward': 'Назад',
        'right': 'Вправо',
        'left': 'Влево',
        'attack': 'Атака'
    };
    
    return commandTexts[commandData.command] || commandData.command;
}

// Запуск программы
function runProgram() {
    if (gameState.isRunning) {
        console.log('Program is already running');
        return;
    }
    
    if (gameState.program.length === 0 || gameState.program.every(cmd => !cmd)) {
        alert('Добавьте команды в программу!');
        return;
    }
    
    console.log('Running program...');
    gameState.isRunning = true;
    gameState.currentStep = 0;
    gameState.currentCommandSteps = 0;
    gameState.totalCommandSteps = 0;
    executeNextStep();
}

// Выполнить следующий шаг программы
function executeNextStep() {
    if (!gameState.isRunning) return;
    
    // Если текущая команда движения еще не завершена
    if (gameState.currentCommandSteps < gameState.totalCommandSteps) {
        performMovementStep();
        gameState.currentCommandSteps++;
        
        // Если команда движения завершена
        if (gameState.currentCommandSteps >= gameState.totalCommandSteps) {
            gameState.currentStep++;
            gameState.currentCommandSteps = 0;
            gameState.totalCommandSteps = 0;
        }
        
        // Задержка перед следующим шагом для визуализации
        setTimeout(executeNextStep, 300);
        return;
    }
    
    // Если программа завершена
    if (gameState.currentStep >= gameState.program.length) {
        gameState.isRunning = false;
        checkGameResult();
        return;
    }
    
    const commandData = gameState.program[gameState.currentStep];
    
    if (!commandData) {
        // Пропускаем пустые команды
        gameState.currentStep++;
        setTimeout(executeNextStep, 100);
        return;
    }
    
    // Выполнение команды
    if (commandData.command === 'attack') {
        // Атаковать ближайшего врага в радиусе 1 клетки
        const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
        const level = allLevels[gameState.currentLevel];
        const enemyIndex = level.enemies.findIndex(enemy => 
            Math.abs(enemy.x - level.robot.x) <= 1 && 
            Math.abs(enemy.y - level.robot.y) <= 1
        );
        
        if (enemyIndex !== -1) {
            level.enemies.splice(enemyIndex, 1);
        }
        
        gameState.currentStep++;
        setTimeout(executeNextStep, 500);
    } else {
        // Команда движения - начинаем последовательное выполнение
        gameState.totalCommandSteps = commandData.steps;
        gameState.currentCommandSteps = 0;
        executeNextStep();
    }
}

// Выполнить один шаг движения
function performMovementStep() {
    const commandData = gameState.program[gameState.currentStep];
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    
    // Выполнение одного шага движения
    switch (commandData.command) {
        case 'forward':
            if (level.robot.y > 0 && !isObstacle(level.robot.x, level.robot.y - 1)) {
                level.robot.y--;
            }
            break;
        case 'backward':
            if (level.robot.y < GRID_HEIGHT - 1 && !isObstacle(level.robot.x, level.robot.y + 1)) {
                level.robot.y++;
            }
            break;
        case 'right':
            if (level.robot.x < GRID_WIDTH - 1 && !isObstacle(level.robot.x + 1, level.robot.y)) {
                level.robot.x++;
            }
            break;
        case 'left':
            if (level.robot.x > 0 && !isObstacle(level.robot.x - 1, level.robot.y)) {
                level.robot.x--;
            }
            break;
    }
    
    // Проверка столкновения с врагом
    if (isOnEnemy(level.robot.x, level.robot.y)) {
        gameState.isRunning = false;
        showEnemyCollision();
        return;
    }
}

// Проверить, является ли клетка препятствием
function isObstacle(x, y) {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    return level.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
}

// Проверить, находится ли робот на клетке с врагом
function isOnEnemy(x, y) {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    return level.enemies.some(enemy => enemy.x === x && enemy.y === y);
}

// Показать столкновение с врагом
function showEnemyCollision() {
    const enemyCollisionElement = document.getElementById('enemy-collision');
    const enemyTitle = document.getElementById('enemy-title');
    const enemyMessage = document.getElementById('enemy-message');
    
    if (enemyTitle) enemyTitle.textContent = 'СТОЛКНОВЕНИЕ С ВРАГОМ!';
    if (enemyMessage) enemyMessage.textContent = 'Робот столкнулся с врагом и был уничтожен.';
    if (enemyCollisionElement) enemyCollisionElement.classList.remove('hidden');
    
    // Блокируем взаимодействие с игровым полем
    if (gameUI) gameUI.classList.add('blocked');
    if (programmingArea) programmingArea.classList.add('blocked');
}

// Проверить результат игры
function checkGameResult() {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    
    // Проверка достижения цели и уничтожения всех врагов
    const isOnTarget = level.robot.x === level.target.x && level.robot.y === level.target.y;
    const allEnemiesDefeated = level.enemies.length === 0;
    
    if (isOnTarget && allEnemiesDefeated) {
        gameState.gameResult = 'win';
        showGameResult(true);
        
        // Помечаем уровень как пройденный
        level.completed = true;
        
        // Начисляем монеты
        gameState.userData.coins += level.reward || 10;
        updateCoinsDisplay();
        
        // Открываем следующий уровень, если он существует
        if (gameState.currentLevel < gameState.levels.length - 1) {
            gameState.levels[gameState.currentLevel + 1].unlocked = true;
        }
        
        // Сохраняем в localStorage
        saveToLocalStorage();
    } else if (isOnTarget && !allEnemiesDefeated) {
        // Робот на цели, но враги остались
        gameState.gameResult = 'lose';
        showGameResult(false, 'ВРАГИ НЕ УНИЧТОЖЕНЫ!', 'Робот достиг цели, но не все враги уничтожены.');
    } else {
        gameState.gameResult = 'lose';
        showGameResult(false, 'ПОПРОБУЙТЕ СНОВА', 'Робот не достиг цели. Попробуйте другую программу.');
    }
}

// Показать результат игры
function showGameResult(isWin, title = '', message = '') {
    const gameResultElement = document.getElementById('game-result');
    const gameFailElement = document.getElementById('game-fail');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const failTitle = document.getElementById('fail-title');
    const failMessage = document.getElementById('fail-message');
    
    // Блокируем взаимодействие с игровым полем
    if (gameUI) gameUI.classList.add('blocked');
    if (programmingArea) programmingArea.classList.add('blocked');
    
    if (isWin) {
        if (resultTitle) resultTitle.textContent = 'УРОВЕНЬ ПРОЙДЕН!';
        if (resultMessage) resultMessage.textContent = `Поздравляем! Вы заработали ${gameState.levels[gameState.currentLevel].reward || 10} монет.`;
        if (gameResultElement) gameResultElement.classList.remove('hidden');
    } else {
        if (failTitle) failTitle.textContent = title;
        if (failMessage) failMessage.textContent = message;
        if (gameFailElement) gameFailElement.classList.remove('hidden');
    }
}

// Повторить уровень
function retryLevel() {
    const gameFailElement = document.getElementById('game-fail');
    const enemyCollisionElement = document.getElementById('enemy-collision');
    
    if (gameFailElement) gameFailElement.classList.add('hidden');
    if (enemyCollisionElement) enemyCollisionElement.classList.add('hidden');
    
    resetLevelState(gameState.currentLevel);
    updateProgramSlots();
    
    // Разблокируем взаимодействие с игровым полем
    if (gameUI) gameUI.classList.remove('blocked');
    if (programmingArea) programmingArea.classList.remove('blocked');
}

// Следующий уровень
function nextLevel() {
    const gameResultElement = document.getElementById('game-result');
    if (gameResultElement) gameResultElement.classList.add('hidden');
    
    if (gameState.currentLevel < gameState.levels.length - 1) {
        startLevel(gameState.currentLevel + 1);
    } else {
        showScreen('levels');
    }
}

// Сброс программы
function resetProgram() {
    gameState.program = [];
    updateProgramSlots();
}

// Сброс игры
function resetGame() {
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    
    // Восстановление начального состояния уровня
    if (level.initialState) {
        level.robot = {...level.initialState.robot};
        level.enemies = [...level.initialState.enemies];
        level.obstacles = [...level.initialState.obstacles];
    }
    
    gameState.program = [];
    gameState.isRunning = false;
    gameState.currentStep = 0;
    gameState.gameOver = false;
    gameState.gameResult = null;
    gameState.currentCommandSteps = 0;
    gameState.totalCommandSteps = 0;
    
    updateProgramSlots();
}

// Рендер игры
function renderGame() {
    if (!ctx || gameState.currentScreen !== 'game') return;
    
    // Очистка canvas
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
    const level = allLevels[gameState.currentLevel];
    
    // Отрисовка сетки
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= GRID_WIDTH; x++) {
        const screenX = offsetX + x * gridSize;
        ctx.beginPath();
        ctx.moveTo(screenX, offsetY);
        ctx.lineTo(screenX, offsetY + GRID_HEIGHT * gridSize);
        ctx.stroke();
    }
    
    for (let y = 0; y <= GRID_HEIGHT; y++) {
        const screenY = offsetY + y * gridSize;
        ctx.beginPath();
        ctx.moveTo(offsetX, screenY);
        ctx.lineTo(offsetX + GRID_WIDTH * gridSize, screenY);
        ctx.stroke();
    }
    
    // Отрисовка препятствий
    ctx.fillStyle = COLORS.OBSTACLE;
    level.obstacles.forEach(obstacle => {
        const screenX = offsetX + (obstacle.x + gameState.levelOffset.x) * gridSize;
        const screenY = offsetY + (obstacle.y + gameState.levelOffset.y) * gridSize;
        ctx.fillRect(screenX, screenY, gridSize, gridSize);
    });
    
    // Отрисовка цели
    ctx.fillStyle = COLORS.TARGET;
    const targetX = offsetX + (level.target.x + gameState.levelOffset.x) * gridSize;
    const targetY = offsetY + (level.target.y + gameState.levelOffset.y) * gridSize;
    ctx.fillRect(targetX, targetY, gridSize, gridSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(targetX, targetY, gridSize, gridSize);
    
    // Отрисовка врагов
    level.enemies.forEach(enemy => {
        const screenX = offsetX + (enemy.x + gameState.levelOffset.x) * gridSize;
        const screenY = offsetY + (enemy.y + gameState.levelOffset.y) * gridSize;
        
        // Используем текстуру врага или запасной вариант
        if (textures.enemy.complete) {
            const size = gridSize * 2;
            const offset = (size - gridSize) / 2;
            ctx.drawImage(textures.enemy, screenX - offset, screenY - offset, size, size);
        } else {
            // Запасной вариант - цветной прямоугольник увеличенного размера
            ctx.fillStyle = COLORS.ENEMY;
            const size = gridSize * 1.5;
            const offset = (size - gridSize) / 2;
            ctx.fillRect(screenX - offset, screenY - offset, size, size);
        }
    });
    
    // Отрисовка робота
    const robotX = offsetX + (level.robot.x + gameState.levelOffset.x) * gridSize;
    const robotY = offsetY + (level.robot.y + gameState.levelOffset.y) * gridSize;
    
    // Используем текстуру робота или запасной вариант
    if (textures.robot.complete) {
        const size = gridSize * 2;
        const offset = (size - gridSize) / 2;
        ctx.drawImage(textures.robot, robotX - offset, robotY - offset, size, size);
    } else {
        // Запасной вариант - цветной прямоугольник увеличенного размера
        ctx.fillStyle = COLORS.ROBOT;
        const size = gridSize * 1.5;
        const offset = (size - gridSize) / 2;
        ctx.fillRect(robotX - offset, robotY - offset, size, size);
        
        // Добавление деталей роботу
        ctx.fillStyle = '#5d4037';
        const innerSize = size * 0.8;
        const innerOffset = (size - innerSize) / 2;
        ctx.fillRect(
            robotX - offset + innerOffset,
            robotY - offset + innerOffset,
            innerSize,
            innerSize
        );
        
        // Глаза робота
        ctx.fillStyle = '#4fc3f7';
        const eyeSize = size * 0.15;
        ctx.fillRect(
            robotX - offset + size * 0.2,
            robotY - offset + size * 0.3,
            eyeSize,
            eyeSize
        );
        ctx.fillRect(
            robotX - offset + size * 0.65,
            robotY - offset + size * 0.3,
            eyeSize,
            eyeSize
        );
    }
}

// Игровой цикл
function gameLoop() {
    renderGame();
    requestAnimationFrame(gameLoop);
}

// Обновление отображения монет
function updateCoinsDisplay() {
    const coinsElement = document.getElementById('coins-count');
    if (coinsElement) {
        coinsElement.textContent = gameState.userData.coins || 0;
    }
}

// Сохранение в localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('robotGameData', JSON.stringify(gameState.userData));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('robotGameData');
        if (savedData) {
            gameState.userData = JSON.parse(savedData);
        }
        updateCoinsDisplay();
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
    }
}

// Скрыть все экраны
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
}

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    init();
});
