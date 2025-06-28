import React from 'react';
import { RefreshCw, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface Iteration {
  id: number;
  goal: string;
  bestProbability: number;
  resonanceScore: number;
  convergenceRate: number;
  isComplete: boolean;
}

interface IterationTrackerProps {
  iterations: Iteration[];
  currentIteration: number;
  targetProbability: number;
  isConverging: boolean;
}

export default function IterationTracker({ 
  iterations, 
  currentIteration, 
  targetProbability, 
  isConverging 
}: IterationTrackerProps) {
  const latestIteration = iterations[iterations.length - 1];
  const progressToTarget = latestIteration ? (latestIteration.bestProbability / targetProbability) * 100 : 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
          <RefreshCw className={`w-6 h-6 text-white ${isConverging ? 'animate-spin' : ''}`} />
        </div>
        <h2 className="text-2xl font-bold text-white">Iteration Progress</h2>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-white/60">Current Iteration</div>
            <div className="font-mono text-lg text-white">{currentIteration}</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-white/80 font-medium">Target Achievement</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {progressToTarget.toFixed(1)}%
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressToTarget, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white/80 font-medium">Best Probability</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {latestIteration ? (latestIteration.bestProbability * 100).toFixed(3) : '0.000'}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-white/80 font-medium">Convergence Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {latestIteration ? latestIteration.convergenceRate.toFixed(4) : '0.0000'}
          </div>
        </div>
      </div>

      {/* Iteration History */}
      <div>
        <h3 className="text-white/80 font-medium mb-4">Iteration History</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {iterations.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Iterations will appear here as the algorithm progresses</p>
            </div>
          ) : (
            iterations.map((iteration) => (
              <div
                key={iteration.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  iteration.isComplete
                    ? 'bg-green-500/20 border-green-400/50'
                    : iteration.id === currentIteration
                    ? 'bg-purple-500/20 border-purple-400/50 ring-2 ring-purple-400/30'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm font-mono">
                      Iteration {iteration.id}
                    </span>
                    {iteration.isComplete && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {iteration.id === currentIteration && !iteration.isComplete && (
                      <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-white/60">Probability</div>
                      <div className="font-mono text-sm text-white">
                        {(iteration.bestProbability * 100).toFixed(3)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60">Resonance</div>
                      <div className="font-mono text-sm text-yellow-400">
                        {iteration.resonanceScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {iteration.goal}
                </p>
                
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      iteration.isComplete
                        ? 'bg-gradient-to-r from-green-400 to-teal-400'
                        : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`}
                    style={{ width: `${(iteration.bestProbability / targetProbability) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}