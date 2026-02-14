
import React, { useState } from 'react';
import { Phase, Task } from '../types';
import { ChevronRight, Sparkles, AlertTriangle, CheckCircle, RefreshCcw, Edit3, X, Check } from 'lucide-react';
import { editTaskWithAI } from '../services/geminiService';

interface TaskCardProps {
  task: Task;
  aiMode: boolean;
  onMoveTask: (id: string, next: Phase) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onHandleOutcome: (id: string, success: boolean) => void;
  onGetAI: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, aiMode, onMoveTask, onUpdateTask, onHandleOutcome, onGetAI 
}) => {
  const [loadingAI, setLoadingAI] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const handleAIRequest = async () => {
    setLoadingAI(true);
    await onGetAI(task.id);
    setLoadingAI(false);
  };

  const handleRefine = async () => {
    if (!editPrompt.trim()) return;
    setIsRefining(true);
    const newTitle = await editTaskWithAI(task.title, editPrompt);
    onUpdateTask(task.id, { title: newTitle });
    setIsRefining(false);
    setIsEditing(false);
    setEditPrompt("");
  };

  const getNextPhase = (current: Phase): Phase | null => {
    const phases = Object.values(Phase);
    const idx = phases.indexOf(current);
    return idx < phases.length - 1 ? phases[idx + 1] : null;
  };

  const next = getNextPhase(task.phase);

  return (
    <div className={`bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl transition-all hover:border-zinc-700 group relative`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black bg-zinc-800 text-zinc-400 px-2 py-1 rounded uppercase tracking-widest">
          {task.type}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-zinc-500 hover:text-white transition-all p-1.5 rounded-lg bg-zinc-800/50"
            title="Editare inteligentă"
          >
            <Edit3 size={14} />
          </button>
          {aiMode && (
            <button 
              onClick={handleAIRequest}
              disabled={loadingAI}
              className={`text-purple-400 hover:text-purple-300 transition-all p-1.5 rounded-lg bg-purple-500/5 ${loadingAI ? 'animate-spin' : 'hover:scale-110'}`}
              title="Sugerare strategie"
            >
              <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <textarea
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:border-purple-500/50 focus:outline-none transition-all min-h-[80px]"
            placeholder="Cum vrei să modifici acest task? (ex: fă-l mai specific pentru saloane de tatuaje)"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleRefine}
              disabled={isRefining}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isRefining ? <RefreshCcw size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Rafinează AI
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <h4 className="font-bold text-zinc-100 text-[15px] mb-5 leading-tight tracking-tight">{task.title}</h4>
      )}

      {/* Phase Specific UI */}
      {!isEditing && task.phase === Phase.HOLDING && (
        <div className="mb-5 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-2 px-1">
             <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Tip Nurture</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateTask(task.id, { nurtureType: 'Value' })}
              className={`flex-1 text-[10px] font-black py-2 rounded-lg transition-all uppercase tracking-tighter ${task.nurtureType === 'Value' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'}`}
            >
              VALOARE
            </button>
            <button 
              onClick={() => onUpdateTask(task.id, { nurtureType: 'Promotion' })}
              className={`flex-1 text-[10px] font-black py-2 rounded-lg transition-all uppercase tracking-tighter ${task.nurtureType === 'Promotion' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-400'}`}
            >
              PROMO
            </button>
          </div>
        </div>
      )}

      {!isEditing && task.phase === Phase.SELLING && (
        <div className="mb-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-500/80 px-1">
            <RefreshCcw size={10} />
            <span className="text-[10px] font-black uppercase tracking-widest">Hook Obligatoriu</span>
          </div>
          <textarea 
            placeholder="Scrie un hook nou care să atragă clienții..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-all min-h-[60px] resize-none"
            value={task.newHook || ''}
            onChange={(e) => onUpdateTask(task.id, { newHook: e.target.value })}
          />
        </div>
      )}

      {!isEditing && task.phase === Phase.OUTCOMES && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button 
            onClick={() => onHandleOutcome(task.id, true)}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
              task.status === 'Success' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            <CheckCircle size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest">Convertit</span>
          </button>
          <button 
            onClick={() => onHandleOutcome(task.id, false)}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
              task.status === 'Failure' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-rose-500/50 hover:text-rose-400'
            }`}
          >
            <AlertTriangle size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest">Eșuat</span>
          </button>
        </div>
      )}

      {/* AI Suggestion Display */}
      {aiMode && task.aiSuggestion && !isEditing && (
        <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl relative overflow-hidden animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[9px] font-black text-purple-400/80 uppercase tracking-widest">Sugestie AI CEO</span>
          </div>
          <p className="text-[12px] text-purple-100/90 leading-relaxed font-medium">
            {task.aiSuggestion}
          </p>
        </div>
      )}

      {/* Navigation */}
      {next && task.status !== 'Success' && !isEditing && (
        <button 
          onClick={() => onMoveTask(task.id, next)}
          className="w-full mt-5 py-3.5 flex items-center justify-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-800/30 hover:bg-zinc-800 hover:text-white rounded-xl transition-all border border-transparent hover:border-zinc-700"
        >
          TRECI LA FAZA URMĂTOARE
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Completion Badge */}
      {task.status === 'Success' && (
        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-1.5 border-4 border-zinc-950 shadow-xl animate-in zoom-in duration-500">
          <CheckCircle size={18} />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
