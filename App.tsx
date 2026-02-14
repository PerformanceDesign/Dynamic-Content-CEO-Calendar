
import React, { useState, useEffect, useCallback } from 'react';
import { Phase, Task, ReputationTask } from './types';
import Header from './components/Header';
import KanbanColumn from './components/KanbanColumn';
import ReputationPulse from './components/ReputationPulse';
import { getAISuggestion, generateNewTaskIdea, generateReputationPulse } from './services/geminiService';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Creează un carusel pe Instagram despre beneficiile SEO local', phase: Phase.TRAFFIC, type: 'Social', isAIEnabled: false, lastUpdated: Date.now() },
  { id: 't2', title: 'Publică un video scurt pe TikTok demonstrând cum funcționează un card NFC', phase: Phase.TRAFFIC, type: 'Social', isAIEnabled: false, lastUpdated: Date.now() },
  { id: 't3', title: 'Scrie un fir X/Twitter detaliat despre cum să optimizezi GBP-ul pentru saloane', phase: Phase.TRAFFIC, type: 'Social', isAIEnabled: false, lastUpdated: Date.now() },
  { id: '1', title: 'Video: Analiza unui GBP de top vs. unul eșuat (Tattoo Shop)', phase: Phase.TRAFFIC, type: 'Social', isAIEnabled: false, lastUpdated: Date.now() },
  { id: '4', title: 'Studiu de Caz: Cum a crescut Salonul X cu 23% în 2 luni', phase: Phase.HOLDING, type: 'Newsletter', nurtureType: 'Value', isAIEnabled: false, lastUpdated: Date.now() },
  { id: '7', title: 'Webinar LIVE: Sistemul de 90 de zile pentru Booking non-stop', phase: Phase.SELLING, type: 'Webinar', newHook: 'Cum să scapi de frica "săptămânii goale" în salonul tău', isAIEnabled: false, lastUpdated: Date.now() },
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [reputationTasks, setReputationTasks] = useState<ReputationTask[]>([]);
  const [aiMode, setAiMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState<Phase | null>(null);
  const [isRefreshingPulse, setIsRefreshingPulse] = useState(false);
  const [showLoopBackAlert, setShowLoopBackAlert] = useState<{show: boolean, taskId: string | null}>({show: false, taskId: null});

  useEffect(() => {
    handleRefreshPulse();
  }, []);

  const handleRefreshPulse = async () => {
    setIsRefreshingPulse(true);
    const newTasks = await generateReputationPulse();
    setReputationTasks(newTasks);
    setIsRefreshingPulse(false);
  };

  const moveTask = (taskId: string, nextPhase: Phase) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, phase: nextPhase, lastUpdated: Date.now() } : t));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates, lastUpdated: Date.now() } : t));
  };

  const handleOutcome = (taskId: string, success: boolean) => {
    if (success) {
      updateTask(taskId, { status: 'Success' });
    } else {
      updateTask(taskId, { status: 'Failure' });
      setShowLoopBackAlert({ show: true, taskId });
    }
  };

  const triggerLoopBack = () => {
    if (showLoopBackAlert.taskId) {
      moveTask(showLoopBackAlert.taskId, Phase.HOLDING);
      updateTask(showLoopBackAlert.taskId, { status: 'Pending', nurtureType: 'Value' });
      setShowLoopBackAlert({ show: false, taskId: null });
    }
  };

  const handleAISuggestion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const suggestion = await getAISuggestion(task);
    updateTask(taskId, { aiSuggestion: suggestion });
  };

  const handleGenerateTaskIdea = async (phase: Phase) => {
    setIsGenerating(phase);
    const idea = await generateNewTaskIdea(phase);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: idea.title,
      type: idea.type,
      phase: phase,
      isAIEnabled: false,
      lastUpdated: Date.now(),
      nurtureType: phase === Phase.HOLDING ? 'Value' : undefined
    };
    setTasks(prev => [...prev, newTask]);
    setIsGenerating(null);
  };

  const toggleReputation = (id: string) => {
    setReputationTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header aiMode={aiMode} onToggleAI={() => setAiMode(!aiMode)} />
      
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 overflow-hidden">
        <div className="w-full md:w-72 flex-shrink-0">
          <ReputationPulse 
            tasks={reputationTasks} 
            onToggle={toggleReputation} 
            onRefresh={handleRefreshPulse}
            isLoading={isRefreshingPulse}
          />
        </div>

        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {Object.values(Phase).map((phase) => (
            <KanbanColumn
              key={phase}
              phase={phase}
              tasks={tasks.filter(t => t.phase === phase)}
              aiMode={aiMode}
              isGenerating={isGenerating === phase}
              onMoveTask={moveTask}
              onUpdateTask={updateTask}
              onHandleOutcome={handleOutcome}
              onGetAI={handleAISuggestion}
              onAddTask={() => handleGenerateTaskIdea(phase)}
            />
          ))}
        </div>
      </main>

      {showLoopBackAlert.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-6 text-amber-400">
              <AlertCircle size={40} />
              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Strategie de Nutrire</h2>
            </div>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Această acțiune nu a convertit încă. Ca un CEO strategic, o vom muta înapoi în <strong>Holding Pattern</strong>. Este timpul să educăm mai mult și să oferim valoare înainte de a cere din nou vânzarea.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={triggerLoopBack}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors uppercase text-sm tracking-widest"
              >
                RE-PROGRAMEAZĂ EDUCAREA
              </button>
              <button 
                onClick={() => setShowLoopBackAlert({show: false, taskId: null})}
                className="w-full bg-zinc-800 text-zinc-500 py-3 rounded-xl font-medium hover:bg-zinc-700 transition-colors uppercase text-xs"
              >
                ARHIVEAZĂ ȘI TRECI MAI DEPARTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
