let score = 0;
let currentLevel = 0;
let upgradePoints = 0;
let playerStats = {
    speed: 1,
    jump: 1,
    health: 1
};
let currentUser = null;
let isTeacher = false;

const levels = [
    {
        name: "Уровень 1",
        difficulty: "easy",
        completed: false,
        stars: 0
    },
    {
        name: "Уровень 2", 
        difficulty: "easy",
        completed: false,
        stars: 0
    },
    {
        name: "Уровень 3",
        difficulty: "medium",
        completed: false,
        stars: 0
    }
];

// Система пользователей
let users = {
    teachers: [],
    students: []
};

// ПЕРВЫЙ ЭКРАН - ВЫБОР РЕЖИМА
function showModeSelection() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h1>Школьная платформа</h1>
            <div style="margin: 40px 0;">
                <button 
                    onclick="showTeacherAuth()" 
                    style="font-size: 24px; padding: 20px 40px; margin: 20px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer;"
                >
                    👨‍🏫 Режим учителя
                </button>
                <br>
                <button 
                    onclick="showStudentAuth()" 
                    style="font-size: 24px; padding: 20px 40px; margin: 20px; background: #2196F3; color: white; border: none; border-radius: 10px; cursor: pointer;"
                >
                    👨‍🎓 Режим ученика
                </button>
            </div>
        </div>
    `;
}

// АВТОРИЗАЦИЯ УЧИТЕЛЯ
function showTeacherAuth() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
            <h1>👨‍🏫 Режим учителя</h1>
            
            <div style="border: 2px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>Вход для учителей</h2>
                <input type="text" id="teacher-username" placeholder="Никнейм" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <input type="password" id="teacher-password" placeholder="Пароль" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <button onclick="teacherLogin()" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                    Войти
                </button>
            </div>
            
            <div style="border: 2px solid #FF9800; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>Регистрация учителя</h2>
                <input type="text" id="teacher-reg-username" placeholder="Никнейм" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <input type="password" id="teacher-reg-password" placeholder="Пароль" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <button onclick="teacherRegister()" style="width: 100%; padding: 12px; background: #FF9800; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                    Зарегистрироваться
                </button>
            </div>
            
            <div id="teacher-message" style="color: red; margin: 10px 0; text-align: center;"></div>
            
            <button onclick="showModeSelection()" style="width: 100%; padding: 12px; background: #666; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад к выбору режима
            </button>
        </div>
    `;
}

