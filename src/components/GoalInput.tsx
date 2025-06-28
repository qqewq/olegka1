import React, { useState } from 'react';
import { Target, Brain, Zap } from 'lucide-react';

interface GoalInputProps {
  onGoalSubmit: (goal: string, constraints: string[]) => void;
  isProcessing: boolean;
}

export default function GoalInput({ onGoalSubmit, isProcessing }: GoalInputProps) {
  const [goal, setGoal] = useState('');
  const [constraints, setConstraints] = useState<string[]>(['']);

  const addConstraint = () => {
    setConstraints([...constraints, '']);
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onGoalSubmit(goal, constraints.filter(c => c.trim()));
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Goal Definition</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white/80 font-medium mb-3">
            Primary Goal (seemingly impossible)
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Create autonomous nanobots that prevent aging and allow humans to live healthy lives up to 150 years..."
            className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none h-32"
            disabled={isProcessing}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-white/80 font-medium">Known Constraints</label>
            <button
              type="button"
              onClick={addConstraint}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              disabled={isProcessing}
            >
              + Add Constraint
            </button>
          </div>
          
          <div className="space-y-3">
            {constraints.map((constraint, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  placeholder="e.g., Biological aging (telomere shortening)"
                  className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  disabled={isProcessing}
                />
                {constraints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className="px-3 text-red-400 hover:text-red-300"
                    disabled={isProcessing}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!goal.trim() || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Goal...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Begin Resonance Analysis
            </>
          )}
        </button>
      </form>
    </div>
  );
}