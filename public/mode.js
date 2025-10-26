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
const users = {
    teachers: [],
    students: []
};

function showAuthScreen() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div>
            <h1>Школьная платформа</h1>
            <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
                <h2>Вход</h2>
                <input type="text" id="login-username" placeholder="Никнейм" style="display: block; margin: 10px 0; padding: 5px;">
                <input type="password" id="login-password" placeholder="Пароль" style="display: block; margin: 10px 0; padding: 5px;">
                <button onclick="login()">Войти</button>
            </div>
            
            <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
                <h2>Регистрация</h2>
                <input type="text" id="reg-username" placeholder="Никнейм" style="display: block; margin: 10px 0; padding: 5px;">
                <input type="password" id="reg-password" placeholder="Пароль" style="display: block; margin: 10px 0; padding: 5px;">
                <select id="user-type" style="display: block; margin: 10px 0; padding: 5px;">
                    <option value="student">Ученик</option>
                    <option value="teacher">Учитель</option>
                </select>
                <button onclick="register()">Зарегистрироваться</button>
            </div>
            
            <div id="auth-message" style="color: red; margin: 10px 0;"></div>
        </div>
    `;
}

function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const userType = document.getElementById('user-type').value;
    
    if (!username || !password) {
        showAuthMessage('Заполните все поля!');
        return;
    }
    
    if (username.length < 3) {
        showAuthMessage('Никнейм должен быть не менее 3 символов');
        return;
    }
    
    if (password.length < 4) {
        showAuthMessage('Пароль должен быть не менее 4 символов');
        return;
    }
    
    // Проверяем, существует ли пользователь
    const allUsers = [...users.teachers, ...users.students];
    if (allUsers.find(u => u.username === username)) {
        showAuthMessage('Пользователь с таким ником уже существует!');
        return;
    }
    
    const newUser = {
        username: username,
        password: password, // В реальном приложении пароль должен быть хеширован!
        type: userType,
        registeredAt: new Date().toISOString()
    };
    
    if (userType === 'teacher') {
        users.teachers.push(newUser);
    } else {
        users.students.push(newUser);
        // Добавляем начальные данные для ученика
        newUser.score = 0;
        newUser.upgradePoints = 0;
        newUser.playerStats = {speed: 1, jump: 1, health: 1};
        newUser.levels = JSON.parse(JSON.stringify(levels));
    }
    
    saveUsers();
    showAuthMessage('Регистрация успешна! Теперь войдите в систему.', 'green');
    
    // Очищаем поля
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showAuthMessage('Заполните все поля!');
        return;
    }
    
    const allUsers = [...users.teachers, ...users.students];
    const user = allUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
        showAuthMessage('Неверный никнейм или пароль!');
        return;
    }
    
    currentUser = user;
    isTeacher = user.type === 'teacher';
    
    if (isTeacher) {
        showTeacherPanel();
    } else {
        // Загружаем данные ученика
        score = user.score || 0;
        upgradePoints = user.upgradePoints || 0;
        playerStats = user.playerStats || {speed: 1, jump: 1, health: 1};
        if (user.levels) {
            levels.forEach((level, index) => {
                if (user.levels[index]) {
                    level.completed = user.levels[index].completed || false;
                    level.stars = user.levels[index].stars || 0;
                }
            });
        }
        showMainMenu();
    }
    
    saveCurrentUser();
    showAuthMessage(''); // Очищаем сообщение
}

function showTeacherPanel() {
    const screen = document.getElementById('screen');
    const studentsList = users.students.map(student => `
        <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
            <h3>${student.username}</h3>
            <p>Очки: ${student.score || 0}</p>
            <p>Зарегистрирован: ${new Date(student.registeredAt).toLocaleDateString()}</p>
            <button onclick="viewStudentProgress('${student.username}')">Посмотреть прогресс</button>
        </div>
    `).join('');
    
    screen.innerHTML = `
        <div>
            <h1>Панель учителя</h1>
            <p>Добро пожаловать, ${currentUser.username}!</p>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0;">
                <h2>Список учеников</h2>
                ${studentsList.length > 0 ? studentsList : '<p>Нет зарегистрированных учеников</p>'}
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0;">
                <h2>Управление</h2>
                <button onclick="addTestAssignment()">Добавить задание</button>
                <button onclick="viewClassStatistics()">Статистика класса</button>
            </div>
            
            <button onclick="logout()" style="background: #ff4444; margin-top: 20px;">Выйти</button>
        </div>
    `;
}

function viewStudentProgress(studentUsername) {
    const student = users.students.find(s => s.username === studentUsername);
    if (!student) return;
    
    const screen = document.getElementById('screen');
    const levelsProgress = student.levels ? student.levels.map(level => `
        <div style="margin: 5px 0;">
            ${level.name}: ${level.completed ? 'Пройден' : 'Не пройден'} 
            ${level.completed ? `(★ ${level.stars}/3)` : ''}
        </div>
    `).join('') : '<p>Нет данных о прогрессе</p>';
    
    screen.innerHTML = `
        <div>
            <h2>Прогресс ученика: ${student.username}</h2>
            <p><strong>Очки:</strong> ${student.score || 0}</p>
            <p><strong>Очки улучшений:</strong> ${student.upgradePoints || 0}</p>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0;">
                <h3>Прогресс по уровням:</h3>
                ${levelsProgress}
            </div>
            
            <div style="border: 1px solid #ccc; padding: 15px; margin: 15px 0;">
                <h3>Характеристики:</h3>
                <p>Скорость: ${student.playerStats?.speed || 1}</p>
                <p>Прыжок: ${student.playerStats?.jump || 1}</p>
                <p>Здоровье: ${student.playerStats?.health || 1}</p>
            </div>
            
            <button onclick="showTeacherPanel()">Назад к панели</button>
        </div>
    `;
}

function addTestAssignment() {
    const assignmentName = prompt('Введите название задания:');
    if (assignmentName) {
        alert(`Задание "${assignmentName}" добавлено!`);
        // Здесь можно добавить логику сохранения задания
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
    
    alert(`Статистика класса:
Учеников: ${totalStudents}
Средний балл: ${Math.round(avgScore)}
Всего пройденных уровней: ${completedLevels}`);
}

function logout() {
    currentUser = null;
    isTeacher = false;
    saveCurrentUser();
    showAuthScreen();
}

function showAuthMessage(message, color = 'red') {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.style.color = color;
    }
}

// Обновленная функция главного меню с учетом авторизации
function showMainMenu() {
    const screen = document.getElementById('screen');
    screen.innerHTML = `
        <div>
            <h1>Главное меню</h1>
            <p>Добро пожаловать, ${currentUser.username}!</p>
            <button onclick="startGame()">Начать игру</button>
            <button onclick="showLevelSelect()">Выбор уровня</button>
            <button onclick="showShop()">Магазин</button>
            <button onclick="showWorkshop()">Мастерская</button>
            <button onclick="showScoreShop()">Магазин оценок</button>
            <button onclick="showSettings()">Настройки</button>
            <button onclick="logout()" style="background: #ff4444; margin-top: 20px;">Выйти</button>
        </div>
    `;
}

// Остальные функции (showLevelSelect, showShop, showWorkshop, etc.) остаются такими же, 
// но с небольшими изменениями для сохранения данных пользователя

// Обновляем функции сохранения для работы с системой пользователей
function saveGame() {
    if (!isTeacher && currentUser) {
        // Обновляем данные текущего пользователя
        currentUser.score = score;
        currentUser.upgradePoints = upgradePoints;
        currentUser.playerStats = playerStats;
        currentUser.levels = levels;
        
        // Обновляем в общем списке пользователей
        const userIndex = users.students.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users.students[userIndex] = currentUser;
        }
        
        saveUsers();
    }
    
    const gameData = {
        score: score,
        upgradePoints: upgradePoints,
        playerStats: playerStats,
        levels: levels,
        currentLevel: currentLevel
    };
    localStorage.setItem('gameSave', JSON.stringify(gameData));
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
        const parsed = JSON.parse(savedUsers);
        users.teachers = parsed.teachers || [];
        users.students = parsed.students || [];
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

// Обновленная функция completeLevel для сохранения прогресса ученика
function completeLevel(levelIndex) {
    levels[levelIndex].completed = true;
    levels[levelIndex].stars = Math.min(3, levels[levelIndex].stars + 1);
    score += 50;
    upgradePoints += 5;
    saveGame();
    showLevelSelect();
}

// Обновленная инициализация
window.addEventListener('load', function() {
    loadUsers();
    
    if (loadCurrentUser()) {
        if (isTeacher) {
            showTeacherPanel();
        } else {
            // Загружаем данные ученика
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
        showAuthScreen();
    }
});

// Остальные функции (showLevelSelect, showShop, showWorkshop, showScoreShop, upgradeStat, buyGrade, etc.)
// остаются без изменений из предыдущего кода, но теперь они автоматически сохраняют данные через saveGame()