// АВТОРИЗАЦИЯ УЧЕНИКА
function showStudentAuth() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; padding: 20px;">
            <h1>👨‍🎓 Режим ученика</h1>
            
            <div style="border: 2px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>Вход для учеников</h2>
                <input type="text" id="student-username" placeholder="Никнейм" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <input type="password" id="student-password" placeholder="Пароль" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <button onclick="studentLogin()" style="width: 100%; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                    Войти
                </button>
            </div>
            
            <div style="border: 2px solid #9C27B0; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>Регистрация ученика</h2>
                <input type="text" id="student-reg-username" placeholder="Никнейм" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <input type="password" id="student-reg-password" placeholder="Пароль" style="display: block; width: 100%; margin: 10px 0; padding: 10px; font-size: 16px;">
                <button onclick="studentRegister()" style="width: 100%; padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                    Зарегистрироваться
                </button>
            </div>
            
            <div id="student-message" style="color: red; margin: 10px 0; text-align: center;"></div>
            
            <button onclick="showModeSelection()" style="width: 100%; padding: 12px; background: #666; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад к выбору режима
            </button>
        </div>
    `;
}

// РЕГИСТРАЦИЯ УЧИТЕЛЯ
function teacherRegister() {
    const username = document.getElementById('teacher-reg-username').value.trim();
    const password = document.getElementById('teacher-reg-password').value;
    
    if (!username || !password) {
        showTeacherMessage('Заполните все поля!');
        return;
    }
    
    if (username.length < 3) {
        showTeacherMessage('Никнейм должен быть не менее 3 символов');
        return;
    }
    
    if (password.length < 4) {
        showTeacherMessage('Пароль должен быть не менее 4 символов');
        return;
    }
    
    // Проверяем, существует ли учитель
    if (users.teachers.find(u => u.username === username)) {
        showTeacherMessage('Учитель с таким ником уже существует!');
        return;
    }
    
    const newTeacher = {
        username: username,
        password: password,
        type: 'teacher',
        registeredAt: new Date().toISOString()
    };
    
    users.teachers.push(newTeacher);
    saveUsers();
    
    showTeacherMessage('Регистрация успешна! Теперь войдите в систему.', 'green');
    
    // Очищаем поля
    document.getElementById('teacher-reg-username').value = '';
    document.getElementById('teacher-reg-password').value = '';
}

// ВХОД УЧИТЕЛЯ
function teacherLogin() {
    const username = document.getElementById('teacher-username').value.trim();
    const password = document.getElementById('teacher-password').value;
    
    if (!username || !password) {
        showTeacherMessage('Заполните все поля!');
        return;
    }
    
    const teacher = users.teachers.find(u => u.username === username && u.password === password);
    
    if (!teacher) {
        showTeacherMessage('Неверный никнейм или пароль!');
        return;
    }
    
    currentUser = teacher;
    isTeacher = true;
    saveCurrentUser();
    showTeacherPanel();
}

// РЕГИСТРАЦИЯ УЧЕНИКА
function studentRegister() {
    const username = document.getElementById('student-reg-username').value.trim();
    const password = document.getElementById('student-reg-password').value;
    
    if (!username || !password) {
        showStudentMessage('Заполните все поля!');
        return;
    }
    
    if (username.length < 3) {
        showStudentMessage('Никнейм должен быть не менее 3 символов');
        return;
    }
    
    if (password.length < 4) {
        showStudentMessage('Пароль должен быть не менее 4 символов');
        return;
    }
    
    // Проверяем, существует ли ученик
    if (users.students.find(u => u.username === username)) {
        showStudentMessage('Ученик с таким ником уже существует!');
        return;
    }
    
    const newStudent = {
        username: username,
        password: password,
        type: 'student',
        score: 0,
        upgradePoints: 0,
        playerStats: {speed: 1, jump: 1, health: 1},
        levels: JSON.parse(JSON.stringify(levels)),
        registeredAt: new Date().toISOString()
    };
    
    users.students.push(newStudent);
    saveUsers();
    
    showStudentMessage('Регистрация успешна! Теперь войдите в систему.', 'green');
    
    // Очищаем поля
    document.getElementById('student-reg-username').value = '';
    document.getElementById('student-reg-password').value = '';
}

// ВХОД УЧЕНИКА
function studentLogin() {
    const username = document.getElementById('student-username').value.trim();
    const password = document.getElementById('student-password').value;
    
    if (!username || !password) {
        showStudentMessage('Заполните все поля!');
        return;
    }
    
    const student = users.students.find(u => u.username === username && u.password === password);
    
    if (!student) {
        showStudentMessage('Неверный никнейм или пароль!');
        return;
    }
    
    currentUser = student;
    isTeacher = false;
    
    // Загружаем данные ученика
    score = student.score || 0;
    upgradePoints = student.upgradePoints || 0;
    playerStats = student.playerStats || {speed: 1, jump: 1, health: 1};
    if (student.levels) {
        levels.forEach((level, index) => {
            if (student.levels[index]) {
                level.completed = student.levels[index].completed || false;
                level.stars = student.levels[index].stars || 0;
            }
        });
    }
    
    saveCurrentUser();
    showMainMenu();
}

// ПАНЕЛЬ УЧИТЕЛЯ
function showTeacherPanel() {
    const screen = document.getElementById('screen');
    const studentsList = users.students.map(student => `
        <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h3>${student.username}</h3>
            <p><strong>Очки:</strong> ${student.score || 0}</p>
            <p><strong>Зарегистрирован:</strong> ${new Date(student.registeredAt).toLocaleDateString()}</p>
            <button onclick="viewStudentProgress('${student.username}')" style="padding: 8px 15px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Посмотреть прогресс
            </button>
        </div>
    `).join('');
    
    screen.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>👨‍🏫 Панель учителя</h1>
            <p style="font-size: 18px;">Добро пожаловать, <strong>${currentUser.username}</strong>!</p>
            
            <div style="border: 2px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>📊 Список учеников</h2>
                ${studentsList.length > 0 ? studentsList : '<p>Нет зарегистрированных учеников</p>'}
            </div>
            
            <div style="border: 2px solid #FF9800; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h2>⚙️ Управление</h2>
                <button onclick="addTestAssignment()" style="padding: 10px 20px; margin: 5px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Добавить задание
                </button>
                <button onclick="viewClassStatistics()" style="padding: 10px 20px; margin: 5px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Статистика класса
                </button>
            </div>
            
            <button onclick="logout()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                🚪 Выйти
            </button>
        </div>
    `;
}

