// Режимы пользователя
const UserMode = {
    TEACHER: 'teacher',
    STUDENT: 'student'
};

let currentMode = null;

// Инициализация режимов
function initModeSelection() {
    console.log('Initializing mode selection...');
    
    // Кнопки выбора режима
    const teacherModeBtn = document.getElementById('teacher-mode-btn');
    const studentModeBtn = document.getElementById('student-mode-btn');
    
    // Кнопки возврата к выбору режима
    const backToModeBtn = document.getElementById('back-to-mode-btn');
    const backToModeBtnStudent = document.getElementById('back-to-mode-btn-student');
    
    // Обработчики выбора режима
    if (teacherModeBtn) {
        teacherModeBtn.addEventListener('click', () => {
            currentMode = UserMode.TEACHER;
            showTeacherMenu();
        });
    }
    
    if (studentModeBtn) {
        studentModeBtn.addEventListener('click', () => {
            currentMode = UserMode.STUDENT;
            showStudentMenu();
        });
    }
    
    // Обработчики возврата к выбору режима
    if (backToModeBtn) {
        backToModeBtn.addEventListener('click', showModeSelection);
    }
    if (backToModeBtnStudent) {
        backToModeBtnStudent.addEventListener('click', showModeSelection);
    }
    
    // Инициализация кнопок учителя
    initTeacherMode();
    initStudentMode();
}

// Показать экран выбора режима
function showModeSelection() {
    hideAllScreens();
    const modeSelectionScreen = document.getElementById('mode-selection');
    if (modeSelectionScreen) {
        modeSelectionScreen.classList.remove('hidden');
    }
}

// Показать меню учителя
function showTeacherMenu() {
    hideAllScreens();
    const teacherMenuScreen = document.getElementById('teacher-menu');
    if (teacherMenuScreen) {
        teacherMenuScreen.classList.remove('hidden');
    }
}

// Показать меню ученика
function showStudentMenu() {
    hideAllScreens();
    const studentMenuScreen = document.getElementById('student-menu');
    if (studentMenuScreen) {
        studentMenuScreen.classList.remove('hidden');
    }
}

// Инициализация режима учителя
function initTeacherMode() {
    const teacherLevelsBtn = document.getElementById('teacher-levels-btn');
    const workshopBtn = document.getElementById('workshop-btn');
    const shopBtn = document.getElementById('shop-btn');
    
    if (teacherLevelsBtn) teacherLevelsBtn.addEventListener('click', () => showScreen('levels'));
    if (workshopBtn) workshopBtn.addEventListener('click', () => {
        alert('Мастерская будет доступна в следующем обновлении');
    });
    if (shopBtn) shopBtn.addEventListener('click', () => {
        alert('Магазин оценок будет доступен в следующем обновлении');
    });
}

// Инициализация режима ученика
function initStudentMode() {
    const studentLevelsBtn = document.getElementById('student-levels-btn');
    if (studentLevelsBtn) studentLevelsBtn.addEventListener('click', () => showScreen('levels'));
}

// Проверка доступа к функциям в зависимости от режима
function hasTeacherAccess() {
    return currentMode === UserMode.TEACHER;
}

function hasStudentAccess() {
    return currentMode === UserMode.STUDENT;
}

// Показать экран
function showScreen(screenName) {
    console.log('Showing screen:', screenName);
    
    // Скрыть все экраны
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
    
    // Показать выбранный экран
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.remove('hidden');
    } else {
        console.error('Screen not found:', screenName);
    }
    
    // Обновление контента экрана
    if (screenName === 'levels') {
        if (typeof renderLevelsScreen === 'function') renderLevelsScreen();
    }
}

// Скрыть все экраны
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing mode selection...');
    initModeSelection();
});
