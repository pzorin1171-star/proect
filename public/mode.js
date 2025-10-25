// Режимы пользователя
const UserMode = {
    TEACHER: 'teacher',
    STUDENT: 'student'
};

let currentMode = null;

// Инициализация режимов
function initModeSelection() {
    // Кнопки выбора режима
    const teacherModeBtn = document.getElementById('teacher-mode-btn');
    const studentModeBtn = document.getElementById('student-mode-btn');
    
    // Кнопки возврата к выбору режима
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const backToModeBtnStudent = document.getElementById('back-to-mode-btn-student');
    
    // Экраны
    const modeSelectionScreen = document.getElementById('mode-selection');
    const teacherMenuScreen = document.getElementById('teacher-menu');
    const studentMenuScreen = document.getElementById('student-menu');
    
    // Обработчики выбора режима
    teacherModeBtn.addEventListener('click', () => {
        currentMode = UserMode.TEACHER;
        showTeacherMenu();
    });
    
    studentModeBtn.addEventListener('click', () => {
        currentMode = UserMode.STUDENT;
        showStudentMenu();
    });
    
    // Обработчики возврата к выбору режима
    backToModeBtn.addEventListener('click', showModeSelection);
    backToModeBtnStudent.addEventListener('click', showModeSelection);
    
    // Инициализация кнопок ученика
    initStudentMode();
}

// Показать экран выбора режима
function showModeSelection() {
    hideAllScreens();
    document.getElementById('mode-selection').classList.remove('hidden');
}

// Показать меню учителя
function showTeacherMenu() {
    hideAllScreens();
    document.getElementById('teacher-menu').classList.remove('hidden');
    
    // Инициализация кнопок учителя
    initTeacherMode();
}

// Показать меню ученика
function showStudentMenu() {
    hideAllScreens();
    document.getElementById('student-menu').classList.remove('hidden');
}

// Инициализация режима учителя
function initTeacherMode() {
    const teacherLevelsBtn = document.getElementById('teacher-levels-btn');
    const teacherLessonsBtn = document.getElementById('teacher-lessons-btn');
    const workshopBtn = document.getElementById('workshop-btn');
    const shopBtn = document.getElementById('shop-btn');
    const teacherTutorialBtn = document.getElementById('teacher-tutorial-btn');
    
    teacherLevelsBtn.addEventListener('click', () => showScreen('levels'));
    teacherLessonsBtn.addEventListener('click', () => showScreen('lessons'));
    workshopBtn.addEventListener('click', () => showScreen('workshop'));
    shopBtn.addEventListener('click', () => showScreen('shop'));
    teacherTutorialBtn.addEventListener('click', () => showScreen('tutorial'));
}

// Инициализация режима ученика
function initStudentMode() {
    const studentLevelsBtn = document.getElementById('student-levels-btn');
    const joinLessonBtn = document.getElementById('join-lesson-btn');
    const studentTutorialBtn = document.getElementById('student-tutorial-btn');
    
    studentLevelsBtn.addEventListener('click', () => showScreen('levels'));
    joinLessonBtn.addEventListener('click', () => showScreen('join-lesson'));
    studentTutorialBtn.addEventListener('click', () => showScreen('tutorial'));
    
    // Инициализация подключения к уроку
    initJoinLesson();
}

// Инициализация подключения к уроку
function initJoinLesson() {
    const connectLessonBtn = document.getElementById('connect-lesson-btn');
    const joinLessonBackBtn = document.getElementById('join-lesson-back-btn');
    const lessonCodeInput = document.getElementById('lesson-code');
    
    connectLessonBtn.addEventListener('click', () => {
        const code = lessonCodeInput.value.trim().toUpperCase();
        if (code.length === 6) {
            connectToLesson(code);
        } else {
            alert('Пожалуйста, введите 6-значный код урока');
        }
    });
    
    joinLessonBackBtn.addEventListener('click', () => showScreen('student-menu'));
    
    // Загрузка активных уроков
    loadActiveLessons();
}

// Подключение к уроку по коду
function connectToLesson(code) {
    // Здесь будет запрос к серверу для проверки кода и получения данных урока
    const lesson = findLessonByCode(code);
    
    if (lesson) {
        // Сохраняем подключенный урок
        gameState.userData.joinedLessons = gameState.userData.joinedLessons || [];
        if (!gameState.userData.joinedLessons.find(l => l.id === lesson.id)) {
            gameState.userData.joinedLessons.push(lesson);
            saveToLocalStorage();
        }
        
        // Показываем урок
        startLessonFromCode(lesson);
        alert(`Вы успешно подключились к уроку: ${lesson.title}`);
    } else {
        alert('Урок с таким кодом не найден. Проверьте код и попробуйте снова.');
    }
}