// ГЛАВНОЕ МЕНЮ УЧЕНИКА
function showMainMenu() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h1>🎮 Главное меню</h1>
            <p style="font-size: 18px;">Добро пожаловать, <strong>${currentUser.username}</strong>!</p>
            <p>Очки: <strong>${score}</strong> | Очки улучшений: <strong>${upgradePoints}</strong></p>
            
            <div style="margin: 30px 0;">
                <button onclick="startGame()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    🎯 Начать игру
                </button>
                <button onclick="showLevelSelect()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    📋 Выбор уровня
                </button>
                <button onclick="showShop()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #FF9800; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    🏪 Магазин
                </button>
                <button onclick="showWorkshop()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #9C27B0; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    🔧 Мастерская
                </button>
                <button onclick="showScoreShop()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #E91E63; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    📊 Магазин оценок
                </button>
                <button onclick="showSettings()" style="display: block; width: 100%; padding: 15px; margin: 10px 0; font-size: 18px; background: #607D8B; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ⚙️ Настройки
                </button>
            </div>
            
            <button onclick="logout()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                🚪 Выйти
            </button>
        </div>
    `;
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function showTeacherMessage(message, color = 'red') {
    const messageEl = document.getElementById('teacher-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.style.color = color;
    }
}

function showStudentMessage(message, color = 'red') {
    const messageEl = document.getElementById('student-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.style.color = color;
    }
}

function logout() {
    currentUser = null;
    isTeacher = false;
    saveCurrentUser();
    showModeSelection();
}

// ОСТАЛЬНЫЕ ФУНКЦИИ (без изменений)
function startGame() {
    currentLevel = 0;
    loadLevel(currentLevel);
}

function showLevelSelect() {
    const screen = document.getElementById('screen');
    let levelsHTML = '';
    
    levels.forEach((level, index) => {
        levelsHTML += `
            <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <h3>${level.name}</h3>
                <p>Сложность: ${level.difficulty}</p>
                <p>Статус: ${level.completed ? '✅ Пройден' : '❌ Не пройден'}</p>
                <p>Звёзды: ${'★'.repeat(level.stars)}${'☆'.repeat(3-level.stars)}</p>
                <button onclick="loadLevel(${index})" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Играть
                </button>
            </div>
        `;
    });
    
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>🎯 Выбор уровня</h2>
            ${levelsHTML}
            <button onclick="showMainMenu()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад
            </button>
        </div>
    `;
}

function showShop() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2>🏪 Магазин</h2>
            <p>Скоро здесь появятся предметы для покупки!</p>
            <button onclick="showMainMenu()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад
            </button>
        </div>
    `;
}

function showWorkshop() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>🔧 Мастерская</h2>
            <p>Очки улучшения: <strong id="upgrade-points">${upgradePoints}</strong></p>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>🏃 Скорость</h3>
                <p>Уровень: <strong id="speed-level">${playerStats.speed}</strong></p>
                <button onclick="upgradeStat('speed')" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Улучшить (10 очков)
                </button>
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>🦘 Прыжок</h3>
                <p>Уровень: <strong id="jump-level">${playerStats.jump}</strong></p>
                <button onclick="upgradeStat('jump')" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Улучшить (10 очков)
                </button>
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>❤️ Прочность</h3>
                <p>Уровень: <strong id="health-level">${playerStats.health}</strong></p>
                <button onclick="upgradeStat('health')" style="padding: 10px 20px; background: #E91E63; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Улучшить (15 очков)
                </button>
            </div>
            
            <button onclick="showMainMenu()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад
            </button>
        </div>
    `;
}

