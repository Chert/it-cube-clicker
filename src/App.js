import React, { useState, useEffect } from 'react';
import { Code, Cpu, Server, Database, Smartphone, Globe, Award } from 'lucide-react';

const ClickerGame = () => {
  // Основные состояния игры
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickerCount, setAutoClickerCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 1.5 минуты на игру
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [rank, setRank] = useState('');

  // Цены улучшений
  const [upgradesPrices, setUpgradesPrices] = useState({
    multiplier: 50,
    autoClicker: 100,
  });

  // Достижения и навыки
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'Java/Python программист', threshold: 100, unlocked: false, icon: <Code /> },
    { id: 2, name: 'Системный администратор', threshold: 500, unlocked: false, icon: <Server /> },
    { id: 3, name: 'Разработчик мобильных приложений', threshold: 1000, unlocked: false, icon: <Smartphone /> },
    { id: 4, name: 'VR/AR специалист', threshold: 2000, unlocked: false, icon: <Globe /> },
    { id: 5, name: 'Робототехник', threshold: 5000, unlocked: false, icon: <Cpu /> },
  ]);

  // Анимации кликов
  const [clickAnimations, setClickAnimations] = useState([]);

  // Функция для добавления анимации клика
  const addClickAnimation = (x, y) => {
    const id = Date.now();
    setClickAnimations(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 1000);
  };

  // Обработчик клика по гусю
  const handleClick = (e) => {
    if (!gameStarted || gameOver) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setScore(prevScore => prevScore + multiplier);
    addClickAnimation(x, y);
    
    // Проверка достижений
    checkAchievements(score + multiplier);
  };

  // Покупка улучшения множителя
  const buyMultiplier = () => {
    if (score >= upgradesPrices.multiplier) {
      setScore(prev => prev - upgradesPrices.multiplier);
      setMultiplier(prev => prev + 1);
      setUpgradesPrices(prev => ({
        ...prev,
        multiplier: Math.floor(prev.multiplier * 1.5)
      }));
    }
  };

  // Покупка автокликера
  const buyAutoClicker = () => {
    if (score >= upgradesPrices.autoClicker) {
      setScore(prev => prev - upgradesPrices.autoClicker);
      setAutoClickerCount(prev => prev + 1);
      setUpgradesPrices(prev => ({
        ...prev,
        autoClicker: Math.floor(prev.autoClicker * 1.7)
      }));
    }
  };

  // Проверка достижений
  const checkAchievements = (currentScore) => {
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlocked && currentScore >= achievement.threshold) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });
    
    setAchievements(updatedAchievements);
  };

  // Определение ранга на основе счета
  const calculateRank = (finalScore) => {
    if (finalScore >= 5000) return 'Робототехник';
    if (finalScore >= 2000) return 'VR/AR специалист';
    if (finalScore >= 1000) return 'Разработчик мобильных приложений';
    if (finalScore >= 500) return 'Системный администратор';
    if (finalScore >= 100) return 'Java/Python программист';
    return 'Начинающий';
  };

  // Эффект автокликера
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const autoClickInterval = setInterval(() => {
      if (autoClickerCount > 0) {
        setScore(prev => {
          const newScore = prev + autoClickerCount;
          // Проверяем достижения внутри setScore для синхронизации
          checkAchievements(newScore);
          return newScore;
        });
      }
    }, 1000);

    return () => clearInterval(autoClickInterval);
  }, [autoClickerCount, gameStarted, gameOver]);

  // Таймер игры
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          // Получаем актуальное значение score в момент окончания игры
          setRank(currentRank => calculateRank(score));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Начало игры
  const startGame = () => {
    setShowIntro(false);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setMultiplier(1);
    setAutoClickerCount(0);
    setTimeLeft(90);
    setUpgradesPrices({
      multiplier: 50,
      autoClicker: 100,
    });
    setAchievements(achievements.map(a => ({ ...a, unlocked: false })));
  };

  // Перезапуск игры
  const restartGame = () => {
    startGame();
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Отображение интро
  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white p-6">
        <h1 className="text-4xl font-bold mb-4">IT-куб Арзамас</h1>
        <div className="bg-white rounded-lg p-6 mb-6 text-blue-800 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">IT-гусь Кликер</h2>
          <p className="mb-4">Привет! Познакомься с нашим маскотом — IT-гусем. Помоги ему набрать цифровые навыки, кликая и приобретая улучшения.</p>
          <p className="mb-4">IT-куб — это современная площадка для обучения детей и подростков Hard-компетенциям в сфере информационных технологий.</p>
          <p className="mb-4">У тебя будет <strong>90 секунд</strong>, чтобы стать настоящим IT-профессионалом!</p>
          <p className="mb-4"><strong>Как играть:</strong></p>
          <ul className="list-disc pl-5 mb-4">
            <li>Кликай по IT-гусю, чтобы заработать очки навыков</li>
            <li>Покупай множители, чтобы получать больше очков за клик</li>
            <li>Приобретай автокликеры для пассивного заработка</li>
            <li>Открывай достижения и зарабатывай специальности в IT</li>
          </ul>
        </div>
        <button 
          onClick={startGame}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-full text-xl shadow-lg transform transition hover:scale-105"
        >
          Начать игру!
        </button>
      </div>
    );
  }

  // Отображение экрана завершения игры
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white p-6">
        <h1 className="text-4xl font-bold mb-4">Игра завершена!</h1>
        <div className="bg-white rounded-lg p-6 mb-6 text-blue-800 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Твои результаты:</h2>
          <p className="text-xl mb-2">Очки навыков: <strong>{score}</strong></p>
          <p className="text-xl mb-2">Твой ранг: <strong>{rank}</strong></p>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Полученные достижения:</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.filter(a => a.unlocked).map(achievement => (
                <div key={achievement.id} className="bg-blue-100 p-2 rounded flex items-center">
                  <span className="mr-2">{achievement.icon}</span>
                  {achievement.name}
                </div>
              ))}
              {!achievements.some(a => a.unlocked) && <p>Нет достижений. Попробуй ещё раз!</p>}
            </div>
          </div>
        </div>
                  <div className="mb-6 bg-yellow-100 text-blue-800 p-4 rounded-lg max-w-lg">
          <h3 className="text-xl font-bold mb-2">IT-куб Арзамас</h3>
          <p>IT-куб организует обучение по программам, направленным на изучение:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>языков программирования Java, Python, C-подобных языков программирования;</li>
            <li>системного администрирования;</li>
            <li>разработки мобильных приложений и технологий виртуальной и дополненной реальности;</li>
            <li>робототехники.</li>
          </ul>
          <p className="mt-2">Приходи к нам учиться и стань настоящим IT-специалистом!</p>
          <p className="mt-2">IT-куб является структурным подразделением Арзамасского техникума строительства и предпринимательства.</p>
        </div>
        <button 
          onClick={restartGame}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-full text-xl shadow-lg transform transition hover:scale-105"
        >
          Играть снова
        </button>
      </div>
    );
  }

  // Основной игровой экран
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div className="bg-blue-800 p-2 rounded-lg">
          <span className="font-bold">Очки: {score}</span>
        </div>
        <div className="bg-blue-800 p-2 rounded-lg">
          <span className="font-bold">Время: {formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-4 mb-4">
        {/* Левая панель - улучшения */}
        <div className="w-full md:w-1/4 bg-blue-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Улучшения</h2>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Множитель: x{multiplier}</span>
              <span>{upgradesPrices.multiplier} очков</span>
            </div>
            <button 
              onClick={buyMultiplier}
              disabled={score < upgradesPrices.multiplier}
              className={`w-full py-2 px-4 rounded ${score >= upgradesPrices.multiplier ? 'bg-yellow-400 hover:bg-yellow-500 text-blue-900' : 'bg-gray-600 text-gray-300'}`}
            >
              Улучшить (+1)
            </button>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span>Автокликеры: {autoClickerCount}</span>
              <span>{upgradesPrices.autoClicker} очков</span>
            </div>
            <button 
              onClick={buyAutoClicker}
              disabled={score < upgradesPrices.autoClicker}
              className={`w-full py-2 px-4 rounded ${score >= upgradesPrices.autoClicker ? 'bg-yellow-400 hover:bg-yellow-500 text-blue-900' : 'bg-gray-600 text-gray-300'}`}
            >
              Купить (+1)
            </button>
          </div>
        </div>
        
        {/* Центральная панель - IT-гусь */}
        <div className="w-full md:w-2/4 bg-blue-800 p-4 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
          {/* Здесь будет ваше изображение IT-гуся */}
          <div 
            onClick={handleClick}
            className="w-48 h-48 bg-white rounded-full flex items-center justify-center cursor-pointer transform transition hover:scale-105 active:scale-95"
            style={{ position: 'relative' }}
          >
            {/* Здесь будет изображение IT-гуся */}
            <img src="/api/placeholder/200/200" alt="IT-гусь" className="w-full h-full object-contain" />
            
            {/* Анимации кликов */}
            {clickAnimations.map(anim => (
              <div 
                key={anim.id}
                className="absolute text-yellow-400 font-bold animate-bounce-up opacity-0"
                style={{ 
                  left: `${anim.x}px`, 
                  top: `${anim.y}px`,
                  animation: 'bounce-up 1s forwards',
                }}
              >
                +{multiplier}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-lg">Кликай по IT-гусю!</p>
        </div>
        
        {/* Правая панель - достижения */}
        <div className="w-full md:w-1/4 bg-blue-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Достижения</h2>
          <div className="space-y-2">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`p-2 rounded flex items-center ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-700'}`}
              >
                <span className="mr-2">{achievement.icon}</span>
                <div>
                  <div>{achievement.name}</div>
                  <div className="text-xs">{achievement.threshold} очков</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Прогресс-бар достижений */}
      <div className="w-full max-w-4xl bg-blue-800 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Твой прогресс</h2>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div 
            className="bg-yellow-400 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (score / 5000) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>Начинающий</span>
          <span>Java/Python</span>
          <span>Сис.админ</span>
          <span>Мобильная разработка</span>
          <span>VR/AR</span>
          <span>Робототехника</span>
        </div>
      </div>

      {/* CSS для анимаций */}
      <style jsx>{`
        @keyframes bounce-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ClickerGame;