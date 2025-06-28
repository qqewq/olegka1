import React from 'react';
import { Target, CheckCircle, Circle, Zap } from 'lucide-react';

interface Subgoal {
  id: number;
  text: string;
  probability: number;
  resonanceScore: number;
  isActive: boolean;
}

interface SubgoalGenerationProps {
  subgoals: Subgoal[];
  isGenerating: boolean;
}

export default function SubgoalGeneration({ subgoals, isGenerating }: SubgoalGenerationProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Subgoal Generation</h2>
        {isGenerating && (
          <div className="ml-auto flex items-center gap-2 text-green-400">
            <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            <span className="text-sm">Generating...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {subgoals.length === 0 && !isGenerating && (
          <div className="text-center py-12 text-white/60">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Subgoals will appear here after goal analysis begins</p>
          </div>
        )}

        {subgoals.map((subgoal, index) => (
          <div
            key={subgoal.id}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              subgoal.isActive
                ? 'bg-green-500/20 border-green-400/50 scale-105'
                : 'bg-white/5 border-white/20 hover:border-white/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {subgoal.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/40" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/60 text-sm font-mono">
                    C{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">P:</span>
                    <div className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-white">
                      {subgoal.probability.toFixed(4)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <div className="bg-yellow-500/20 px-2 py-1 rounded text-xs font-mono text-yellow-300">
                      {subgoal.resonanceScore.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <p className="text-white/90 leading-relaxed">{subgoal.text}</p>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Feasibility</span>
                    <span>{(subgoal.probability * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subgoal.probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}