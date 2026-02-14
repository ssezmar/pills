import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/Card';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Pill, Plus, Trash2, Check, Clock, Sparkles, Heart, X } from 'lucide-react';

function App() {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: '', time: '', dosage: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [showValentine, setShowValentine] = useState(false);
  const [petalWave, setPetalWave] = useState(0);
  const [glow, setGlow] = useState(false);
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (petalWave > 0) {
      const newPetals = [...Array(70)].map(() => ({
        left: Math.random() * 100,
        rotate: Math.random() * 360,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 1.5,
        img: loveImages[Math.floor(Math.random() * loveImages.length)]
      }));
      setPetals(newPetals);

      // Reset wave after some time if нужно
      const timer = setTimeout(() => setPetals([]), 7000);
      return () => clearTimeout(timer);
    }
  }, [petalWave]);

  const loveImages = Array.from({ length: 44 }, (_, i) => 
    `/love/sticker${i + 1}.webp`
  );



  // Load data and request notification permission
  useEffect(() => {
    const saved = localStorage.getItem('pill-tracker-data');
    if (saved) {
      try {
        setMedications(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }

    // Request notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('pill-tracker-data', JSON.stringify(medications));
  }, [medications]);

  // Schedule notifications
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkNotifications = () => {
      const now = new Date();
      medications.forEach(med => {
        if (isTakenToday(med)) return;

        const [hours, minutes] = med.time.split(':');
        const medTime = new Date();
        medTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Notify 5 minutes before
        const notifyTime = new Date(medTime.getTime() - 5 * 60 * 1000);
        
        if (now >= notifyTime && now < medTime) {
          new Notification('💊 Напоминание о таблетке', {
            body: `Скоро время принять ${med.name}`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: med.id.toString(),
            requireInteraction: true,
          });
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    checkNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [medications, notificationPermission]);

  const addMedication = () => {
    if (!newMed.name || !newMed.time) return;
    
    const medication = {
      id: Date.now(),
      name: newMed.name,
      time: newMed.time,
      dosage: newMed.dosage,
      lastTaken: null,
      history: []
    };
    
    setMedications([...medications, medication]);
    setNewMed({ name: '', time: '', dosage: '' });
    setShowAddForm(false);
    
    // Show success animation
    triggerConfetti();
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const markAsTaken = (id) => {
    const now = new Date().toISOString();
    setMedications(medications.map(med => {
      if (med.id === id) {
        triggerConfetti();
        return {
          ...med,
          lastTaken: now,
          history: [...(med.history || []), now]
        };
      }
      return med;
    }));
  };

  const isTakenToday = (med) => {
    if (!med.lastTaken) return false;
    const today = new Date().toDateString();
    const lastTaken = new Date(med.lastTaken).toDateString();
    return today === lastTaken;
  };

  const getTimeUntil = (time) => {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const target = new Date();
    target.setHours(parseInt(hours), parseInt(minutes), 0);
    
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diff = target - now;
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntil === 0) {
      return `через ${minutesUntil}м`;
    }
    return `через ${hoursUntil}ч ${minutesUntil}м`;
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const takenToday = medications.filter(m => isTakenToday(m)).length;
  const totalMeds = medications.length;
  const percentage = totalMeds > 0 ? (takenToday / totalMeds) * 100 : 0;

  return (
    <div className={`min-h-screen ... transition-all duration-1000 ${
  glow ? "bg-gradient-to-br from-rose-100 via-pink-100 to-red-100" : ""
}`}
>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '0',
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '24px',
              }}
            >
              {['💜', '💖', '✨', '🌸', '💫', '🎉'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 p-4 pb-24 max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6 animate-slide-down">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse-glow">
                <Pill className="w-8 h-8 text-white animate-wiggle" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce-in">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-1 animate-shimmer bg-[length:200%_100%]">
                Твои Таблетки
              </h1>
              <p className="text-sm text-purple-600/70 font-medium flex items-center gap-1">
                <Heart className="w-4 h-4 animate-heart-beat text-pink-500" />
                {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {totalMeds > 0 && (
            <div className="mb-6 animate-scale-in">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-700">Прогресс дня</span>
                <span className="text-sm font-bold text-purple-600">{takenToday}/{totalMeds}</span>
              </div>
              <div className="h-3 bg-purple-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowValentine(true)}
            className="group relative px-8 py-4 text-lg font-bold rounded-full 
                      bg-gradient-to-r from-rose-500 via-pink-500 to-red-500
                      text-white shadow-2xl overflow-hidden
                      hover:scale-110 transition-all duration-500"
          >
            <span className="relative z-10">💖 Для тебя, Мария Александровна!</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />
          </button>
        </div>



        {/* Empty state */}
        {medications.length === 0 && !showAddForm && (
          <Card className="animate-bounce-in border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 animate-float shadow-2xl shadow-purple-400/40">
                <Pill className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">Начни заботиться о себе</h3>
              <p className="text-purple-600/70 text-center mb-6 max-w-xs">
                Добавь первое лекарство и я буду напоминать тебе о приеме 💜
              </p>
              <Button onClick={() => setShowAddForm(true)} size="lg" className="gap-2 animate-pulse-glow">
                <Plus className="w-5 h-5" />
                Добавить лекарство
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Medications List */}
        <div className="space-y-4">
          {medications.map((med, index) => {
            const taken = isTakenToday(med);
            return (
              <Card 
                key={med.id} 
                className={`animate-slide-up transition-all duration-500 ${
                  taken 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                    : 'border-purple-200 hover:border-purple-300'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-bold text-purple-900">{med.name}</h3>
                        {taken && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold shadow-lg animate-bounce-in">
                            <Check className="w-3.5 h-3.5" />
                            Принято
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm mb-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{med.time}</span>
                        </div>
                        {med.dosage && (
                          <div className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 font-medium">
                            {med.dosage}
                          </div>
                        )}
                        {!taken && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{getTimeUntil(med.time)}</span>
                          </div>
                        )}
                      </div>

                      {med.lastTaken && (
                        <p className="text-xs text-purple-600/60 mt-2">
                          Последний прием: {new Date(med.lastTaken).toLocaleString('ru-RU')}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!taken && (
                        <Button
                          onClick={() => markAsTaken(med.id)}
                          size="icon"
                          className="shrink-0 shadow-xl hover:scale-110 transition-transform duration-300"
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteMedication(med.id)}
                        variant="outline"
                        size="icon"
                        className="shrink-0 hover:bg-red-50 hover:border-red-300 group"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add Form */}
          {showAddForm && (
            <Card className="animate-scale-in border-purple-300 bg-gradient-to-br from-white to-purple-50/50 shadow-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Новое лекарство
                  </h3>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMed({ name: '', time: '', dosage: '' });
                    }}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-bold text-purple-900 mb-2 block">Название</label>
                  <Input
                    placeholder="Например: Аспирин"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    className="text-base"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-purple-900 mb-2 block">Время приема</label>
                  <Input
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-purple-900 mb-2 block">Дозировка (необязательно)</label>
                  <Input
                    placeholder="Например: 1 таблетка"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="text-base"
                  />
                </div>

                <Button 
                  onClick={addMedication} 
                  size="lg" 
                  className="w-full gap-2 text-base shadow-xl hover:shadow-2xl"
                  disabled={!newMed.name || !newMed.time}
                >
                  <Plus className="w-5 h-5" />
                  Добавить
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Floating Action Button */}
        {!showAddForm && medications.length > 0 && (
          <div className="fixed bottom-8 right-8 z-20 animate-bounce-in">
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 animate-pulse-glow"
            >
              <Plus className="w-8 h-8" />
            </Button>
          </div>
        )}

        {/* Stats Card */}
        {medications.length > 0 && (
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card className="border-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <CardContent className="p-6 relative">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-purple-100 text-xs mb-1 font-medium">Всего</p>
                    <p className="text-4xl font-bold">{totalMeds}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs mb-1 font-medium">Принято</p>
                    <p className="text-4xl font-bold">{takenToday}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs mb-1 font-medium">Осталось</p>
                    <p className="text-4xl font-bold">{totalMeds - takenToday}</p>
                  </div>
                </div>
                {takenToday === totalMeds && totalMeds > 0 && (
                  <div className="mt-4 text-center animate-bounce-in">
                    <p className="text-sm font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Отлично! Все принято сегодня!
                      <Heart className="w-4 h-4 animate-heart-beat" />
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notification prompt */}
        {notificationPermission === 'default' && (
          <Card className="mt-6 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 animate-slide-up">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-900">Включи уведомления</p>
                <p className="text-xs text-yellow-700">Я буду напоминать о приеме таблеток</p>
              </div>
              <Button
                onClick={() => {
                  Notification.requestPermission().then(permission => {
                    setNotificationPermission(permission);
                  });
                }}
                size="sm"
                className="shrink-0"
              >
                Включить
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      {showValentine && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 animate-fade-in">
          <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-10 max-w-md w-full shadow-[0_20px_80px_rgba(255,0,100,0.3)] text-center animate-scale-in">

            <button
              onClick={() => setShowValentine(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              С Днём Святого Валентина!!!
            </h2>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Ты делаешь каждый мой день светлее.  
              Спасибо, что ты есть, МАЛЕНЬКИЙ ВКУСНЕНЬКИЙ МАЛЫШОЧЕК ❤️❤️❤️
            </p>

            <button
              onClick={() => {
                setPetalWave(prev => prev + 1);
                setGlow(true);
                setTimeout(() => setGlow(false), 2000);
              }}
              className="relative px-8 py-3 rounded-full 
                        bg-gradient-to-r from-rose-500 to-red-500 
                        text-white font-bold text-lg shadow-2xl
                        hover:scale-110 transition-all duration-300
                        animate-pulse"
            >
              Открыть ❤️
            </button>
          </div>
        </div>
      )}

          {petals.length > 0 && (
  <div className="fixed inset-0 pointer-events-none z-[60]">
    {petals.map((petal, i) => (
      <div
        key={i}
        className="absolute animate-fall"
        style={{
          left: `${petal.left}%`,
          top: "-80px",
          animationDuration: `${petal.duration}s`,
          animationDelay: `${petal.delay}s`,
          transform: `rotate(${petal.rotate}deg)`,
        }}
      >
        <img
          src={petal.img}
          className="w-14 h-14 object-contain drop-shadow-[0_10px_25px_rgba(255,0,120,0.6)] 
                     opacity-100 brightness-110 contrast-110"
        />
      </div>
    ))}
  </div>
)}





    </div>
  );
}

export default App;
