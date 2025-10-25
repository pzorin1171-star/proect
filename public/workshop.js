// Редактор уровней
class LevelEditor {
    constructor() {
        this.canvas = document.getElementById('editor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 24;
        this.cellSize = this.canvas.width / this.gridSize;
        
        this.currentTool = 'robot';
        this.levelData = {
            title: 'Новый уровень',
            description: '',
            reward: 10,
            difficulty: 'easy',
            robot: {x: 1, y: 1},
            target: {x: 5, y: 5},
            enemies: [],
            obstacles: [],
            lessonCode: this.generateLessonCode(),
            initialState: null
        };
        
        this.saveInitialState();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.render();
        this.updateLessonCodeDisplay();
    }
    
    setupEventListeners() {
        // Обработчики инструментов
        document.querySelectorAll('.tool-button').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
                this.updateToolInfo();
            });
        });
        
        // Обработчики канваса
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.cellSize);
            const y = Math.floor((e.clientY - rect.top) / this.cellSize);
            
            this.handleCanvasClick(x, y);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.cellSize);
            const y = Math.floor((e.clientY - rect.top) / this.cellSize);
            
            this.updateCursorCoords(x, y);
        });
        
        // Кнопки действий
        document.getElementById('save-level-btn').addEventListener('click', () => this.saveLevel());
        document.getElementById('clear-level-btn').addEventListener('click', () => this.clearLevel());
        document.getElementById('test-level-btn').addEventListener('click', () => this.testLevel());
        document.getElementById('generate-code-btn').addEventListener('click', () => this.generateNewCode());
        
        // Обработчики ввода данных
        document.getElementById('level-title').addEventListener('input', (e) => {
            this.levelData.title = e.target.value;
        });
        
        document.getElementById('level-description').addEventListener('input', (e) => {
            this.levelData.description = e.target.value;
        });
        
        document.getElementById('level-reward').addEventListener('input', (e) => {
            this.levelData.reward = parseInt(e.target.value);
        });
        
        document.getElementById('level-difficulty').addEventListener('change', (e) => {
            this.levelData.difficulty = e.target.value;
        });
    }
    
    generateLessonCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    generateNewCode() {
        this.levelData.lessonCode = this.generateLessonCode();
        this.updateLessonCodeDisplay();
    }
    
    updateLessonCodeDisplay() {
        const codeInput = document.getElementById('lesson-code-input');
        if (codeInput) {
            codeInput.value = this.levelData.lessonCode;
        }
    }
    
    updateToolInfo() {
        const currentToolElement = document.getElementById('current-tool');
        if (currentToolElement) {
            currentToolElement.textContent = document.querySelector('.tool-button.active').textContent;
        }
    }
    
    updateCursorCoords(x, y) {
        const coordsElement = document.getElementById('cursor-coords');
        if (coordsElement) {
            coordsElement.textContent = `X: ${x}, Y: ${y}`;
        }
    }
    
    handleCanvasClick(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;
        
        switch (this.currentTool) {
            case 'robot':
                this.levelData.robot = {x, y};
                break;
            case 'target':
                this.levelData.target = {x, y};
                break;
            case 'enemy':
                this.toggleEnemy(x, y);
                break;
            case 'obstacle':
                this.toggleObstacle(x, y);
                break;
            case 'erase':
                this.removeObject(x, y);
                break;
        }
        
        this.saveInitialState();
        this.render();
    }
    
    toggleEnemy(x, y) {
        const index = this.levelData.enemies.findIndex(e => e.x === x && e.y === y);
        if (index === -1) {
            this.levelData.enemies.push({x, y});
        } else {
            this.levelData.enemies.splice(index, 1);
        }
    }
    
    toggleObstacle(x, y) {
        const index = this.levelData.obstacles.findIndex(o => o.x === x && o.y === y);
        if (index === -1) {
            this.levelData.obstacles.push({x, y});
        } else {
            this.levelData.obstacles.splice(index, 1);
        }
    }
    
    removeObject(x, y) {
        this.levelData.enemies = this.levelData.enemies.filter(e => e.x !== x || e.y !== y);
        this.levelData.obstacles = this.levelData.obstacles.filter(o => o.x !== x || o.y !== y);
        
        if (this.levelData.robot.x === x && this.levelData.robot.y === y) {
            this.levelData.robot = {x: -1, y: -1};
        }
        
        if (this.levelData.target.x === x && this.levelData.target.y === y) {
            this.levelData.target = {x: -1, y: -1};
        }
    }
    
    saveInitialState() {
        this.levelData.initialState = {
            robot: {...this.levelData.robot},
            enemies: [...this.levelData.enemies],
            obstacles: [...this.levelData.obstacles]
        };
    }
    
    render() {
        // Очистка канваса
        this.ctx.fillStyle = '#8d6e63';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка сетки
        this.ctx.strokeStyle = 'rgba(93, 64, 55, 0.5)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridSize; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridSize; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
        
        // Отрисовка объектов
        this.levelData.obstacles.forEach(obstacle => {
            this.drawObstacle(obstacle.x, obstacle.y);
        });
        
        this.levelData.enemies.forEach(enemy => {
            this.drawEnemy(enemy.x, enemy.y);
        });
        
        if (this.levelData.target.x !== -1) {
            this.drawTarget(this.levelData.target.x, this.levelData.target.y);
        }
        
        if (this.levelData.robot.x !== -1) {
            this.drawRobot(this.levelData.robot.x, this.levelData.robot.y);
        }
    }
    
    drawRobot(x, y) {
        this.ctx.fillStyle = '#f5e8c8';
        this.ctx.fillRect(
            x * this.cellSize + 2,
            y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
        
        this.ctx.fillStyle = '#4fc3f7';
        this.ctx.fillRect(
            x * this.cellSize + 6,
            y * this.cellSize + 6,
            4,
            4
        );
        this.ctx.fillRect(
            x * this.cellSize + this.cellSize - 10,
            y * this.cellSize + 6,
            4,
            4
        );
    }
    
    drawTarget(x, y) {
        this.ctx.fillStyle = '#4caf50';
        this.ctx.fillRect(
            x * this.cellSize + 2,
            y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            x * this.cellSize + 2,
            y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
    }
    
    drawEnemy(x, y) {
        this.ctx.fillStyle = '#ef5350';
        this.ctx.beginPath();
        this.ctx.arc(
            x * this.cellSize + this.cellSize / 2,
            y * this.cellSize + this.cellSize / 2,
            this.cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    drawObstacle(x, y) {
        this.ctx.fillStyle = '#6d4c41';
        this.ctx.fillRect(
            x * this.cellSize + 1,
            y * this.cellSize + 1,
            this.cellSize - 2,
            this.cellSize - 2
        );
        
        this.ctx.strokeStyle = '#5d4037';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            x * this.cellSize + 1,
            y * this.cellSize + 1,
            this.cellSize - 2,
            this.cellSize - 2
        );
    }
    
    saveLevel() {
        if (!hasTeacherAccess()) {
            alert('Только учителя могут сохранять уровни');
            return;
        }
        
        if (!this.levelData.robot || this.levelData.robot.x === -1) {
            alert('Разместите робота на поле');
            return;
        }
        
        if (!this.levelData.target || this.levelData.target.x === -1) {
            alert('Разместите цель на поле');
            return;
        }
        
        const level = {
            ...this.levelData,
            id: Date.now().toString(),
            isCustom: true,
            author: 'teacher',
            program: [],
            completed: false,
            unlocked: true
        };
        
        gameState.userData.customLevels = gameState.userData.customLevels || [];
        gameState.userData.customLevels.push(level);
        saveToLocalStorage();
        
        alert(`Уровень "${level.title}" сохранен! Код для учеников: ${level.lessonCode}`);
    }
    
    clearLevel() {
        this.levelData = {
            title: 'Новый уровень',
            description: '',
            reward: 10,
            difficulty: 'easy',
            robot: {x: 1, y: 1},
            target: {x: 5, y: 5},
            enemies: [],
            obstacles: [],
            lessonCode: this.generateLessonCode(),
            initialState: null
        };
        
        document.getElementById('level-title').value = '';
        document.getElementById('level-description').value = '';
        document.getElementById('level-reward').value = 10;
        document.getElementById('level-difficulty').value = 'easy';
        
        this.saveInitialState();
        this.updateLessonCodeDisplay();
        this.render();
    }
    
    testLevel() {
        const testLevel = {
            ...this.levelData,
            program: [],
            completed: false,
            unlocked: true,
            isCustom: true
        };
        
        gameState.levels.push(testLevel);
        startLevel(gameState.levels.length - 1);
    }
}

// Редактор уроков
class LessonEditor {
    constructor() {
        this.lessonData = {
            title: 'Новый урок',
            description: '',
            levels: [],
            shareCode: this.generateShareCode()
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadAvailableLevels();
        this.updateShareCodeDisplay();
    }
    
    setupEventListeners() {
        const saveLessonBtn = document.getElementById('save-lesson-btn');
        const generateCodeBtn = document.getElementById('generate-lesson-code-btn');
        
        if (saveLessonBtn) {
            saveLessonBtn.addEventListener('click', () => this.saveLesson());
        }
        
        if (generateCodeBtn) {
            generateCodeBtn.addEventListener('click', () => this.generateNewShareCode());
        }
        
        const lessonTitle = document.getElementById('lesson-title');
        const lessonDescription = document.getElementById('lesson-description');
        
        if (lessonTitle) {
            lessonTitle.addEventListener('input', (e) => {
                this.lessonData.title = e.target.value;
            });
        }
        
        if (lessonDescription) {
            lessonDescription.addEventListener('input', (e) => {
                this.lessonData.description = e.target.value;
            });
        }
    }
    
    generateShareCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    generateNewShareCode() {
        this.lessonData.shareCode = this.generateShareCode();
        this.updateShareCodeDisplay();
    }
    
    updateShareCodeDisplay() {
        const shareCodeInput = document.getElementById('lesson-share-code');
        if (shareCodeInput) {
            shareCodeInput.value = this.lessonData.shareCode;
        }
    }
    
    loadAvailableLevels() {
        const availableLevelsContainer = document.getElementById('available-levels');
        if (!availableLevelsContainer) return;
        
        availableLevelsContainer.innerHTML = '';
        
        const allLevels = [...gameState.levels, ...(gameState.userData.customLevels || [])];
        
        allLevels.forEach(level => {
            const levelItem = document.createElement('div');
            levelItem.className = 'level-item';
            levelItem.innerHTML = `
                <span>${level.title}</span>
                <button class="small-button add-level-btn">➕</button>
            `;
            
            levelItem.querySelector('.add-level-btn').addEventListener('click', () => {
                this.addLevelToLesson(level);
            });
            
            availableLevelsContainer.appendChild(levelItem);
        });
    }
    
    addLevelToLesson(level) {
        if (!this.lessonData.levels.find(l => l.id === level.id)) {
            this.lessonData.levels.push(level);
            this.updateSelectedLevels();
        }
    }
    
    updateSelectedLevels() {
        const selectedLevelsContainer = document.getElementById('selected-levels');
        if (!selectedLevelsContainer) return;
        
        selectedLevelsContainer.innerHTML = '';
        
        this.lessonData.levels.forEach((level, index) => {
            const levelItem = document.createElement('div');
            levelItem.className = 'level-item';
            levelItem.innerHTML = `
                <span>${index + 1}. ${level.title}</span>
                <div>
                    <button class="small-button move-up-btn">⬆️</button>
                    <button class="small-button move-down-btn">⬇️</button>
                    <button class="small-button remove-level-btn">❌</button>
                </div>
            `;
            
            // Обработчики для кнопок управления
            levelItem.querySelector('.move-up-btn').addEventListener('click', () => {
                if (index > 0) {
                    [this.lessonData.levels[index-1], this.lessonData.levels[index]] = 
                    [this.lessonData.levels[index], this.lessonData.levels[index-1]];
                    this.updateSelectedLevels();
                }
            });
            
            levelItem.querySelector('.move-down-btn').addEventListener('click', () => {
                if (index < this.lessonData.levels.length - 1) {
                    [this.lessonData.levels[index], this.lessonData.levels[index+1]] = 
                    [this.lessonData.levels[index+1], this.lessonData.levels[index]];
                    this.updateSelectedLevels();
                }
            });
            
            levelItem.querySelector('.remove-level-btn').addEventListener('click', () => {
                this.lessonData.levels.splice(index, 1);
                this.updateSelectedLevels();
            });
            
            selectedLevelsContainer.appendChild(levelItem);
        });
    }
    
    saveLesson() {
        if (!hasTeacherAccess()) {
            alert('Только учителя могут сохранять уроки');
            return;
        }
        
        if (this.lessonData.levels.length === 0) {
            alert('Добавьте хотя бы один уровень в урок');
            return;
        }
        
        if (!this.lessonData.title.trim()) {
            alert('Введите название урока');
            return;
        }
        
        const lesson = {
            ...this.lessonData,
            id: Date.now().toString(),
            isCustom: true,
            created: new Date().toISOString(),
            teacherId: gameState.userData.teacherId
        };
        
        gameState.userData.customLessons = gameState.userData.customLessons || [];
        gameState.userData.customLessons.push(lesson);
        saveToLocalStorage();
        
        alert(`Урок "${lesson.title}" сохранен! Код для учеников: ${lesson.shareCode}`);
        this.clearLesson();
    }
    
    clearLesson() {
        this.lessonData = {
            title: 'Новый урок',
            description: '',
            levels: [],
            shareCode: this.generateShareCode()
        };
        
        const lessonTitle = document.getElementById('lesson-title');
        const lessonDescription = document.getElementById('lesson-description');
        
        if (lessonTitle) lessonTitle.value = '';
        if (lessonDescription) lessonDescription.value = '';
        
        this.updateShareCodeDisplay();
        this.updateSelectedLevels();
    }
}

// Инициализация мастерской
function initWorkshop() {
    if (!hasTeacherAccess()) {
        alert('Мастерская доступна только в режиме учителя');
        showScreen('teacher-menu');
        return;
    }
    
    // Инициализация редактора уровней
    window.levelEditor = new LevelEditor();
    
    // Инициализация редактора уроков
    window.lessonEditor = new LessonEditor();
    
    // Обработчики вкладок
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            e.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            if (tabName === 'my-levels') {
                renderMyLevels();
            } else if (tabName === 'my-lessons') {
                renderMyLessons();
            }
        });
    });
    
    // Кнопки управления уроками
    const shareLessonBtn = document.getElementById('share-lesson-btn');
    const viewStatsBtn = document.getElementById('view-stats-btn');
    
    if (shareLessonBtn) {
        shareLessonBtn.addEventListener('click', shareLesson);
    }
    
    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', viewLessonStats);
    }
    
    // Кнопка назад
    const workshopBackBtn = document.getElementById('workshop-back-btn');
    if (workshopBackBtn) {
        workshopBackBtn.addEventListener('click', () => {
            showScreen('teacher-menu');
        });
    }
}

