
import React from 'react';
import { Phase, Task, TaskType } from '../types';
import TaskCard from './TaskCard';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

interface KanbanColumnProps {
  phase: Phase;
  tasks: Task[];
  aiMode: boolean;
  isGenerating?: boolean;
  onMoveTask: (id: string, next: Phase) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onHandleOutcome: (id: string, success: boolean) => void;
  onGetAI: (id: string) => void;
  onAddTask: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  phase, tasks, aiMode, isGenerating, onMoveTask, onUpdateTask, onHandleOutcome, onGetAI, onAddTask 
}) => {
  const getPhaseColor = () => {
    switch(phase) {
      case Phase.TRAFFIC: return 'border-blue-500/50 text-blue-400';
      case Phase.HOLDING: return 'border-indigo-500/50 text-indigo-400';
      case Phase.SELLING: return 'border-amber-500/50 text-amber-400';
      case Phase.OUTCOMES: return 'border-emerald-500/50 text-emerald-400';
    }
  };

  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full bg-zinc-900/30 rounded-2xl border border-zinc-900/50">
      <div className={`p-4 border-b ${getPhaseColor()} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-current`} />
          <h3 className="text-[11px] font-black uppercase tracking-widest">{phase}</h3>
        </div>
        <span className="bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            aiMode={aiMode}
            onMoveTask={onMoveTask}
            // Fix: Changed updateTask to onUpdateTask to match destructured props in KanbanColumn
            onUpdateTask={onUpdateTask}
            onHandleOutcome={onHandleOutcome}
            onGetAI={onGetAI}
          />
        ))}
        
        <button 
          onClick={onAddTask}
          disabled={isGenerating}
          className="w-full py-5 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all flex flex-col items-center justify-center gap-2 text-xs font-black uppercase tracking-widest group"
        >
          {isGenerating ? (
            <Loader2 size={20} className="animate-spin text-purple-400" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Plus size={16} />
                <span>PROMOVARE NOUĂ</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 group-hover:text-purple-400 transition-colors">
                <Sparkles size={10} />
                <span>GENEREAZĂ IDEE AI</span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
