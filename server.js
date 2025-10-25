const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Хранилище данных
let users = {};
let teachers = {};
let students = {};
let sharedLessons = {};
let activeLessons = {};

// Генерация ID
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// API для учителей
app.post('/api/teacher/register', (req, res) => {
    const { name, email } = req.body;
    const teacherId = generateId();
    
    teachers[teacherId] = {
        id: teacherId,
        name,
        email,
        createdLevels: [],
        createdLessons: [],
        students: [],
        createdAt: new Date().toISOString()
    };
    
    res.json({ success: true, teacherId });
});

app.post('/api/teacher/level', (req, res) => {
    const { teacherId, level } = req.body;
    
    if (!teachers[teacherId]) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    level.id = generateId();
    level.teacherId = teacherId;
    level.createdAt = new Date().toISOString();
    
    teachers[teacherId].createdLevels.push(level);
    res.json({ success: true, level });
});

app.post('/api/teacher/lesson', (req, res) => {
    const { teacherId, lesson } = req.body;
    
    if (!teachers[teacherId]) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    lesson.id = generateId();
    lesson.teacherId = teacherId;
    lesson.shareCode = generateShareCode();
    lesson.createdAt = new Date().toISOString();
    lesson.isActive = true;
    
    teachers[teacherId].createdLessons.push(lesson);
    sharedLessons[lesson.shareCode] = lesson;
    
    res.json({ success: true, lesson });
});

app.get('/api/teacher/lessons/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    
    if (!teachers[teacherId]) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    res.json({ success: true, lessons: teachers[teacherId].createdLessons });
});

app.post('/api/teacher/lesson/share', (req, res) => {
    const { teacherId, lessonId } = req.body;
    
    if (!teachers[teacherId]) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    const lesson = teachers[teacherId].createdLessons.find(l => l.id === lessonId);
    if (!lesson) {
        return res.status(404).json({ success: false, error: 'Lesson not found' });
    }
    
    lesson.isActive = true;
    sharedLessons[lesson.shareCode] = lesson;
    
    res.json({ success: true, shareCode: lesson.shareCode });
});

// API для учеников
app.post('/api/student/join', (req, res) => {
    const { studentName, shareCode } = req.body;
    
    const lesson = sharedLessons[shareCode];
    if (!lesson || !lesson.isActive) {
        return res.status(404).json({ success: false, error: 'Lesson not found or not active' });
    }
    
    const studentId = generateId();
    students[studentId] = {
        id: studentId,
        name: studentName,
        joinedLessons: [lesson.id],
        progress: {},
        createdAt: new Date().toISOString()
    };
    
    // Добавляем ученика к уроку
    if (!activeLessons[lesson.id]) {
        activeLessons[lesson.id] = {
            lesson,
            students: []
        };
    }
    activeLessons[lesson.id].students.push(studentId);
    
    res.json({ success: true, studentId, lesson });
});

app.get('/api/student/lesson/:shareCode', (req, res) => {
    const { shareCode } = req.params;
    
    const lesson = sharedLessons[shareCode];
    if (!lesson || !lesson.isActive) {
        return res.status(404).json({ success: false, error: 'Lesson not found' });
    }
    
    res.json({ success: true, lesson });
});

app.get('/api/student/progress/:studentId', (req, res) => {
    const { studentId } = req.params;
    
    if (!students[studentId]) {
        return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    res.json({ success: true, progress: students[studentId].progress });
});

app.post('/api/student/progress', (req, res) => {
    const { studentId, lessonId, levelId, score, coins } = req.body;
    
    if (!students[studentId]) {
        return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    if (!students[studentId].progress[lessonId]) {
        students[studentId].progress[lessonId] = {};
    }
    
    students[studentId].progress[lessonId][levelId] = {
        score,
        coins,
        completedAt: new Date().toISOString()
    };
    
    res.json({ success: true });
});

// API для получения активных уроков
app.get('/api/lessons/active', (req, res) => {
    const active = Object.values(sharedLessons)
        .filter(lesson => lesson.isActive)
        .map(lesson => ({
            code: lesson.shareCode,
            title: lesson.title,
            description: lesson.description,
            teacher: teachers[lesson.teacherId]?.name || 'Unknown Teacher'
        }));
    
    res.json({ success: true, lessons: active });
});

// Вспомогательные функции
function generateShareCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
