
import React from 'react';
import { ReputationTask, Priority } from '../types';
import { Activity, CheckSquare, Square, RefreshCw } from 'lucide-react';

interface ReputationPulseProps {
  tasks: ReputationTask[];
  onToggle: (id: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const ReputationPulse: React.FC<ReputationPulseProps> = ({ tasks, onToggle, onRefresh, isLoading }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'border-rose-500/30 bg-rose-500/5 text-rose-200';
      case 'Medium': return 'border-amber-500/30 bg-amber-500/5 text-amber-200';
      case 'Low': return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200';
      default: return 'border-zinc-800 bg-zinc-800/50 text-zinc-200';
    }
  };

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 sticky top-24 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-emerald-400" />
          <h2 className="font-bold text-xs uppercase tracking-widest text-zinc-300">Reputation Pulse</h2>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-all ${isLoading ? 'animate-spin text-emerald-400' : 'text-zinc-500'}`}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => onToggle(task.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
              task.completed 
                ? 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60' 
                : getPriorityStyles(task.priority)
            }`}
          >
            <div className="flex-shrink-0">
              {task.completed ? <CheckSquare size={16} /> : <Square size={16} className="opacity-40 group-hover:opacity-100" />}
            </div>
            <div className="flex-1">
              <span className={`text-[12px] font-semibold leading-tight block ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </span>
              {!task.completed && (
                <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 block mt-1">
                  {task.priority} Priority
                </span>
              )}
            </div>
          </button>
        ))}
        {tasks.length === 0 && !isLoading && (
          <p className="text-[10px] text-zinc-500 text-center py-4">Nicio activitate scanată. Apasă refresh.</p>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase mb-2 px-1">
          <span>Pulse Completion</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default ReputationPulse;
