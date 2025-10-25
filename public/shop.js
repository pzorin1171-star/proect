// Инициализация магазина
function initShop() {
    setupShopButtons();
    loadPriceSettings();
    updateCoinsDisplay();
}

// Настройка кнопок магазина
function setupShopButtons() {
    // Кнопки покупки оценок
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!hasTeacherAccess()) {
                alert('Покупка оценок доступна только в режиме учителя');
                return;
            }
            
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
    
    // Кнопка сохранения цен
    const savePricesBtn = document.getElementById('save-prices-btn');
    if (savePricesBtn) {
        savePricesBtn.addEventListener('click', savePriceSettings);
    }
    
    // Кнопка назад
    const shopBackBtn = document.getElementById('shop-back-btn');
    if (shopBackBtn) {
        shopBackBtn.addEventListener('click', () => {
            if (hasTeacherAccess()) {
                showScreen('teacher-menu');
            } else {
                showScreen('student-menu');
            }
        });
    }
    
    // Скрыть настройки цен для учеников
    if (!hasTeacherAccess()) {
        const shopSettings = document.querySelector('.shop-settings');
        if (shopSettings) {
            shopSettings.style.display = 'none';
        }
    }
}

// Загрузка настроек цен
function loadPriceSettings() {
    const savedPrices = localStorage.getItem('shopPrices');
    if (savedPrices) {
        const prices = JSON.parse(savedPrices);
        
        // Обновляем отображение цен
        Object.keys(prices).forEach(grade => {
            const priceElement = document.querySelector(`.price-amount[data-grade="${grade}"]`);
            const priceInput = document.querySelector(`.price-input[data-grade="${grade}"]`);
            
            if (priceElement) priceElement.textContent = prices[grade];
            if (priceInput) priceInput.value = prices[grade];
        });
    }
}

// Сохранение настроек цен
function savePriceSettings() {
    if (!hasTeacherAccess()) {
        alert('Настройка цен доступна только в режиме учителя');
        return;
    }
    
    const prices = {};
    
    document.querySelectorAll('.price-input').forEach(input => {
        const grade = input.dataset.grade;
        const price = parseInt(input.value);
        
        if (price >= 1 && price <= 1000) {
            prices[grade] = price;
            // Обновляем отображение цены
            const priceElement = document.querySelector(`.price-amount[data-grade="${grade}"]`);
            if (priceElement) {
                priceElement.textContent = price;
            }
        } else {
            alert(`Цена для оценки ${grade} должна быть от 1 до 1000`);
            return;
        }
    });
    
    localStorage.setItem('shopPrices', JSON.stringify(prices));
    alert('Цены успешно сохранены!');
}

// Получение цены оценки
function getGradePrice(grade) {
    const savedPrices = localStorage.getItem('shopPrices');
    if (savedPrices) {
        const prices = JSON.parse(savedPrices);
        return prices[grade] || getDefaultPrice(grade);
    }
    return getDefaultPrice(grade);
}

// Цены по умолчанию
function getDefaultPrice(grade) {
    const defaultPrices = {
        5: 50,
        4: 30,
        3: 15,
        2: 5
    };
    return defaultPrices[grade] || 10;
}

// Показать магазин
function showShop() {
    if (!hasTeacherAccess()) {
        alert('Магазин оценок доступен только в режиме учителя');
        return;
    }
    
    updateCoinsDisplay();
    loadPriceSettings();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Магазин инициализируется при переходе на экран магазина
});
