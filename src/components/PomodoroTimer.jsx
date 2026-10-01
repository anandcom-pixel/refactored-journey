import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Coffee, 
  Award, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTimerCompletionSound } from '../utils/audio';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: 'text-amber-700', ringColor: '#f59e0b', icon: Flame },
  shortBreak: { label: 'Short Break', minutes: 5, color: 'text-emerald-700', ringColor: '#10b981', icon: Coffee },
  longBreak: { label: 'Long Break', minutes: 15, color: 'text-orange-700', ringColor: '#ea580c', icon: Award },
};

export default function PomodoroTimer({ completedSessions, onSessionComplete }) {
  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Tab Title notification updater
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = String(timeLeft % 60).padStart(2, '0');
    if (isRunning) {
      document.title = `(${mins}:${secs}) ${MODES[currentMode].label} | Aura`;
    } else {
      document.title = 'Aura • Daily Productivity Dashboard';
    }
    return () => {
      document.title = 'Aura • Daily Productivity Dashboard';
    };
  }, [timeLeft, isRunning, currentMode]);

  // Main countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);

            if (soundEnabled) {
              playTimerCompletionSound();
            }

            if (currentMode === 'focus') {
              onSessionComplete();
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
              });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, soundEnabled, currentMode, onSessionComplete]);

  const switchMode = (modeKey) => {
    setIsRunning(false);
    setCurrentMode(modeKey);
    setTimeLeft(MODES[modeKey].minutes * 60);
  };

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(MODES[currentMode].minutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[currentMode].minutes * 60);
  };

  const handleAddMinutes = (extraMinutes) => {
    setTimeLeft((prev) => prev + extraMinutes * 60);
  };

  const totalSeconds = MODES[currentMode].minutes * 60;
  const minutesDisplay = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secondsDisplay = String(timeLeft % 60).padStart(2, '0');

  const ActiveIcon = MODES[currentMode].icon;

  return (
    <div className="relative rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Timer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <ActiveIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Focus Pomodoro</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-600 hover:text-amber-800 border border-amber-200 transition-colors shadow-2xs"
            title={soundEnabled ? 'Mute timer chime' : 'Enable timer chime'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Completed streak counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-xs text-amber-900 font-bold" title="Focus sessions completed today">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-200" />
            <span>{completedSessions}</span>
            <span className="text-[10px] text-amber-700 font-semibold hidden sm:inline">done</span>
          </div>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 rounded-xl bg-amber-50 border border-amber-200/80">
        {Object.entries(MODES).map(([key, info]) => {
          const Icon = info.icon;
          const isActive = currentMode === key;
          return (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Circular Progress & Display */}
      <div className="flex flex-col items-center justify-center my-6 relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* SVG Circular Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-amber-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={MODES[currentMode].ringColor}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 * (1 - (totalSeconds - timeLeft) / totalSeconds)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black font-mono text-slate-900 tracking-tight">
              {minutesDisplay}:{secondsDisplay}
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700 mt-1">
              {isRunning ? 'In Progress' : timeLeft === 0 ? 'Completed!' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Quick add minutes */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleAddMinutes(1)}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors shadow-2xs"
            title="Add 1 minute"
          >
            +1 min
          </button>
          <button
            onClick={() => handleAddMinutes(5)}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors shadow-2xs"
            title="Add 5 minutes"
          >
            +5 min
          </button>
        </div>
      </div>

      {/* Timer Controls: Start/Pause and Reset */}
      <div className="flex items-center justify-center gap-3 pt-3 border-t border-amber-100">
        <button
          onClick={handleStartPause}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-md cursor-pointer ${
            isRunning
              ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{timeLeft === 0 ? 'Restart' : 'Start Focus'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          title="Reset timer to beginning"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
