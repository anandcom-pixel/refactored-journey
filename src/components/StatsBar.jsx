import React from 'react';
import { Target, CheckCircle2, Flame, BrainCircuit } from 'lucide-react';

export default function StatsBar({ todos, pomodoroSessions }) {
  const completedTasks = todos.filter(t => t.completed).length;
  const totalTasks = todos.length;
  const totalFocusMinutes = pomodoroSessions * 25;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
      {/* Metric 1 */}
      <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs hover:shadow-sm transition-shadow">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tasks Done</div>
          <div className="text-base font-extrabold text-slate-900 font-mono">
            {completedTasks} <span className="text-xs text-slate-400 font-normal">/ {totalTasks}</span>
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs hover:shadow-sm transition-shadow">
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completion Rate</div>
          <div className="text-base font-extrabold text-emerald-700 font-mono">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs hover:shadow-sm transition-shadow">
        <div className="p-2.5 rounded-xl bg-orange-100 text-orange-800 border border-orange-200">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pomodoros</div>
          <div className="text-base font-extrabold text-orange-700 font-mono">
            {pomodoroSessions} <span className="text-xs text-slate-400 font-normal">sessions</span>
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="rounded-xl bg-white/95 border border-amber-200/80 p-3.5 flex items-center gap-3 shadow-xs hover:shadow-sm transition-shadow">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Focus Time</div>
          <div className="text-base font-extrabold text-amber-800 font-mono">
            {totalFocusMinutes} <span className="text-xs text-slate-400 font-normal">mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
