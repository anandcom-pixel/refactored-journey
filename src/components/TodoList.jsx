import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  CheckCheck, 
  Sparkles, 
  Tag, 
  Edit2,
  Check,
  X,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTaskCompleteSound } from '../utils/audio';

const PRIORITIES = [
  { id: 'high', label: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200 ring-rose-300' },
  { id: 'medium', label: 'Medium', color: 'text-amber-800 bg-amber-50 border-amber-200 ring-amber-300' },
  { id: 'low', label: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-300' }
];

const CATEGORIES = ['General', 'Work', 'Personal', 'Focus', 'Learning'];

export default function TodoList({ todos, onUpdateTodos }) {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onUpdateTodos([newTask, ...todos]);
    setNewTitle('');
  };

  const handleToggleComplete = (id) => {
    const updated = todos.map(todo => {
      if (todo.id === id) {
        const nextState = !todo.completed;
        if (nextState) {
          playTaskCompleteSound();
          const remainingActive = todos.filter(t => t.id !== id && !t.completed).length;
          if (remainingActive === 0 && todos.length > 0) {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
        }
        return { ...todo, completed: nextState };
      }
      return todo;
    });
    onUpdateTodos(updated);
  };

  const handleDeleteTask = (id) => {
    onUpdateTodos(todos.filter(t => t.id !== id));
  };

  const handleClearCompleted = () => {
    onUpdateTodos(todos.filter(t => !t.completed));
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleSaveEdit = (id) => {
    if (editingText.trim()) {
      onUpdateTodos(todos.map(t => t.id === id ? { ...t, title: editingText.trim() } : t));
    }
    setEditingId(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }).filter(todo => {
    if (!searchQuery.trim()) return true;
    return todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           todo.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative rounded-2xl bg-white/95 border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <CheckCheck className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Today's Tasks</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
            {completedCount}/{totalCount}
          </span>
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            title="Remove completed tasks"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear done</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="pt-3 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-semibold">
            <span>Progress</span>
            <span className="text-amber-800 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Task Input Form */}
      <form onSubmit={handleAddTask} className="mt-3 space-y-2.5">
        <div className="relative flex items-center">
          <input
            id="todo-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task (Press Enter)..."
            className="w-full bg-amber-50/40 hover:bg-white focus:bg-white text-sm text-slate-900 placeholder-slate-400 pl-3.5 pr-11 py-2.5 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all shadow-2xs"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="absolute right-1.5 p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 hover:text-white disabled:opacity-30 disabled:hover:bg-amber-500 disabled:hover:text-slate-950 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-amber-500/25"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Priority & Category Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-bold">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-bold transition-all ${
                  priority === p.id 
                    ? `${p.color} ring-1 shadow-2xs` 
                    : 'text-slate-500 border-transparent hover:bg-amber-50 hover:text-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-amber-50/50 text-slate-800 font-medium text-[11px] px-2 py-0.5 rounded-md border border-amber-300 focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-white text-slate-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Filter Tabs & Search */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-amber-100">
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200/80 text-xs">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md capitalize font-bold transition-all ${
                filter === tab
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {totalCount > 3 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-24 sm:w-32 bg-amber-50/50 text-xs text-slate-900 placeholder-slate-400 pl-7 pr-2 py-1 rounded-lg border border-amber-200 focus:outline-none focus:bg-white focus:border-amber-400 focus:w-36 transition-all"
            />
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="mt-3 flex-1 overflow-y-auto max-h-[340px] pr-1 space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400">
            <Sparkles className="w-8 h-8 text-amber-400 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-slate-700">
              {filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'active'
                ? 'All tasks are completed! Great job!'
                : 'No tasks yet. Add one above to get rolling!'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Small steps every day lead to big victories.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const pInfo = PRIORITIES.find(p => p.id === todo.priority) || PRIORITIES[1];
            const isEditing = editingId === todo.id;

            return (
              <div
                key={todo.id}
                className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  todo.completed
                    ? 'bg-slate-50/70 border-slate-200/60 text-slate-400'
                    : 'bg-amber-50/30 hover:bg-amber-50/70 border-amber-200/60 hover:border-amber-400/80 text-slate-900 shadow-2xs'
                }`}
              >
                {/* Complete Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(todo.id)}
                  className="mt-0.5 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer shrink-0"
                  title={todo.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-100" />
                  ) : (
                    <Circle className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(todo.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="w-full bg-white text-sm text-slate-900 px-2 py-1 rounded border-2 border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="p-1 rounded text-emerald-800 hover:bg-emerald-100"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded text-slate-600 hover:bg-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p
                        className={`text-sm break-words select-text font-medium ${
                          todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {todo.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {/* Priority Badge */}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${pInfo.color}`}>
                          {pInfo.label}
                        </span>
                        {/* Category */}
                        {todo.category && (
                          <span className="text-[10px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                            {todo.category}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(todo.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
