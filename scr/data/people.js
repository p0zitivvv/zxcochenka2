// Данные участников (в реальном проекте это будет загружаться с сервера)
// Используем placeholder изображения от Unsplash

export const people = [
  { id: '1', name: 'Алексей', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: '2', name: 'Мария', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
  { id: '3', name: 'Дмитрий', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: '4', name: 'Анна', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
  { id: '5', name: 'Иван', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: '6', name: 'Елена', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
  { id: '7', name: 'Сергей', photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop' },
  { id: '8', name: 'Ольга', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
  { id: '9', name: 'Максим', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: '10', name: 'София', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
  { id: '11', name: 'Артем', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: '12', name: 'Виктория', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop' },
  { id: '13', name: 'Никита', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: '14', name: 'Дарья', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop' },
  { id: '15', name: 'Павел', photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop' },
  { id: '16', name: 'Ксения', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop' },
  { id: '17', name: 'Роман', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: '18', name: 'Полина', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
  { id: '19', name: 'Владимир', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: '20', name: 'Алиса', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop' },
];

// Получить случайную пару участников
export const getRandomPair = (excludeIds = []) => {
  const available = people.filter(p => !excludeIds.includes(p.id));
  
  if (available.length < 2) {
    // Если не хватает участников, возвращаем случайную пару из всех
    const shuffled = [...people].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }
  
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
};