function showScoreShop() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>📊 Магазин оценок</h2>
            <p>Ваши очки: <strong id="score-points">${score}</strong></p>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>🎯 Оценка 5</h3>
                <p>Стоимость: 100 очков</p>
                <button onclick="buyGrade(5)" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Купить
                </button>
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>📗 Оценка 4</h3>
                <p>Стоимость: 75 очков</p>
                <button onclick="buyGrade(4)" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Купить
                </button>
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>📘 Оценка 3</h3>
                <p>Стоимость: 50 очков</p>
                <button onclick="buyGrade(3)" style="padding: 10px 20px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Купить
                </button>
            </div>
            
            <button onclick="showMainMenu()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад
            </button>
        </div>
    `;
}

function showSettings() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2>⚙️ Настройки</h2>
            <p>Настройки звука, графики и управления появятся здесь скоро!</p>
            <button onclick="showMainMenu()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                ← Назад
            </button>
        </div>
    `;
}

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2>🎮 Уровень ${levelIndex + 1} - ${levels[levelIndex].name}</h2>
            <p>Сложность: ${levels[levelIndex].difficulty}</p>
            
            <div style="border: 2px solid #ccc; padding: 20px; margin: 20px 0; border-radius: 10px;">
                <h3>🎯 Игровой процесс</h3>
                <p>Здесь будет ваша игра!</p>
                <p>Управление: ← → для движения, ПРОБЕЛ для прыжка</p>
            </div>
            
            <button onclick="completeLevel(${levelIndex})" style="padding: 12px 25px; background: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                ✅ Завершить уровень (тест)
            </button>
            <br>
            <button onclick="showLevelSelect()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 10px;">
                🚪 Выйти в меню
            </button>
        </div>
    `;
}

function completeLevel(levelIndex) {
    levels[levelIndex].completed = true;
    levels[levelIndex].stars = Math.min(3, levels[levelIndex].stars + 1);
    score += 50;
    upgradePoints += 5;
    saveGame();
    alert(`🎉 Уровень ${levelIndex + 1} пройден!\n+50 очков\n+5 очков улучшения`);
    showLevelSelect();
}

function upgradeStat(stat) {
    const cost = stat === 'health' ? 15 : 10;
    
    if (upgradePoints >= cost) {
        upgradePoints -= cost;
        playerStats[stat]++;
        updateWorkshopDisplay();
        saveGame();
        alert(`✅ ${stat === 'speed' ? 'Скорость' : stat === 'jump' ? 'Прыжок' : 'Прочность'} улучшена до уровня ${playerStats[stat]}!`);
    } else {
        alert('❌ Недостаточно очков улучшения!');
    }
}

function updateWorkshopDisplay() {
    const upgradePointsEl = document.getElementById('upgrade-points');
    const speedLevelEl = document.getElementById('speed-level');
    const jumpLevelEl = document.getElementById('jump-level');
    const healthLevelEl = document.getElementById('health-level');
    
    if (upgradePointsEl) upgradePointsEl.textContent = upgradePoints;
    if (speedLevelEl) speedLevelEl.textContent = playerStats.speed;
    if (jumpLevelEl) jumpLevelEl.textContent = playerStats.jump;
    if (healthLevelEl) healthLevelEl.textContent = playerStats.health;
}

function buyGrade(grade) {
    const costs = {3: 50, 4: 75, 5: 100};
    const cost = costs[grade];
    
    if (score >= cost) {
        score -= cost;
        alert(`🎉 Вы купили оценку ${grade}!`);
        updateScoreShopDisplay();
        saveGame();
    } else {
        alert('❌ Недостаточно очков!');
    }
}

function updateScoreShopDisplay() {
    const scorePointsEl = document.getElementById('score-points');
    if (scorePointsEl) {
        scorePointsEl.textContent = score;
    }
}

function viewStudentProgress(studentUsername) {
    const student = users.students.find(s => s.username === studentUsername);
    if (!student) return;
    
    const screen = document.getElementById('screen');
    const levelsProgress = student.levels ? student.levels.map(level => `
        <div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 5px;">
            ${level.name}: ${level.completed ? '✅ Пройден' : '❌ Не пройден'} 
            ${level.completed ? `(★ ${level.stars}/3)` : ''}
        </div>
    `).join('') : '<p>Нет данных о прогрессе</p>';
    
    screen.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>📊 Прогресс ученика: ${student.username}</h2>
            
            <div style="border: 2px solid #2196F3; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>📈 Общая статистика</h3>
                <p><strong>Очки:</strong> ${student.score || 0}</p>
                <p><strong>Очки улучшений:</strong> ${student.upgradePoints || 0}</p>
            </div>
            
            <div style="border: 2px solid #4CAF50; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>🎯 Прогресс по уровням:</h3>
                ${levelsProgress}
            </div>
            
            <div style="border: 2px solid #9C27B0; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3>⚡ Характеристики:</h3>
                <p>🏃 Скорость: ${student.playerStats?.speed || 1}</p>
                <p>🦘 Прыжок: ${student.playerStats?.jump || 1}</p>
                <p>❤️ Здоровье: ${student.playerStats?.health || 1}</p>
            </div>
            
            <button onclick="showTeacherPanel()" style="padding: 12px 25px; background: #ff4444; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                ← Назад к панели
            </button>
        </div>
    `;
}

