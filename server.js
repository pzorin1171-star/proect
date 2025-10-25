const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = {};
let levels = [];
let lessons = [];
let shopPrices = {
    5: 50,
    4: 30,
    3: 15,
    2: 5
};

app.get('/api/user/data', (req, res) => {
    const userId = req.query.userId || 'default';
    if (!users[userId]) {
        users[userId] = {
            coins: 0,
            grades: [],
            completedLevels: [],
            customLevels: [],
            customLessons: []
        };
    }
    res.json(users[userId]);
});

app.post('/api/user/progress', (req, res) => {
    const { userId, levelId, coinsEarned, grade } = req.body;
    const user = users[userId] || { coins: 0, grades: [], completedLevels: [] };
    
    user.coins += coinsEarned;
    if (grade) {
        user.grades.push(grade);
    }
    if (!user.completedLevels.includes(levelId)) {
        user.completedLevels.push(levelId);
    }
    
    users[userId] = user;
    res.json({ success: true, coins: user.coins });
});

app.get('/api/levels/custom', (req, res) => {
    const userId = req.query.userId || 'default';
    const user = users[userId];
    res.json({ levels: user ? user.customLevels : [] });
});

app.post('/api/levels/custom', (req, res) => {
    const { userId, level } = req.body;
    if (!users[userId]) {
        users[userId] = { customLevels: [] };
    }
    
    level.id = Date.now().toString();
    users[userId].customLevels.push(level);
    res.json({ success: true, levelId: level.id });
});

app.get('/api/lessons', (req, res) => {
    const userId = req.query.userId || 'default';
    const user = users[userId];
    const allLessons = [...lessons, ...(user ? user.customLessons : [])];
    res.json({ lessons: allLessons });
});

app.post('/api/lessons', (req, res) => {
    const { userId, lesson } = req.body;
    if (!users[userId]) {
        users[userId] = { customLessons: [] };
    }
    
    lesson.id = Date.now().toString();
    users[userId].customLessons.push(lesson);
    res.json({ success: true, lessonId: lesson.id });
});

app.post('/api/shop/buy-grade', (req, res) => {
    const { userId, grade, price } = req.body;
    const user = users[userId];
    
    if (!user || user.coins < price) {
        return res.json({ success: false, error: 'Недостаточно монет' });
    }
    
    user.coins -= price;
    user.grades.push(grade);
    res.json({ success: true, coins: user.coins });
});

app.get('/api/shop/prices', (req, res) => {
    res.json({ prices: shopPrices });
});

app.post('/api/shop/prices', (req, res) => {
    const { prices } = req.body;
    shopPrices = { ...shopPrices, ...prices };
    res.json({ success: true, prices: shopPrices });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
