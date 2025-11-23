import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
type Player = {
  id: string;
  name: string;
  score: number;
};

// --- Icons ---
const PlusIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6"></path>
    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"></path>
  </svg>
);

const TvIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const CloseIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ResetIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 2v6h6"></path>
    <path d="M21.5 22v-6h-6"></path>
    <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.3"></path>
  </svg>
);

// --- App Component ---
const App = () => {
  const [view, setView] = useState<'setup' | 'counter'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTvMode, setIsTvMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Logic ---
  const addPlayer = () => {
    if (inputValue.trim()) {
      setPlayers([
        ...players,
        { id: Date.now().toString(), name: inputValue.trim(), score: 0 },
      ]);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const startGame = () => {
    if (players.length > 0) {
      setView('counter');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const updateScore = (id: string, delta: number) => {
    setPlayers(players.map((p) => 
      p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p
    ));
  };

  const resetAllScores = () => {
    if (window.confirm('СБРОСИТЬ СЧЕТ ВСЕХ ИГРОКОВ?')) {
      setPlayers(players.map(p => ({ ...p, score: 0 })));
    }
  };

  // Toggle TV Mode
  const toggleTvMode = () => {
    if (!isTvMode) {
      // Enter TV Mode
      setIsTvMode(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen blocked or not supported", err);
        });
      }
    } else {
      // Exit TV Mode
      setIsTvMode(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    }
  };

  // --- Styles ---
  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: view === 'setup' ? 'center' : 'flex-start',
    maxWidth: isTvMode ? '100%' : '600px', // Wider in TV mode
    margin: '0 auto',
    width: '100%',
    transition: 'all 0.4s ease',
  };

  // Setup View
  if (view === 'setup') {
    return (
      <div style={containerStyle} className="fade-in">
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '50px', 
          textAlign: 'center', 
          textTransform: 'uppercase', 
          lineHeight: 0.85,
          fontWeight: 900
        }}>
          Кто<br/>Шутит?
        </h1>

        <div style={{ 
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 12px 12px 28px',
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ИМЯ УЧАСТНИКА"
            style={{
              flex: 1,
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              color: 'black',
              padding: '10px 0',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}
          />
          <button 
            onClick={addPlayer}
            style={{ 
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            aria-label="Добавить"
          >
            <PlusIcon size={28} />
          </button>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: '20px', 
          padding: '0 5px'
        }}>
          {players.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '20px', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Добавьте участников
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {players.map((player) => (
              <div key={player.id} className="fade-in" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '18px 24px', 
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.03)'
              }}>
                <span style={{ fontSize: '1.1rem', textTransform: 'uppercase', fontWeight: 800 }}>{player.name}</span>
                <button 
                  onClick={() => removePlayer(player.id)} 
                  style={{ color: '#FF3B30', padding: '5px', opacity: 0.7 }}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {players.length > 0 && (
          <button
            onClick={startGame}
            style={{
              backgroundColor: 'black',
              color: 'white',
              fontSize: '1.4rem',
              fontWeight: 900,
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              textTransform: 'uppercase',
              width: '100%',
              marginTop: 'auto',
              boxShadow: 'var(--shadow-hover)',
              letterSpacing: '0.02em'
            }}
          >
            Начать
          </button>
        )}
      </div>
    );
  }

  // Counter View
  return (
    <div style={{
      ...containerStyle,
      paddingTop: isTvMode ? '30px' : '20px',
      height: '100%'
    }} className="fade-in">
      
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: isTvMode ? '50px' : '30px',
        padding: '0 5px',
        height: '50px'
      }}>
        {/* Left Side Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isTvMode && (
            <button 
              onClick={() => setView('setup')}
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                color: '#000',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              Игроки
            </button>
          )}

          {!isTvMode && (
             <button 
             onClick={resetAllScores}
             style={{ 
               display: 'flex',
               alignItems: 'center',
               gap: '6px',
               fontSize: '0.8rem', 
               fontWeight: 800,
               textTransform: 'uppercase',
               padding: '12px 16px',
               backgroundColor: '#fff',
               borderRadius: '12px',
               color: '#FF3B30',
               boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
             }}
             title="Сбросить все"
           >
             <ResetIcon size={16} />
             <span>Сброс</span>
           </button>
          )}
        </div>

        {/* Right Side / TV Toggle */}
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={toggleTvMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: isTvMode ? 'rgba(0,0,0,0.05)' : 'black',
              color: isTvMode ? 'black' : 'white',
              padding: isTvMode ? '12px 20px' : '12px 20px',
              borderRadius: '30px',
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              backdropFilter: isTvMode ? 'blur(20px)' : 'none',
              boxShadow: isTvMode ? 'none' : '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
             {isTvMode ? <CloseIcon size={18}/> : <TvIcon size={18}/>}
             {isTvMode ? 'Выход' : 'На ТВ'}
          </button>
        </div>
      </header>

      {/* Grid of cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isTvMode ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
        gap: isTvMode ? '40px' : '16px',
        alignContent: 'start',
        paddingBottom: '40px'
      }}>
        {players.map((player) => (
          <div 
            key={player.id} 
            style={{ 
              display: 'flex', 
              flexDirection: isTvMode ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: isTvMode ? '40px' : '24px',
              backgroundColor: 'white',
              borderRadius: isTvMode ? '32px' : '20px',
              boxShadow: isTvMode ? '0 20px 50px rgba(0,0,0,0.08)' : 'var(--shadow-soft)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
              border: isTvMode ? '1px solid rgba(0,0,0,0.02)' : 'none'
            }}
          >
            <div style={{ 
              flex: 1, 
              fontSize: isTvMode ? '3rem' : '1.4rem', 
              fontWeight: 800,
              textTransform: 'uppercase', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              marginRight: '10px',
              textAlign: isTvMode ? 'center' : 'left',
              marginBottom: isTvMode ? '30px' : '0',
              letterSpacing: '-0.02em',
              width: isTvMode ? '100%' : 'auto'
            }}>
              {player.name}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: isTvMode ? '40px' : '16px' }}>
              <button 
                onClick={() => updateScore(player.id, -1)}
                style={{ 
                  width: isTvMode ? '80px' : '48px', 
                  height: isTvMode ? '80px' : '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: isTvMode ? '3px solid #F2F2F7' : '2px solid #F2F2F7',
                  borderRadius: '50%',
                  color: '#000',
                  transition: 'background 0.2s',
                  backgroundColor: 'transparent'
                }}
              >
                <MinusIcon size={isTvMode ? 32 : 22} />
              </button>
              
              <span style={{ 
                fontSize: isTvMode ? '6rem' : '2.5rem', 
                minWidth: isTvMode ? '140px' : '64px', 
                textAlign: 'center', 
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.03em',
                lineHeight: 1
              }}>
                {player.score}
              </span>
              
              <button 
                onClick={() => updateScore(player.id, 1)}
                style={{ 
                  width: isTvMode ? '80px' : '48px', 
                  height: isTvMode ? '80px' : '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                <PlusIcon size={isTvMode ? 32 : 22} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isTvMode && (
        <div style={{ 
            marginTop: 'auto', 
            textAlign: 'center', 
            color: '#000', 
            opacity: 0.4,
            fontSize: '0.9rem',
            paddingBottom: '30px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
           AirPlay Mode Active
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);