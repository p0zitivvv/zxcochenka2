// Утилиты для работы с localStorage

const STORAGE_KEY = 'faceoff_data';
const VOTED_KEY = 'faceoff_voted';

// Получить данные о голосах
export const getVotesData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Сохранить данные о голосах
export const saveVotesData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Добавить голос
export const addVote = (personId) => {
  const data = getVotesData();
  data[personId] = (data[personId] || 0) + 1;
  saveVotesData(data);
  return data[personId];
};

// Получить количество голосов для участника
export const getVotes = (personId) => {
  const data = getVotesData();
  return data[personId] || 0;
};

// Проверить, голосовал ли пользователь сегодня
export const hasVotedToday = () => {
  const voted = localStorage.getItem(VOTED_KEY);
  if (!voted) return false;
  
  const votedDate = new Date(voted);
  const today = new Date();
  return votedDate.toDateString() === today.toDateString();
};

// Отметить, что пользователь проголосовал
export const markAsVoted = () => {
  localStorage.setItem(VOTED_KEY, new Date().toISOString());
};

// Получить рейтинг участников
export const getRanking = () => {
  const data = getVotesData();
  return Object.entries(data)
    .map(([id, votes]) => ({ id, votes }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 100);
};