// Поиск урока по коду (заглушка - в реальности будет запрос к серверу)
function findLessonByCode(code) {
    // В реальном приложении здесь будет запрос к серверу
    // Сейчас используем тестовые данные
    const testLessons = [
        {
            id: 'lesson1',
            title: 'Основы программирования',
            description: 'Изучите базовые команды программирования',
            code: 'ABC123',
            levels: ['level1', 'level2'],
            teacher: 'Учитель Иванов'
        },
        {
            id: 'lesson2', 
            title: 'Продвинутые алгоритмы',
            description: 'Сложные задачи программирования',
            code: 'DEF456',
            levels: ['level3', 'level4'],
            teacher: 'Учитель Петров'
        }
    ];
    
    return testLessons.find(lesson => lesson.code === code);
}

// Загрузка активных уроков
function loadActiveLessons() {
    const activeLessonsList = document.getElementById('active-lessons-list');
    activeLessonsList.innerHTML = '';
    
    // Здесь будет запрос к серверу для получения активных уроков
    const activeLessons = getActiveLessonsFromServer();
    
    activeLessons.forEach(lesson => {
        const lessonItem = document.createElement('div');
        lessonItem.className = 'lesson-item';
        lessonItem.innerHTML = `
            <div class="lesson-code">Код: ${lesson.code}</div>
            <div class="lesson-info">
                <strong>${lesson.title}</strong><br>
                ${lesson.description}<br>
                <em>Учитель: ${lesson.teacher}</em>
            </div>
        `;
        
        lessonItem.addEventListener('click', () => {
            document.getElementById('lesson-code').value = lesson.code;
        });
        
        activeLessonsList.appendChild(lessonItem);
    });
}

// Получение активных уроков с сервера (заглушка)
function getActiveLessonsFromServer() {
    return [
        {
            code: 'ABC123',
            title: 'Основы программирования',
            description: 'Изучите базовые команды программирования',
            teacher: 'Учитель Иванов'
        },
        {
            code: 'DEF456',
            title: 'Продвинутые алгоритмы', 
            description: 'Сложные задачи программирования',
            teacher: 'Учитель Петров'
        }
    ];
}

// Запуск урока по коду
function startLessonFromCode(lesson) {
    // Загружаем уровни урока и начинаем первый уровень
    const lessonLevels = loadLessonLevels(lesson.id);
    
    if (lessonLevels.length > 0) {
        // Добавляем уровни урока в доступные уровни
        gameState.levels = [...gameState.levels, ...lessonLevels];
        
        // Начинаем первый уровень урока
        const firstLevelIndex = gameState.levels.length - lessonLevels.length;
        startLevel(firstLevelIndex);
    }
}

// Загрузка уровней урока (заглушка)
function loadLessonLevels(lessonId) {
    // В реальном приложении здесь будет запрос к серверу
    return [
        {
            id: 'joined_level1',
            title: 'Урок 1: Движение вперед',
            description: 'Переместите робота к цели',
            robot: {x: 2, y: 4},
            target: {x: 2, y: 1},
            enemies: [],
            obstacles: [],
            program: [],
            completed: false,
            unlocked: true,
            reward: 10,
            isFromLesson: true
        },
        {
            id: 'joined_level2', 
            title: 'Урок 2: Обход препятствий',
            description: 'Обойдите стену чтобы добраться до цели',
            robot: {x: 1, y: 4},
            target: {x: 5, y: 4},
            enemies: [],
            obstacles: [{x: 3, y: 4}],
            program: [],
            completed: false,
            unlocked: false,
            reward: 15,
            isFromLesson: true
        }
    ];
}

// Проверка доступа к функциям в зависимости от режима
function hasTeacherAccess() {
    return currentMode === UserMode.TEACHER;
}

function hasStudentAccess() {
    return currentMode === UserMode.STUDENT;
}

// Модифицированная функция показа экрана с проверкой доступа
function showScreen(screenName) {
    // Проверка доступа для учительских функций
    if ((screenName === 'workshop' || screenName === 'shop') && !hasTeacherAccess()) {
        alert('Эта функция доступна только в режиме учителя');
        return;
    }
    
    // Стандартная логика показа экрана
    hideAllScreens();
    
    if (screenName === 'game') {
        gameUI.classList.remove('hidden');
        programmingArea.classList.remove('hidden');
        setupProgramSlots();
    } else {
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }
    
    // Специальная логика для определенных экранов
    if (screenName === 'levels') {
        renderLevelsScreen();
    } else if (screenName === 'shop') {
        updateCoinsDisplay();
    } else if (screenName === 'join-lesson') {
        loadActiveLessons();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initModeSelection();
});
