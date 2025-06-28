import React, { useState } from 'react';
import { Brain, Zap, Target, Activity } from 'lucide-react';
import GoalInput from './components/GoalInput';
import SubgoalGeneration from './components/SubgoalGeneration';
import ResonanceAnalysis from './components/ResonanceAnalysis';
import IterationTracker from './components/IterationTracker';
import { useResonanceAlgorithm } from './hooks/useResonanceAlgorithm';

function App() {
  const {
    isProcessing,
    subgoals,
    resonanceData,
    iterations,
    currentIteration,
    isConverging,
    startAlgorithm,
    stopAlgorithm
  } = useResonanceAlgorithm();

  const [activeTab, setActiveTab] = useState<'input' | 'subgoals' | 'resonance' | 'iterations'>('input');

  const handleGoalSubmit = (goal: string, constraints: string[]) => {
    startAlgorithm(goal, constraints);
    setActiveTab('subgoals');
  };

  const tabs = [
    { id: 'input', label: 'Goal Definition', icon: Target, active: !isProcessing },
    { id: 'subgoals', label: 'Subgoal Generation', icon: Brain, active: isProcessing || subgoals.length > 0 },
    { id: 'resonance', label: 'Resonance Analysis', icon: Activity, active: resonanceData.combinations.length > 0 },
    { id: 'iterations', label: 'Iteration Progress', icon: Zap, active: iterations.length > 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-radial from-purple-500/5 to-transparent rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Resonance Goal Achievement System
              </h1>
              <p className="text-purple-200 text-lg">
                Autonomous algorithm for discovering paths to seemingly impossible goals
              </p>
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-4 flex items-center gap-3 text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm">
                Algorithm running • Iteration {currentIteration} • 
                {isConverging ? ' Converging to 100%' : ' Analysis complete'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-10 px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-1 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => tab.active && setActiveTab(tab.id as any)}
                  disabled={!tab.active}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : tab.active
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-white/40 cursor-not-allowed'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'input' && (
            <GoalInput 
              onGoalSubmit={handleGoalSubmit}
              isProcessing={isProcessing}
            />
          )}
          
          {activeTab === 'subgoals' && (
            <SubgoalGeneration 
              subgoals={subgoals}
              isGenerating={isProcessing && subgoals.length === 0}
            />
          )}
          
          {activeTab === 'resonance' && (
            <ResonanceAnalysis 
              data={resonanceData}
              isAnalyzing={isConverging}
            />
          )}
          
          {activeTab === 'iterations' && (
            <IterationTracker 
              iterations={iterations}
              currentIteration={currentIteration}
              targetProbability={0.95}
              isConverging={isConverging}
            />
          )}
        </div>
      </main>

      {/* Control Panel */}
      {isProcessing && (
        <div className="fixed bottom-8 right-8 z-20">
          <button
            onClick={stopAlgorithm}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <div className="w-4 h-4 bg-white rounded-sm" />
            Stop Algorithm
          </button>
        </div>
      )}
    </div>
  );
}

export default App;