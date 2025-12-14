// Данные участников
const people = [
    { id: '1', name: 'Алексей', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { id: '2', name: 'Мария', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { id: '3', name: 'Дмитрий', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
    { id: '4', name: 'Анна', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
    { id: '5', name: 'Иван', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
    { id: '6', name: 'Елена', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
    { id: '7', name: 'Сергей', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop' },
    { id: '8', name: 'Ольга', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
    { id: '9', name: 'Максим', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
    { id: '10', name: 'София', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
    { id: '11', name: 'Артем', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { id: '12', name: 'Виктория', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop' },
    { id: '13', name: 'Никита', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
    { id: '14', name: 'Дарья', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop' },
    { id: '15', name: 'Павел', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop' },
    { id: '16', name: 'Ксения', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop' },
    { id: '17', name: 'Роман', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { id: '18', name: 'Полина', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
    { id: '19', name: 'Владимир', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
    { id: '20', name: 'Алиса', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
];

// Текущая пара
let currentPair = [];
let lastVotedPair = null;

// Состояние свайпа
let swipeState = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    targetCard: null
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('rating.html')) {
        // Страница рейтинга уже обрабатывается в rating.html
        return;
    }
    
    initializeVoting();
});

// Инициализация страницы голосования
async function initializeVoting() {
    // Загружаем глобальные данные
    await loadGlobalVotes();
    loadNewPair();
    updateTotalVotes();
    setupSwipeListeners();
    setupButtonListeners();
    updateSyncStatus();
    
    // Периодически обновляем глобальные данные (если настроен API)
    if (GLOBAL_STORAGE_CONFIG.binId) {
        setInterval(async () => {
            await loadGlobalVotes();
            updateTotalVotes();
            updateSyncStatus();
            // Обновляем счётчики на карточках
            if (currentPair.length === 2) {
                updateCard(1, currentPair[0]);
                updateCard(2, currentPair[1]);
            }
        }, 5000); // Обновляем каждые 5 секунд для более быстрой синхронизации
    }
}

// Обновление статуса синхронизации
function updateSyncStatus() {
    const syncStatus = document.getElementById('syncStatus');
    if (!syncStatus) return;
    
    if (GLOBAL_STORAGE_CONFIG.binId && GLOBAL_STORAGE_CONFIG.apiKey) {
        syncStatus.textContent = '🌐 Глобальный рейтинг';
        syncStatus.style.display = 'inline';
        syncStatus.style.color = '#4CAF50';
        syncStatus.style.fontSize = '0.85rem';
        syncStatus.style.fontWeight = '600';
    } else if (GLOBAL_STORAGE_CONFIG.binId && !GLOBAL_STORAGE_CONFIG.apiKey) {
        syncStatus.textContent = '⚠️ Только чтение (настройте API ключ)';
        syncStatus.style.display = 'inline';
        syncStatus.style.color = '#FF9800';
        syncStatus.style.fontSize = '0.85rem';
    } else {
        syncStatus.textContent = '💾 Локальный режим';
        syncStatus.style.display = 'inline';
        syncStatus.style.color = '#666';
        syncStatus.style.fontSize = '0.85rem';
    }
}

// Загрузка новой пары участников
function loadNewPair() {
    // Получаем последнюю проголосованную пару
    const lastPair = getLastVotedPair();
    
    // Генерируем новую пару, исключая последнюю
    let newPair;
    do {
        newPair = getRandomPair();
    } while (isSamePair(newPair, lastPair) && people.length > 2);
    
    currentPair = newPair;
    lastVotedPair = lastPair;
    
    // Обновляем карточки
    updateCard(1, newPair[0]);
    updateCard(2, newPair[1]);
}

// Получить случайную пару
function getRandomPair() {
    const shuffled = [...people].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
}

// Проверить, одинаковая ли пара
function isSamePair(pair1, pair2) {
    if (!pair2) return false;
    const ids1 = pair1.map(p => p.id).sort().join(',');
    const ids2 = pair2.map(p => p.id).sort().join(',');
    return ids1 === ids2;
}

// Обновить карточку
function updateCard(cardNum, person) {
    const card = document.getElementById(`card${cardNum}`);
    const image = document.getElementById(`image${cardNum}`);
    const name = document.getElementById(`name${cardNum}`);
    const votes = document.getElementById(`votes${cardNum}`);
    
    card.setAttribute('data-person-id', person.id);
    image.src = person.image;
    image.alt = person.name;
    name.textContent = person.name;
    
    const voteCount = getVotes(person.id);
    votes.textContent = `${voteCount} ${getVoteWord(voteCount)}`;
}

// Получить правильное склонение слова "голос"
function getVoteWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'голос';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'голоса';
    return 'голосов';
}

// Настройка слушателей свайпов
function setupSwipeListeners() {
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    
    [card1, card2].forEach((card, index) => {
        // Touch события
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Mouse события для десктопа (drag)
        card.addEventListener('mousedown', handleMouseDown);
    });
}

// Обработка начала касания
function handleTouchStart(e) {
    const touch = e.touches[0];
    swipeState.startX = touch.clientX;
    swipeState.startY = touch.clientY;
    swipeState.isSwiping = false;
    swipeState.targetCard = e.currentTarget;
}

// Обработка движения касания
function handleTouchMove(e) {
    if (!swipeState.targetCard) return;
    
    const touch = e.touches[0];
    swipeState.currentX = touch.clientX;
    swipeState.currentY = touch.clientY;
    
    const deltaX = swipeState.currentX - swipeState.startX;
    const deltaY = swipeState.currentY - swipeState.startY;
    
    // Определяем, это свайп или скролл
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
        swipeState.isSwiping = true;
        
        const card = swipeState.targetCard;
        card.classList.add('swiping');
        
        const rotation = deltaX * 0.1;
        const translateX = deltaX;
        
        card.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / 300;
    }
}

// Обработка окончания касания
function handleTouchEnd(e) {
    if (!swipeState.targetCard) return;
    
    const card = swipeState.targetCard;
    const deltaX = swipeState.currentX - swipeState.startX;
    
    card.classList.remove('swiping');
    
    // Если свайп достаточно большой, регистрируем голос
    if (swipeState.isSwiping && Math.abs(deltaX) > 100) {
        const personId = card.getAttribute('data-person-id');
        const side = deltaX > 0 ? 'right' : 'left';
        
        // Определяем, за какую карточку голосуем
        let votedPersonId;
        if (side === 'left' && card.id === 'card1') {
            votedPersonId = currentPair[0].id;
        } else if (side === 'right' && card.id === 'card2') {
            votedPersonId = currentPair[1].id;
        } else {
            // Свайп в неправильную сторону - голосуем за противоположную карточку
            votedPersonId = card.id === 'card1' ? currentPair[1].id : currentPair[0].id;
        }
        
        // Анимация свайпа
        card.classList.add(deltaX > 0 ? 'swiped-right' : 'swiped-left');
        
        // Регистрируем голос
        setTimeout(() => {
            registerVote(votedPersonId);
        }, 300);
    } else {
        // Возвращаем карточку на место
        card.style.transform = '';
        card.style.opacity = '';
    }
    
    // Сброс состояния
    swipeState = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isSwiping: false,
        targetCard: null
    };
}

// Обработка начала перетаскивания мышью
function handleMouseDown(e) {
    if (e.button !== 0) return; // Только левая кнопка мыши
    
    swipeState.startX = e.clientX;
    swipeState.startY = e.clientY;
    swipeState.isSwiping = false;
    swipeState.targetCard = e.currentTarget;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

// Обработка движения мыши
function handleMouseMove(e) {
    if (!swipeState.targetCard) return;
    
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
    
    const deltaX = swipeState.currentX - swipeState.startX;
    const deltaY = swipeState.currentY - swipeState.startY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        swipeState.isSwiping = true;
        
        const card = swipeState.targetCard;
        card.classList.add('swiping');
        
        const rotation = deltaX * 0.1;
        const translateX = deltaX;
        
        card.style.transform = `translateX(${translateX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / 300;
    }
}

// Обработка окончания перетаскивания мышью
function handleMouseUp(e) {
    if (!swipeState.targetCard) return;
    
    const card = swipeState.targetCard;
    const deltaX = swipeState.currentX - swipeState.startX;
    
    card.classList.remove('swiping');
    
    if (swipeState.isSwiping && Math.abs(deltaX) > 100) {
        const personId = card.getAttribute('data-person-id');
        const side = deltaX > 0 ? 'right' : 'left';
        
        let votedPersonId;
        if (side === 'left' && card.id === 'card1') {
            votedPersonId = currentPair[0].id;
        } else if (side === 'right' && card.id === 'card2') {
            votedPersonId = currentPair[1].id;
        } else {
            votedPersonId = card.id === 'card1' ? currentPair[1].id : currentPair[0].id;
        }
        
        card.classList.add(deltaX > 0 ? 'swiped-right' : 'swiped-left');
        
        setTimeout(() => {
            registerVote(votedPersonId);
        }, 300);
    } else {
        card.style.transform = '';
        card.style.opacity = '';
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    swipeState = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isSwiping: false,
        targetCard: null
    };
}

// Настройка слушателей кнопок
function setupButtonListeners() {
    const buttons = document.querySelectorAll('.vote-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const side = this.getAttribute('data-side');
            const personId = side === 'left' ? currentPair[0].id : currentPair[1].id;
            registerVote(personId);
        });
    });
}

// Регистрация голоса
async function registerVote(personId) {
    // Сохраняем текущую пару как последнюю проголосованную
    saveLastVotedPair(currentPair);
    
    // Добавляем голос (асинхронно)
    await addVote(personId);
    
    // Обновляем статистику
    updateTotalVotes();
    
    // Загружаем новую пару
    setTimeout(() => {
        loadNewPair();
        // Сбрасываем анимации
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('swiped-left', 'swiped-right');
            card.style.transform = '';
            card.style.opacity = '';
        });
    }, 500);
}

// Конфигурация для глобального хранилища
// Используем JSONBin.io для синхронизации данных между всеми устройствами
// 
// 🌐 ВАЖНО: Для глобального рейтинга нужно настроить один раз:
// 1. Зайдите на https://jsonbin.io/ и создайте аккаунт (бесплатно)
// 2. Создайте новый bin с пустым объектом: {}
// 3. Скопируйте bin ID из URL (например: если URL = https://jsonbin.io/abc123/def456, то binId = 'abc123/def456')
// 4. Получите Master Key в Settings → API Keys
// 5. Вставьте их ниже
//
// После настройки рейтинг и счётчик будут ОДИНАКОВЫМИ для всех пользователей!
const GLOBAL_STORAGE_CONFIG = {
    binId: 'b/693e82c3ae596e708f990b3a', // Вставьте ваш bin ID (например: 'abc123/def456')
    apiUrl: 'https://api.jsonbin.io/v3/b',
    apiKey: '$2a$10$I8HYQtcgzHWnjXsl9gVHX.m0hhNorVdanfTQMYFMusbRDwJARA8vK' // Вставьте ваш Master Key из jsonbin.io
};

// Работа с localStorage (локальный кэш)
function getLocalVotesData() {
    const data = localStorage.getItem('faceoff_votes');
    return data ? JSON.parse(data) : {};
}

function saveLocalVotesData(data) {
    localStorage.setItem('faceoff_votes', JSON.stringify(data));
}

// Работа с глобальным хранилищем
let globalVotesData = {};

// Загрузка глобальных данных
async function loadGlobalVotes() {
    // Если API не настроен, используем только локальные данные
    if (!GLOBAL_STORAGE_CONFIG.binId) {
        globalVotesData = getLocalVotesData();
        return globalVotesData;
    }
    
    try {
        // Пытаемся загрузить из глобального хранилища
        // Для публичных bins можно читать без API ключа
        const headers = {
            'X-Bin-Meta': 'false'
        };
        
        // Если есть API ключ, используем его (для приватных bins)
        if (GLOBAL_STORAGE_CONFIG.apiKey) {
            headers['X-Master-Key'] = GLOBAL_STORAGE_CONFIG.apiKey;
        }
        
        const response = await fetch(`${GLOBAL_STORAGE_CONFIG.apiUrl}/${GLOBAL_STORAGE_CONFIG.binId}/latest`, {
            headers: headers,
            cache: 'no-cache' // Всегда получаем свежие данные
        });
        
        if (response.ok) {
            const result = await response.json();
            globalVotesData = result.record || {};
            
            // Объединяем с локальными данными (на случай, если были локальные голоса)
            const localData = getLocalVotesData();
            for (const [id, votes] of Object.entries(localData)) {
                if (!globalVotesData[id] || globalVotesData[id] < votes) {
                    globalVotesData[id] = votes;
                }
            }
            
            // Синхронизируем с локальным хранилищем
            saveLocalVotesData(globalVotesData);
            return globalVotesData;
        } else {
            console.log('Не удалось загрузить глобальные данные, используем локальные');
            globalVotesData = getLocalVotesData();
        }
    } catch (error) {
        console.log('Ошибка загрузки глобальных данных, используем локальные:', error);
        // Используем локальные данные как fallback
        globalVotesData = getLocalVotesData();
    }
    
    // Если не удалось загрузить, используем локальные данные
    if (Object.keys(globalVotesData).length === 0) {
        globalVotesData = getLocalVotesData();
    }
    
    return globalVotesData;
}

// Сохранение глобальных данных
async function saveGlobalVotes(data) {
    globalVotesData = data;
    saveLocalVotesData(data);
    
    // Пытаемся сохранить в глобальное хранилище (только если настроено)
    if (GLOBAL_STORAGE_CONFIG.binId && GLOBAL_STORAGE_CONFIG.apiKey) {
        try {
            const response = await fetch(`${GLOBAL_STORAGE_CONFIG.apiUrl}/${GLOBAL_STORAGE_CONFIG.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': GLOBAL_STORAGE_CONFIG.apiKey
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log('✅ Голоса успешно синхронизированы с сервером');
            } else {
                console.log('⚠️ Не удалось сохранить в глобальное хранилище');
            }
        } catch (error) {
            console.log('⚠️ Ошибка синхронизации с сервером:', error);
            // Данные уже сохранены локально, продолжаем работу
        }
    } else if (GLOBAL_STORAGE_CONFIG.binId && !GLOBAL_STORAGE_CONFIG.apiKey) {
        console.log('⚠️ API ключ не настроен. Голоса сохраняются только локально.');
        console.log('💡 Для глобальной синхронизации настройте API ключ (см. SETUP.md)');
    }
}

// Получить данные о голосах (сначала из глобального хранилища)
function getVotesData() {
    // Используем глобальные данные, если они загружены
    if (Object.keys(globalVotesData).length > 0) {
        return globalVotesData;
    }
    // Иначе используем локальные
    return getLocalVotesData();
}

function saveVotesData(data) {
    saveGlobalVotes(data);
}

async function addVote(personId) {
    const data = getVotesData();
    data[personId] = (data[personId] || 0) + 1;
    await saveVotesData(data);
    return data[personId];
}

function getVotes(personId) {
    const data = getVotesData();
    return data[personId] || 0;
}

function getLastVotedPair() {
    const data = localStorage.getItem('faceoff_last_pair');
    if (!data) return null;
    const ids = JSON.parse(data);
    return people.filter(p => ids.includes(p.id));
}

function saveLastVotedPair(pair) {
    const ids = pair.map(p => p.id);
    localStorage.setItem('faceoff_last_pair', JSON.stringify(ids));
}

function updateTotalVotes() {
    const data = getVotesData();
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    const totalElement = document.getElementById('totalVotes');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

// Отображение рейтинга
async function displayRating() {
    const ratingList = document.getElementById('ratingList');
    if (!ratingList) return;
    
    // Загружаем глобальные данные перед отображением
    await loadGlobalVotes();
    const votesData = getVotesData();
    const peopleMap = new Map(people.map(p => [p.id, p]));
    
    // Создаем массив участников с голосами
    const ranking = people.map(person => ({
        ...person,
        votes: votesData[person.id] || 0
    })).sort((a, b) => b.votes - a.votes);
    
    // Обновляем статистику
    const totalVotes = ranking.reduce((sum, p) => sum + p.votes, 0);
    const totalVotesElement = document.getElementById('totalVotesRating');
    const totalParticipantsElement = document.getElementById('totalParticipants');
    
    if (totalVotesElement) {
        totalVotesElement.textContent = totalVotes;
    }
    if (totalParticipantsElement) {
        totalParticipantsElement.textContent = ranking.length;
    }
    
    // Отображаем рейтинг
    if (ranking.length === 0 || totalVotes === 0) {
        ratingList.innerHTML = `
            <div class="empty-state">
                <p>Пока нет голосов</p>
                <p style="font-size: 1rem; color: #666; font-weight: 400;">Будьте первым, кто проголосует!</p>
            </div>
        `;
        return;
    }
    
    ratingList.innerHTML = ranking.map((person, index) => {
        const position = index + 1;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : null;
        const percentage = totalVotes > 0 ? (person.votes / totalVotes * 100) : 0;
        const topThree = position <= 3 ? 'top-three' : '';
        
        return `
            <div class="rating-item ${topThree}">
                <div class="rank-number">${medal || `#${position}`}</div>
                <div class="rating-photo">
                    <img src="${person.image}" alt="${person.name}">
                </div>
                <div class="rating-info">
                    <div class="rating-name">${person.name}</div>
                    <div class="rating-votes">${person.votes} ${getVoteWord(person.votes)}</div>
                </div>
                <div class="votes-bar-container">
                    <div class="votes-bar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

