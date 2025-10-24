<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Программирование Робота</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Times New Roman', serif;
        }
        
        body {
            background: linear-gradient(135deg, #3e2723, #5d4037);
            color: #f5e8c8;
            overflow: hidden;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            border-radius: 5px;
            overflow: hidden;
            border: 8px solid #5d4037;
        }
        
        #game-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(61, 43, 31, 0.95);
            z-index: 10;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.1"><rect fill="%235d4037" width="100" height="100"/><path d="M0,0 L100,100 M100,0 L0,100" stroke="%233e2723" stroke-width="2"/></svg>');
        }
        
        .hidden {
            display: none;
        }
        
        h1 {
            font-size: 64px;
            color: #d7ccc8;
            margin-bottom: 20px;
            text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7);
            text-align: center;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            border-bottom: 3px solid #8d6e63;
            padding-bottom: 10px;
        }
        
        h2 {
            font-size: 48px;
            color: #d7ccc8;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            text-align: center;
            font-weight: bold;
        }
        
        p {
            font-size: 24px;
            margin-bottom: 40px;
            text-align: center;
            max-width: 80%;
            line-height: 1.5;
            color: #efebe9;
        }
        
        .button {
            background: linear-gradient(to bottom, #8d6e63, #6d4c41);
            color: #fff;
            border: none;
            padding: 15px 30px;
            font-size: 22px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            min-width: 250px;
            text-align: center;
            border: 2px solid #5d4037;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            font-weight: bold;
            letter-spacing: 1px;
        }
        
        .button:hover {
            background: linear-gradient(to bottom, #a1887f, #8d6e63);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
        }
        
        .button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .button:disabled {
            background: linear-gradient(to bottom, #795548, #5d4037);
            cursor: not-allowed;
            transform: none;
            color: #bcaaa4;
        }
        
        .menu-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 600px;
        }
        
        .card-grid {
            display: flex;
            gap: 30px;
            overflow-x: auto;
            padding: 20px;
            width: 90%;
            max-width: 90%;
            height: 300px;
            align-items: center;
        }
        
        .level-card {
            background: rgba(93, 64, 55, 0.8);
            border-radius: 5px;
            padding: 20px;
            width: 300px;
            height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 2px solid #8d6e63;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
        }
        
        .level-card:hover {
            transform: translateY(-5px);
        }
        
        .level-card.locked {
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .level-card.locked:hover {
            transform: none;
        }
        
        .level-number {
            font-size: 36px;
            color: #ffd54f;
            margin-bottom: 10px;
        }
        
        .level-title {
            font-size: 24px;
            color: #f5e8c8;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .level-description {
            font-size: 16px;
            color: #efebe9;
            text-align: center;
            line-height: 1.4;
        }
        
        .lock-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            color: #bcaaa4;
        }
        
        .parchment {
            background: #f5e8c8;
            color: #5d4037;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            border: 1px solid #8d6e63;
            max-width: 90%;
            margin-bottom: 20px;
        }
        
        .game-ui {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            z-index: 5;
        }
        
        .ui-panel {
            background: rgba(93, 64, 55, 0.8);
            padding: 10px 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 20px;
            border: 2px solid #8d6e63;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            color: #f5e8c8;
        }
        
        .game-result {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(61, 43, 31, 0.95);
            padding: 40px;
            border-radius: 5px;
            text-align: center;
            z-index: 20;
            border: 3px solid #8d6e63;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
            width: 500px;
        }
        
        .programming-area {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 30vh;
            background: rgba(93, 64, 55, 0.9);
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-top: 3px solid #8d6e63;
            z-index: 5;
        }
        
        .commands-panel {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding: 10px;
            flex-wrap: wrap;
        }
        
        .command {
            background: linear-gradient(to bottom, #8d6e63, #6d4c41);
            color: #fff;
            border: none;
            padding: 12px 20px;
            font-size: 18px;
            border-radius: 5px;
            cursor: grab;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            border: 2px solid #5d4037;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            font-weight: bold;
            min-width: 200px;
            text-align: center;
            transition: all 0.2s;
            user-select: none;
            position: relative;
        }
        
        .command:hover {
            background: linear-gradient(to bottom, #a1887f, #8d6e63);
            transform: translateY(-3px);
        }
        
        .command:active {
            cursor: grabbing;
        }
        
        .program-panel {
            flex-grow: 1;
            background: rgba(121, 85, 72, 0.7);
            border-radius: 5px;
            padding: 15px;
            display: flex;
            gap: 15px;
            overflow-x: auto;
            border: 2px solid #8d6e63;
            flex-wrap: wrap;
            align-content: flex-start;
        }
        
        .program-slot {
            width: 160px;
            height: 90px;
            background: rgba(93, 64, 55, 0.5);
            border: 2px dashed #8d6e63;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #bcaaa4;
            font-size: 16px;
            flex-shrink: 0;
            transition: all 0.2s;
            position: relative;
        }
        
        .program-slot.filled {
            background: rgba(141, 110, 99, 0.7);
            border: 2px solid #5d4037;
            color: #f5e8c8;
        }
        
        .program-slot.highlight {
            background: rgba(255, 213, 79, 0.3);
            border: 2px dashed #ffd54f;
        }
        
        .program-block {
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #8d6e63, #6d4c41);
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 16px;
            cursor: grab;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            border: 2px solid #5d4037;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
            font-weight: bold;
            user-select: none;
            transition: all 0.2s;
            position: relative;
            flex-direction: column;
            padding: 5px;
        }
        
        .program-block:hover {
            background: linear-gradient(to bottom, #a1887f, #8d6e63);
        }
        
        .program-block:active {
            cursor: grabbing;
        }
        
        .delete-btn {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #ef5350;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .delete-btn:hover {
            background: #f44336;
            transform: scale(1.1);
        }
        
        .delete-zone {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 100px;
            height: 100px;
            background: rgba(239, 83, 80, 0.7);
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 16px;
            border: 2px dashed #ef5350;
            transition: all 0.3s;
        }
        
        .delete-zone.highlight {
            background: rgba(239, 83, 80, 0.9);
            transform: scale(1.05);
        }
        
        .controls-panel {
            display: flex;
            gap: 15px;
            margin-top: 15px;
        }
        
        .tutorial-content {
            max-height: 500px;
            overflow-y: auto;
            padding: 20px;
            width: 90%;
            text-align: left;
        }
        
        .tutorial-section {
            margin-bottom: 30px;
        }
        
        .tutorial-section h3 {
            color: #ffd54f;
            margin-bottom: 10px;
            font-size: 24px;
        }
        
        .tutorial-section p {
            text-align: left;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .tutorial-section ul {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        
        .tutorial-section li {
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .code-example {
            background: #5d4037;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            margin: 10px 0;
            border-left: 4px solid #ffd54f;
        }
        
        .medieval-border {
            border: 8px solid transparent;
            border-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,100 L0,100 Z M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="%238d6e63" stroke-width="4"/></svg>') 8 round;
        }
        
        .blocked {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .steps-input-container {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 5px;
        }
        
        .steps-input {
            width: 40px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid #8d6e63;
            border-radius: 3px;
            color: #fff;
            text-align: center;
            font-size: 12px;
        }
        
        .steps-label {
            font-size: 12px;
            color: #f5e8c8;
        }

        .workshop-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .tab-button.active {
            background: linear-gradient(to bottom, #ffd54f, #f9a825);
            color: #5d4037;
        }

        .tab-content {
            display: none;
            width: 100%;
            max-width: 1200px;
        }

        .tab-content.active {
            display: block;
        }

        .editor-container {
            display: flex;
            gap: 20px;
            padding: 20px;
            background: rgba(93, 64, 55, 0.8);
            border-radius: 10px;
            border: 2px solid #8d6e63;
        }

        .editor-tools {
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .tool-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .tool-button {
            min-width: 150px;
            text-align: left;
        }

        .tool-button.active {
            background: linear-gradient(to bottom, #ffd54f, #f9a825);
            color: #5d4037;
        }

        .editor-settings {
            background: rgba(121, 85, 72, 0.7);
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #8d6e63;
        }

        .setting {
            margin-bottom: 15px;
        }

        .setting label {
            display: block;
            margin-bottom: 5px;
            color: #f5e8c8;
            font-weight: bold;
        }

        .setting input,
        .setting textarea,
        .setting select {
            width: 100%;
            padding: 8px;
            border: 1px solid #8d6e63;
            border-radius: 3px;
            background: rgba(245, 232, 200, 0.9);
            color: #5d4037;
        }

        .setting textarea {
            height: 80px;
            resize: vertical;
        }

        .editor-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .editor-canvas-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #editor-canvas {
            border: 3px solid #8d6e63;
            border-radius: 5px;
            background: #8d6e63;
            cursor: crosshair;
        }

        .editor-info {
            margin-top: 10px;
            color: #f5e8c8;
            text-align: center;
        }

        .shop-info {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .coins-display {
            background: linear-gradient(to bottom, #ffd54f, #f9a825);
            color: #5d4037;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 2px solid #5d4037;
        }

        .shop-items {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            max-width: 1000px;
        }

        .shop-item {
            background: rgba(93, 64, 55, 0.8);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8d6e63;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .grade-display {
            font-size: 48px;
            font-weight: bold;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 3px solid #fff;
        }

        .shop-item:nth-child(1) .grade-display {
            background: linear-gradient(135deg, #4caf50, #81c784);
            color: white;
        }

        .shop-item:nth-child(2) .grade-display {
            background: linear-gradient(135deg, #2196f3, #64b5f6);
            color: white;
        }

        .shop-item:nth-child(3) .grade-display {
            background: linear-gradient(135deg, #ff9800, #ffb74d);
            color: white;
        }

        .shop-item:nth-child(4) .grade-display {
            background: linear-gradient(135deg, #f44336, #e57373);
            color: white;
        }

        .item-info {
            flex: 1;
        }

        .item-info h3 {
            margin-bottom: 5px;
            color: #ffd54f;
        }

        .item-info p {
            margin-bottom: 10px;
            color: #f5e8c8;
        }

        .price {
            color: #ffd54f;
            font-weight: bold;
        }

        .buy-btn {
            min-width: 120px;
        }

        .shop-settings {
            background: rgba(93, 64, 55, 0.8);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8d6e63;
            max-width: 600px;
            margin: 0 auto;
        }

        .price-settings {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .price-setting {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .price-setting label {
            color: #f5e8c8;
            font-weight: bold;
        }

        .price-input {
            padding: 8px;
            border: 1px solid #8d6e63;
            border-radius: 3px;
            background: rgba(245, 232, 200, 0.9);
            color: #5d4037;
        }

        @media (max-width: 768px) {
            .editor-container {
                flex-direction: column;
            }
            
            .editor-tools {
                width: 100%;
            }
            
            .shop-items {
                grid-template-columns: 1fr;
            }
            
            .price-settings {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div id="game-container" class="medieval-border">
        <canvas id="game-canvas"></canvas>
        
        <div id="main-menu" class="screen">
            <h1>🤖 Программирование Робота</h1>
            <p class="parchment">Программируйте робота для выполнения заданий на различных уровнях</p>
            
            <div class="menu-buttons">
                <button class="button" id="levels-btn">📚 Уровни</button>
                <button class="button" id="lessons-btn">📖 Уроки</button>
                <button class="button" id="workshop-btn">🔧 Мастерская</button>
                <button class="button" id="shop-btn">🛒 Магазин оценок</button>
                <button class="button" id="tutorial-btn">📖 Пособие</button>
            </div>
        </div>
        
        <div id="levels-screen" class="screen hidden">
            <h2>📚 Уровни</h2>
            <p class="parchment">Выберите уровень для программирования робота</p>
            
            <button class="button" id="levels-back-btn">← Назад</button>
            
            <div class="card-grid" id="levels-container">
            </div>
        </div>
        
        <div id="lessons-screen" class="screen hidden">
            <h2>📖 Уроки</h2>
            <p class="parchment">Выберите урок для изучения</p>
            
            <button class="button" id="lessons-back-btn">← Назад</button>
            
            <div class="card-grid" id="lessons-container">
            </div>
        </div>
        
        <div id="workshop-screen" class="screen hidden">
            <h2>🔧 Мастерская</h2>
            <p class="parchment">Создавайте собственные уровни и уроки</p>
            
            <button class="button" id="workshop-back-btn">← Назад</button>
            
            <div class="workshop-tabs">
                <button class="button tab-button active" data-tab="level-editor">Редактор уровней</button>
                <button class="button tab-button" data-tab="lesson-editor">Редактор уроков</button>
                <button class="button tab-button" data-tab="my-levels">Мои уровни</button>
                <button class="button tab-button" data-tab="my-lessons">Мои уроки</button>
            </div>
            
            <div id="level-editor" class="tab-content active">
                <div class="editor-container">
                    <div class="editor-tools">
                        <h3>Инструменты</h3>
                        <div class="tool-buttons">
                            <button class="button tool-button active" data-tool="robot">🤖 Робот</button>
                            <button class="button tool-button" data-tool="target">🎯 Цель</button>
                            <button class="button tool-button" data-tool="enemy">👹 Враг</button>
                            <button class="button tool-button" data-tool="obstacle">🧱 Стена</button>
                            <button class="button tool-button" data-tool="erase">🧹 Удалить</button>
                        </div>
                        
                        <div class="editor-settings">
                            <h3>Настройки уровня</h3>
                            <div class="setting">
                                <label>Название уровня:</label>
                                <input type="text" id="level-title" placeholder="Введите название">
                            </div>
                            <div class="setting">
                                <label>Описание:</label>
                                <textarea id="level-description" placeholder="Введите описание"></textarea>
                            </div>
                            <div class="setting">
                                <label>Награда (монетки):</label>
                                <input type="number" id="level-reward" min="0" max="100" value="10">
                            </div>
                            <div class="setting">
                                <label>Сложность:</label>
                                <select id="level-difficulty">
                                    <option value="easy">Легкая</option>
                                    <option value="medium">Средняя</option>
                                    <option value="hard">Сложная</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button class="button" id="save-level-btn">💾 Сохранить уровень</button>
                            <button class="button" id="clear-level-btn">🗑️ Очистить поле</button>
                            <button class="button" id="test-level-btn">🎮 Тестировать уровень</button>
                        </div>
                    </div>
                    
                    <div class="editor-canvas-container">
                        <canvas id="editor-canvas" width="600" height="600"></canvas>
                        <div class="editor-info">
                            <p>Текущий инструмент: <span id="current-tool">🤖 Робот</span></p>
                            <p>Координаты: <span id="cursor-coords">X: 0, Y: 0</span></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="lesson-editor" class="tab-content">
                <div class="lesson-editor-container">
                    <div class="lesson-settings">
                        <h3>Настройки урока</h3>
                        <div class="setting">
                            <label>Название урока:</label>
                            <input type="text" id="lesson-title" placeholder="Введите название">
                        </div>
                        <div class="setting">
                            <label>Описание:</label>
                            <textarea id="lesson-description" placeholder="Введите описание"></textarea>
                        </div>
                        <button class="button" id="save-lesson-btn">💾 Сохранить урок</button>
                    </div>
                    
                    <div class="lesson-levels">
                        <h3>Уровни урока</h3>
                        <div id="lesson-levels-list" class="levels-list">
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="my-levels" class="tab-content">
                <h3>Мои созданные уровни</h3>
                <div class="card-grid" id="my-levels-container">
                </div>
            </div>
            
            <div id="my-lessons" class="tab-content">
                <h3>Мои созданные уроки</h3>
                <div class="card-grid" id="my-lessons-container">
                </div>
            </div>
        </div>
        
        <div id="shop-screen" class="screen hidden">
            <h2>🛒 Магазин оценок</h2>
            
            <div class="shop-info">
                <div class="coins-display">
                    <span class="coins-icon">🪙</span>
                    <span id="coins-count">0</span> монет
                </div>
            </div>
            
            <button class="button" id="shop-back-btn">← Назад</button>
            
            <div class="shop-items">
                <div class="shop-item">
                    <div class="grade-display">5</div>
                    <div class="item-info">
                        <h3>Оценка 5</h3>
                        <p>Отлично!</p>
                        <div class="price">Цена: <span class="price-amount" data-grade="5">50</span> 🪙</div>
                    </div>
                    <button class="button buy-btn" data-grade="5">Купить</button>
                </div>
                
                <div class="shop-item">
                    <div class="grade-display">4</div>
                    <div class="item-info">
                        <h3>Оценка 4</h3>
                        <p>Хорошо!</p>
                        <div class="price">Цена: <span class="price-amount" data-grade="4">30</span> 🪙</div>
                    </div>
                    <button class="button buy-btn" data-grade="4">Купить</button>
                </div>
                
                <div class="shop-item">
                    <div class="grade-display">3</div>
                    <div class="item-info">
                        <h3>Оценка 3</h3>
                        <p>Удовлетворительно</p>
                        <div class="price">Цена: <span class="price-amount" data-grade="3">15</span> 🪙</div>
                    </div>
                    <button class="button buy-btn" data-grade="3">Купить</button>
                </div>
                
                <div class="shop-item">
                    <div class="grade-display">2</div>
                    <div class="item-info">
                        <h3>Оценка 2</h3>
                        <p>Неудовлетворительно</p>
                        <div class="price">Цена: <span class="price-amount" data-grade="2">5</span> 🪙</div>
                    </div>
                    <button class="button buy-btn" data-grade="2">Купить</button>
                </div>
            </div>
            
            <div class="shop-settings">
                <h3>Настройки цен</h3>
                <div class="price-settings">
                    <div class="price-setting">
                        <label>Цена за оценку 5:</label>
                        <input type="number" class="price-input" data-grade="5" min="1" max="1000" value="50">
                    </div>
                    <div class="price-setting">
                        <label>Цена за оценку 4:</label>
                        <input type="number" class="price-input" data-grade="4" min="1" max="1000" value="30">
                    </div>
                    <div class="price-setting">
                        <label>Цена за оценку 3:</label>
                        <input type="number" class="price-input" data-grade="3" min="1" max="1000" value="15">
                    </div>
                    <div class="price-setting">
                        <label>Цена за оценку 2:</label>
                        <input type="number" class="price-input" data-grade="2" min="1" max="1000" value="5">
                    </div>
                </div>
                <button class="button" id="save-prices-btn">💾 Сохранить цены</button>
            </div>
        </div>
        
        <div id="tutorial-screen" class="screen hidden">
            <h2>📖 Пособие</h2>
            
            <button class="button" id="tutorial-back-btn">← Назад</button>
            
            <div class="tutorial-content">
                <div class="tutorial-section">
                    <h3>Основы программирования робота</h3>
                    <p>В этой игре вы будете программировать робота для выполнения различных заданий.</p>
                </div>
            </div>
        </div>
        
        <div id="game-ui" class="game-ui hidden">
            <div class="ui-panel">
                Уровень: <span id="current-level">1</span>
            </div>
            <div class="ui-panel">
                Задание: <span id="current-task">Дойти до цели</span>
            </div>
            <button class="button" id="game-back-btn">← Назад</button>
        </div>
        
        <div id="programming-area" class="programming-area hidden">
            <div class="commands-panel">
                <div class="command" draggable="true" data-command="forward">Идти вперед</div>
                <div class="command" draggable="true" data-command="backward">Идти назад</div>
                <div class="command" draggable="true" data-command="right">Идти вправо</div>
                <div class="command" draggable="true" data-command="left">Идти влево</div>
                <div class="command" draggable="true" data-command="attack">Атаковать ближайшего врага</div>
            </div>
            
            <div class="program-panel" id="program-slots">
            </div>
            
            <div class="delete-zone" id="delete-zone">
                Удалить<br>блок
            </div>
            
            <div class="controls-panel">
                <button class="button" id="run-program-btn">Запуск программы</button>
                <button class="button" id="reset-program-btn">Сброс программы</button>
            </div>
        </div>
        
        <div id="game-result" class="game-result hidden">
            <h2 id="result-title">УРОВЕНЬ ПРОЙДЕН!</h2>
            <p id="result-message">Поздравляем! Вы успешно запрограммировали робота.</p>
            <button class="button" id="next-level-btn">Следующий уровень</button>
            <button class="button" id="levels-menu-btn">К выбору уровней</button>
        </div>
        
        <div id="game-fail" class="game-result hidden">
            <h2 id="fail-title">ПОПРОБУЙТЕ СНОВА</h2>
            <p id="fail-message">Робот не достиг цели. Попробуйте другую программу.</p>
            <button class="button" id="retry-level-btn">Повторить уровень</button>
            <button class="button" id="fail-levels-menu-btn">К выбору уровней</button>
        </div>
        
        <div id="enemy-collision" class="game-result hidden">
            <h2 id="enemy-title">СТОЛКНОВЕНИЕ С ВРАГОМ!</h2>
            <p id="enemy-message">Робот столкнулся с врагом и был уничтожен.</p>
            <button class="button" id="retry-enemy-btn">Повторить уровень</button>
            <button class="button" id="enemy-levels-menu-btn">К выбору уровней</button>
        </div>
    </div>

    <script>
        const GRID_WIDTH = 24;
        const GRID_HEIGHT = 24;

        const COLORS = {
            BACKGROUND: '#5d4037',
            GRID: 'rgba(141, 110, 99, 0.3)',
            ROBOT: '#f5e8c8',
            ENEMY: '#ef5350',
            TARGET: '#4caf50',
            OBSTACLE: '#6d4c41',
            TEXT: '#f5e8c8'
        };

        const textures = {
            robot: new Image(),
            enemy: new Image()
        };

        textures.robot.src = 'white_guy.png';
        textures.enemy.src = 'red_guy.png';

        let gameState = {
            currentScreen: 'main_menu',
            currentLevel: 0,
            levels: [
                {
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
                customLessons: []
            }
        };

        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');

        const screens = {
            main_menu: document.getElementById('main-menu'),
            levels: document.getElementById('levels-screen'),
            lessons: document.getElementById('lessons-screen'),
            workshop: document.getElementById('workshop-screen'),
            shop: document.getElementById('shop-screen'),
            tutorial: document.getElementById('tutorial-screen'),
            game: null
        };

        const buttons = {
            levels: document.getElementById('levels-btn'),
            lessons: document.getElementById('lessons-btn'),
            workshop: document.getElementById('workshop-btn'),
            shop: document.getElementById('shop-btn'),
            tutorial: document.getElementById('tutorial-btn'),
            levelsBack: document.getElementById('levels-back-btn'),
            lessonsBack: document.getElementById('lessons-back-btn'),
            workshopBack: document.getElementById('workshop-back-btn'),
            shopBack: document.getElementById('shop-back-btn'),
            tutorialBack: document.getElementById('tutorial-back-btn'),
            gameBack: document.getElementById('game-back-btn'),
            runProgram: document.getElementById('run-program-btn'),
            resetProgram: document.getElementById('reset-program-btn'),
            nextLevel: document.getElementById('next-level-btn'),
            levelsMenu: document.getElementById('levels-menu-btn'),
            retryLevel: document.getElementById('retry-level-btn'),
            failLevelsMenu: document.getElementById('fail-levels-menu-btn'),
            retryEnemy: document.getElementById('retry-enemy-btn'),
            enemyLevelsMenu: document.getElementById('enemy-levels-menu-btn')
        };

        const currentLevelElement = document.getElementById('current-level');
        const currentTaskElement = document.getElementById('current-task');
        const gameUI = document.getElementById('game-ui');
        const programmingArea = document.getElementById('programming-area');
        const programSlots = document.getElementById('program-slots');
        const deleteZone = document.getElementById('delete-zone');
        const gameResultElement = document.getElementById('game-result');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const gameFailElement = document.getElementById('game-fail');
        const failTitle = document.getElementById('fail-title');
        const failMessage = document.getElementById('fail-message');
        const enemyCollisionElement = document.getElementById('enemy-collision');
        const enemyTitle = document.getElementById('enemy-title');
        const enemyMessage = document.getElementById('enemy-message');

        let gridSize;
        let gameAreaHeight;
        let offsetX, offsetY;

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
                    obstacles: []
                };
                
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.render();
            }
            
            setupEventListeners() {
                document.querySelectorAll('.tool-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentTool = e.target.dataset.tool;
                        this.updateToolInfo();
                    });
                });
                
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
                
                document.getElementById('save-level-btn').addEventListener('click', () => this.saveLevel());
                document.getElementById('clear-level-btn').addEventListener('click', () => this.clearLevel());
                document.getElementById('test-level-btn').addEventListener('click', () => this.testLevel());
                
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
                this.levelData.obstacles = this.levelData.obstacles.filter(o => o.x !== x || e.y !== y);
                
                if (this.levelData.robot.x === x && this.levelData.robot.y === y) {
                    this.levelData.robot = {x: -1, y: -1};
                }
                
                if (this.levelData.target.x === x && this.levelData.target.y === y) {
                    this.levelData.target = {x: -1, y: -1};
                }
            }
            
            render() {
                this.ctx.fillStyle = '#8d6e63';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
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
            
            updateToolInfo() {
                document.getElementById('current-tool').textContent = document.querySelector('.tool-button.active').textContent;
            }
            
            updateCursorCoords(x, y) {
                document.getElementById('cursor-coords').textContent = `X: ${x}, Y: ${y}`;
            }
            
            saveLevel() {
                const level = {
                    ...this.levelData,
                    id: Date.now().toString(),
                    isCustom: true
                };
                
                gameState.userData.customLevels.push(level);
                this.saveToLocalStorage();
                alert('Уровень сохранен!');
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
                    obstacles: []
                };
                
                document.getElementById('level-title').value = '';
                document.getElementById('level-description').value = '';
                document.getElementById('level-reward').value = 10;
                document.getElementById('level-difficulty').value = 'easy';
                
                this.render();
            }
            
            testLevel() {
                const testLevel = {
                    ...this.levelData,
                    program: [],
                    completed: false,
                    unlocked: true
                };
                
                gameState.levels.push(testLevel);
                startLevel(gameState.levels.length - 1);
            }
            
            saveToLocalStorage() {
                localStorage.setItem('robotGameData', JSON.stringify(gameState.userData));
            }
        }

        function init() {
            setupButtons();
            setupDragAndDrop();
            setupWorkshopTabs();
            setupShop();
            window.addEventListener('resize', handleResize);
            handleResize();
            loadFromLocalStorage();
            gameLoop();
        }

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            gameAreaHeight = window.innerHeight - programmingArea.offsetHeight;
            
            gridSize = Math.min(
                window.innerWidth / GRID_WIDTH,
                gameAreaHeight / GRID_HEIGHT
            );
            
            offsetX = (window.innerWidth - GRID_WIDTH * gridSize) / 2;
            offsetY = (gameAreaHeight - GRID_HEIGHT * gridSize) / 2;
        }

        function setupButtons() {
            buttons.levels.addEventListener('click', () => showScreen('levels'));
            buttons.lessons.addEventListener('click', () => showScreen('lessons'));
            buttons.workshop.addEventListener('click', () => showScreen('workshop'));
            buttons.shop.addEventListener('click', () => showScreen('shop'));
            buttons.tutorial.addEventListener('click', () => showScreen('tutorial'));
            
            buttons.levelsBack.addEventListener('click', () => showScreen('main_menu'));
            buttons.lessonsBack.addEventListener('click', () => showScreen('main_menu'));
            buttons.workshopBack.addEventListener('click', () => showScreen('main_menu'));
            buttons.shopBack.addEventListener('click', () => showScreen('main_menu'));
            buttons.tutorialBack.addEventListener('click', () => showScreen('main_menu'));
            buttons.gameBack.addEventListener('click', () => {
                resetGame();
                showScreen('levels');
            });
            
            buttons.runProgram.addEventListener('click', runProgram);
            buttons.resetProgram.addEventListener('click', resetProgram);
            
            buttons.nextLevel.addEventListener('click', nextLevel);
            buttons.levelsMenu.addEventListener('click', () => {
                gameResultElement.classList.add('hidden');
                showScreen('levels');
            });
            
            buttons.retryLevel.addEventListener('click', retryLevel);
            buttons.failLevelsMenu.addEventListener('click', () => {
                gameFailElement.classList.add('hidden');
                showScreen('levels');
            });
            
            buttons.retryEnemy.addEventListener('click', retryLevel);
            buttons.enemyLevelsMenu.addEventListener('click', () => {
                enemyCollisionElement.classList.add('hidden');
                showScreen('levels');
            });
        }

        function setupWorkshopTabs() {
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
            
            new LevelEditor();
        }

        function setupShop() {
            document.querySelectorAll('.buy-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const grade = parseInt(e.target.dataset.grade);
                    const price = parseInt(document.querySelector(`.price-amount[data-grade="${grade}"]`).textContent);
                    
                    if (gameState.userData.coins >= price) {
                        gameState.userData.coins -= price;
                        gameState.userData.grades.push(grade);
                        updateCoinsDisplay();
                        saveToLocalStorage();
                        alert(`Вы купили оценку ${grade}!`);
                    } else {
                        alert('Недостаточно монет!');
                    }
                });
            });
            
            document.getElementById('save-prices-btn').addEventListener('click', () => {
                document.querySelectorAll('.price-input').forEach(input => {
                    const grade = input.dataset.grade;
                    const price = parseInt(input.value);
                    document.querySelector(`.price-amount[data-grade="${grade}"]`).textContent = price;
                });
                alert('Цены сохранены!');
            });
        }

        function setupDragAndDrop() {
            const commands = document.querySelectorAll('.command');
            
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

        function showScreen(screenName) {
            Object.values(screens).forEach(screen => {
                if (screen) screen.classList.add('hidden');
            });
            
            gameUI.classList.add('hidden');
            programmingArea.classList.add('hidden');
            gameResultElement.classList.add('hidden');
            gameFailElement.classList.add('hidden');
            enemyCollisionElement.classList.add('hidden');
            
            gameUI.classList.remove('blocked');
            programmingArea.classList.remove('blocked');
            
            if (screenName === 'game') {
                gameUI.classList.remove('hidden');
                programmingArea.classList.remove('hidden');
                setupProgramSlots();
            } else if (screens[screenName]) {
                screens[screenName].classList.remove('hidden');
            }
            
            gameState.currentScreen = screenName;
            
            if (screenName === 'levels') {
                renderLevelsScreen();
            } else if (screenName === 'shop') {
                updateCoinsDisplay();
            }
        }

        function renderLevelsScreen() {
            const container = document.getElementById('levels-container');
            container.innerHTML = '';
            
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            
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
                `;
                
                if (level.unlocked) {
                    card.addEventListener('click', () => {
                        startLevel(index);
                    });
                }
                
                container.appendChild(card);
            });
        }

        function renderMyLevels() {
            const container = document.getElementById('my-levels-container');
            container.innerHTML = '';
            
            gameState.userData.customLevels.forEach((level, index) => {
                const card = document.createElement('div');
                card.className = 'level-card';
                card.innerHTML = `
                    <div class="level-number">${index + 1}</div>
                    <div class="level-title">${level.title}</div>
                    <div class="level-description">${level.description}</div>
                    <div style="position:absolute; bottom:10px; color:#ffd54f;">Награда: ${level.reward} 🪙</div>
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

        function renderMyLessons() {
            const container = document.getElementById('my-lessons-container');
            container.innerHTML = '';
            
            gameState.userData.customLessons.forEach((lesson, index) => {
                const card = document.createElement('div');
                card.className = 'level-card';
                card.innerHTML = `
                    <div class="level-number">${index + 1}</div>
                    <div class="level-title">${lesson.title}</div>
                    <div class="level-description">${lesson.description}</div>
                    <div class="level-stats">Уровней: ${lesson.levels.length}</div>
                `;
                
                container.appendChild(card);
            });
        }

        function startLevel(levelIndex) {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            if (levelIndex >= allLevels.length || !allLevels[levelIndex].unlocked) return;
            
            gameState.currentLevel = levelIndex;
            const level = allLevels[levelIndex];
            
            resetLevelState(levelIndex);
            calculateLevelOffset(level);
            
            currentLevelElement.textContent = levelIndex + 1;
            currentTaskElement.textContent = level.description;
            
            showScreen('game');
            setupProgramSlots();
        }

        function calculateLevelOffset(level) {
            const objects = [
                level.robot,
                level.target,
                ...level.enemies,
                ...level.obstacles
            ];
            
            let minX = GRID_WIDTH, maxX = 0;
            let minY = GRID_HEIGHT, maxY = 0;
            
            objects.forEach(obj => {
                minX = Math.min(minX, obj.x);
                maxX = Math.max(maxX, obj.x);
                minY = Math.min(minY, obj.y);
                maxY = Math.max(maxY, obj.y);
            });
            
            const levelCenterX = (minX + maxX) / 2;
            const levelCenterY = (minY + maxY) / 2;
            
            const gridCenterX = GRID_WIDTH / 2;
            const gridCenterY = GRID_HEIGHT / 2;
            
            gameState.levelOffset = {
                x: gridCenterX - levelCenterX,
                y: gridCenterY - levelCenterY
            };
        }

        function resetLevelState(levelIndex) {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[levelIndex];
            const initialLevel = JSON.parse(JSON.stringify(level));
            
            level.robot = {...initialLevel.robot};
            level.enemies = [...initialLevel.enemies];
            level.obstacles = [...initialLevel.obstacles];
            
            gameState.program = [];
            gameState.isRunning = false;
            gameState.currentStep = 0;
            gameState.gameOver = false;
            gameState.gameResult = null;
            gameState.currentCommandSteps = 0;
            gameState.totalCommandSteps = 0;
        }

        function setupProgramSlots() {
            programSlots.innerHTML = '';
            
            for (let i = 0; i < 20; i++) {
                const slot = document.createElement('div');
                slot.className = 'program-slot';
                slot.textContent = i + 1;
                slot.dataset.index = i;
                
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
                    
                    const commandData = JSON.parse(e.dataTransfer.getData('text/plain'));
                    const source = e.dataTransfer.getData('source');
                    const targetIndex = parseInt(slot.dataset.index);
                    
                    if (source === 'panel') {
                        if (!gameState.program[targetIndex]) {
                            gameState.program[targetIndex] = commandData;
                        }
                    } else if (source === 'slot') {
                        if (gameState.draggedBlockIndex !== null && gameState.draggedBlockIndex !== targetIndex) {
                            const temp = gameState.program[targetIndex];
                            gameState.program[targetIndex] = gameState.program[gameState.draggedBlockIndex];
                            gameState.program[gameState.draggedBlockIndex] = temp;
                        }
                    }
                    
                    updateProgramSlots();
                });
                
                programSlots.appendChild(slot);
            }
            
            updateProgramSlots();
        }

        function updateProgramSlots() {
            const slots = document.querySelectorAll('.program-slot');
            
            slots.forEach((slot, index) => {
                const commandData = gameState.program[index];
                
                slot.innerHTML = '';
                slot.textContent = index + 1;
                slot.classList.remove('filled');
                
                if (commandData) {
                    const block = document.createElement('div');
                    block.className = 'program-block';
                    
                    const commandText = document.createElement('div');
                    commandText.textContent = getCommandText(commandData);
                    block.appendChild(commandText);
                    
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
                    
                    block.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify(commandData));
                        e.dataTransfer.setData('source', 'slot');
                        gameState.draggedBlockIndex = index;
                    });
                    
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

        function runProgram() {
            if (gameState.isRunning || gameState.program.length === 0) return;
            
            gameState.isRunning = true;
            gameState.currentStep = 0;
            gameState.currentCommandSteps = 0;
            gameState.totalCommandSteps = 0;
            executeNextStep();
        }

        function executeNextStep() {
            if (!gameState.isRunning) return;
            
            if (gameState.currentCommandSteps < gameState.totalCommandSteps) {
                performMovementStep();
                gameState.currentCommandSteps++;
                
                if (gameState.currentCommandSteps >= gameState.totalCommandSteps) {
                    gameState.currentStep++;
                    gameState.currentCommandSteps = 0;
                    gameState.totalCommandSteps = 0;
                }
                
                setTimeout(executeNextStep, 300);
                return;
            }
            
            if (gameState.currentStep >= gameState.program.length) {
                gameState.isRunning = false;
                checkGameResult();
                return;
            }
            
            const commandData = gameState.program[gameState.currentStep];
            
            if (!commandData) {
                gameState.currentStep++;
                setTimeout(executeNextStep, 100);
                return;
            }
            
            if (commandData.command === 'attack') {
                const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
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
                gameState.totalCommandSteps = commandData.steps;
                gameState.currentCommandSteps = 0;
                executeNextStep();
            }
        }

        function performMovementStep() {
            const commandData = gameState.program[gameState.currentStep];
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            
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
            
            if (isOnEnemy(level.robot.x, level.robot.y)) {
                gameState.isRunning = false;
                enemyTitle.textContent = 'СТОЛКНОВЕНИЕ С ВРАГОМ!';
                enemyMessage.textContent = 'Робот столкнулся с врагом и был уничтожен.';
                enemyCollisionElement.classList.remove('hidden');
                gameUI.classList.add('blocked');
                programmingArea.classList.add('blocked');
                return;
            }
        }

        function isObstacle(x, y) {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            return level.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
        }

        function isOnEnemy(x, y) {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            return level.enemies.some(enemy => enemy.x === x && enemy.y === y);
        }

        function checkGameResult() {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            
            const isOnTarget = level.robot.x === level.target.x && level.robot.y === level.target.y;
            const allEnemiesDefeated = level.enemies.length === 0;
            
            if (isOnTarget && allEnemiesDefeated) {
                gameState.gameResult = 'win';
                level.completed = true;
                
                gameState.userData.coins += level.reward || 10;
                updateCoinsDisplay();
                saveToLocalStorage();
                
                showGameResult(true, level.reward || 10);
                
                if (gameState.currentLevel < gameState.levels.length - 1) {
                    gameState.levels[gameState.currentLevel + 1].unlocked = true;
                }
            } else if (isOnTarget && !allEnemiesDefeated) {
                gameState.gameResult = 'lose';
                failTitle.textContent = 'ВРАГИ НЕ УНИЧТОЖЕНЫ!';
                failMessage.textContent = 'Робот достиг цели, но не все враги уничтожены.';
                showGameResult(false);
            } else {
                gameState.gameResult = 'lose';
                showGameResult(false);
            }
        }

        function showGameResult(isWin, coinsEarned = 0) {
            gameUI.classList.add('blocked');
            programmingArea.classList.add('blocked');
            
            if (isWin) {
                resultTitle.textContent = 'УРОВЕНЬ ПРОЙДЕН!';
                resultMessage.textContent = `Поздравляем! Вы заработали ${coinsEarned} монет.`;
                gameResultElement.classList.remove('hidden');
            } else {
                gameFailElement.classList.remove('hidden');
            }
        }

        function retryLevel() {
            gameFailElement.classList.add('hidden');
            enemyCollisionElement.classList.add('hidden');
            resetLevelState(gameState.currentLevel);
            updateProgramSlots();
            gameUI.classList.remove('blocked');
            programmingArea.classList.remove('blocked');
        }

        function nextLevel() {
            gameResultElement.classList.add('hidden');
            
            if (gameState.currentLevel < gameState.levels.length - 1) {
                startLevel(gameState.currentLevel + 1);
            } else {
                showScreen('levels');
            }
        }

        function resetProgram() {
            gameState.program = [];
            updateProgramSlots();
        }

        function resetGame() {
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            
            level.robot = {...level.robot};
            level.enemies = [...level.enemies];
            level.obstacles = [...level.obstacles];
            
            gameState.program = [];
            gameState.isRunning = false;
            gameState.currentStep = 0;
            gameState.gameOver = false;
            gameState.gameResult = null;
            gameState.currentCommandSteps = 0;
            gameState.totalCommandSteps = 0;
            
            updateProgramSlots();
        }

        function updateCoinsDisplay() {
            document.getElementById('coins-count').textContent = gameState.userData.coins;
        }

        function saveToLocalStorage() {
            localStorage.setItem('robotGameData', JSON.stringify(gameState.userData));
        }

        function loadFromLocalStorage() {
            const savedData = localStorage.getItem('robotGameData');
            if (savedData) {
                gameState.userData = JSON.parse(savedData);
            }
            updateCoinsDisplay();
        }

        function renderGame() {
            ctx.fillStyle = COLORS.BACKGROUND;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const allLevels = [...gameState.levels, ...gameState.userData.customLevels];
            const level = allLevels[gameState.currentLevel];
            
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
            
            ctx.fillStyle = COLORS.OBSTACLE;
            level.obstacles.forEach(obstacle => {
                const screenX = offsetX + (obstacle.x + gameState.levelOffset.x) * gridSize;
                const screenY = offsetY + (obstacle.y + gameState.levelOffset.y) * gridSize;
                ctx.fillRect(screenX, screenY, gridSize, gridSize);
            });
            
            ctx.fillStyle = COLORS.TARGET;
            const targetX = offsetX + (level.target.x + gameState.levelOffset.x) * gridSize;
            const targetY = offsetY + (level.target.y + gameState.levelOffset.y) * gridSize;
            ctx.fillRect(targetX, targetY, gridSize, gridSize);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(targetX, targetY, gridSize, gridSize);
            
            level.enemies.forEach(enemy => {
                const screenX = offsetX + (enemy.x + gameState.levelOffset.x) * gridSize;
                const screenY = offsetY + (enemy.y + gameState.levelOffset.y) * gridSize;
                
                if (textures.enemy.complete) {
                    const size = gridSize * 2;
                    const offset = (size - gridSize) / 2;
                    ctx.drawImage(textures.enemy, screenX - offset, screenY - offset, size, size);
                } else {
                    ctx.fillStyle = COLORS.ENEMY;
                    const size = gridSize * 1.5;
                    const offset = (size - gridSize) / 2;
                    ctx.fillRect(screenX - offset, screenY - offset, size, size);
                }
                
                ctx.strokeStyle = 'rgba(239, 83, 80, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(
                    screenX + gridSize / 2,
                    screenY + gridSize / 2,
                    gridSize * 1.5,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            });
            
            const robotX = offsetX + (level.robot.x + gameState.levelOffset.x) * gridSize;
            const robotY = offsetY + (level.robot.y + gameState.levelOffset.y) * gridSize;
            
            if (textures.robot.complete) {
                const size = gridSize * 2;
                const offset = (size - gridSize) / 2;
                ctx.drawImage(textures.robot, robotX - offset, robotY - offset, size, size);
            } else {
                ctx.fillStyle = COLORS.ROBOT;
                const size = gridSize * 1.5;
                const offset = (size - gridSize) / 2;
                ctx.fillRect(robotX - offset, robotY - offset, size, size);
                
                ctx.fillStyle = '#5d4037';
                const innerSize = size * 0.8;
                const innerOffset = (size - innerSize) / 2;
                ctx.fillRect(
                    robotX - offset + innerOffset,
                    robotY - offset + innerOffset,
                    innerSize,
                    innerSize
                );
                
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

        function gameLoop() {
            if (gameState.currentScreen === 'game') {
                renderGame();
            }
            
            requestAnimationFrame(gameLoop);
        }

        init();
    </script>
</body>
</html>