// Рендер моих уровней
function renderMyLevels() {
    const container = document.getElementById('my-levels-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const customLevels = gameState.userData.customLevels || [];
    
    if (customLevels.length === 0) {
        container.innerHTML = '<p class="parchment">У вас пока нет созданных уровней</p>';
        return;
    }
    
    customLevels.forEach((level, index) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.innerHTML = `
            <div class="level-number">${index + 1}</div>
            <div class="level-title">${level.title}</div>
            <div class="level-description">${level.description}</div>
            <div style="position:absolute; bottom:10px; color:#ffd54f;">Награда: ${level.reward} 🪙</div>
            <div style="position:absolute; top:10px; right:10px; color:#64b5f6;">Код: ${level.lessonCode}</div>
        `;
        
        card.addEventListener('click', () => {
            const playLevel = {
                ...level,
                program: [],
                completed: false,
                unlocked: true
            };
            
            gameState.levels.push(playLevel);
            startLevel(gameState.levels.length - 1);
        });
        
        container.appendChild(card);
    });
}

// Рендер моих уроков
function renderMyLessons() {
    const container = document.getElementById('my-lessons-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const customLessons = gameState.userData.customLessons || [];
    
    if (customLessons.length === 0) {
        container.innerHTML = '<p class="parchment">У вас пока нет созданных уроков</p>';
        return;
    }
    
    customLessons.forEach((lesson, index) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.innerHTML = `
            <div class="level-number">${index + 1}</div>
            <div class="level-title">${lesson.title}</div>
            <div class="level-description">${lesson.description}</div>
            <div class="level-stats">Уровней: ${lesson.levels.length}</div>
            <div style="position:absolute; bottom:10px; color:#64b5f6;">Код: ${lesson.shareCode}</div>
        `;
        
        container.appendChild(card);
    });
}

// Функции для работы с уроками
function shareLesson() {
    if (!hasTeacherAccess()) {
        alert('Только учителя могут делиться уроками');
        return;
    }
    
    alert('Функция отправки урока ученикам будет реализована в будущем');
}

function viewLessonStats() {
    if (!hasTeacherAccess()) {
        alert('Только учителя могут просматривать статистику');
        return;
    }
    
    alert('Функция просмотра статистики будет реализована в будущем');
}