function addTestAssignment() {
    const assignmentName = prompt('Введите название задания:');
    if (assignmentName) {
        alert(`✅ Задание "${assignmentName}" добавлено!`);
    }
}

function viewClassStatistics() {
    const totalStudents = users.students.length;
    const avgScore = totalStudents > 0 
        ? users.students.reduce((sum, student) => sum + (student.score || 0), 0) / totalStudents 
        : 0;
    
    const completedLevels = users.students.reduce((sum, student) => {
        if (!student.levels) return sum;
        return sum + student.levels.filter(level => level.completed).length;
    }, 0);
    
    alert(`📊 Статистика класса:
👨‍🎓 Учеников: ${totalStudents}
📈 Средний балл: ${Math.round(avgScore)}
🎯 Всего пройденных уровней: ${completedLevels}`);
}

// СИСТЕМА СОХРАНЕНИЯ
function saveGame() {
    if (!isTeacher && currentUser) {
        currentUser.score = score;
        currentUser.upgradePoints = upgradePoints;
        currentUser.playerStats = playerStats;
        currentUser.levels = levels;
        
        const userIndex = users.students.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users.students[userIndex] = currentUser;
        }
        
        saveUsers();
    }
    
    localStorage.setItem('gameSave', JSON.stringify({
        score: score,
        upgradePoints: upgradePoints,
        playerStats: playerStats,
        levels: levels,
        currentLevel: currentLevel
    }));
}

function saveUsers() {
    localStorage.setItem('schoolUsers', JSON.stringify(users));
}

function saveCurrentUser() {
    localStorage.setItem('currentSchoolUser', JSON.stringify(currentUser));
}

function loadUsers() {
    const savedUsers = localStorage.getItem('schoolUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

function loadCurrentUser() {
    const savedUser = localStorage.getItem('currentSchoolUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isTeacher = currentUser.type === 'teacher';
        return true;
    }
    return false;
}

// ИНИЦИАЛИЗАЦИЯ
window.addEventListener('load', function() {
    loadUsers();
    
    if (loadCurrentUser()) {
        if (isTeacher) {
            showTeacherPanel();
        } else {
            score = currentUser.score || 0;
            upgradePoints = currentUser.upgradePoints || 0;
            playerStats = currentUser.playerStats || {speed: 1, jump: 1, health: 1};
            if (currentUser.levels) {
                levels.forEach((level, index) => {
                    if (currentUser.levels[index]) {
                        level.completed = currentUser.levels[index].completed || false;
                        level.stars = currentUser.levels[index].stars || 0;
                    }
                });
            }
            showMainMenu();
        }
    } else {
        showModeSelection();
    }
});
