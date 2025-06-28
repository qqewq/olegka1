import React, { useEffect, useRef } from 'react';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface ResonanceData {
  combinations: Array<{
    id: string;
    subgoals: number[];
    probability: number;
    resonanceAmplitude: number;
    frequency: number;
  }>;
  bestCombination: {
    probability: number;
    resonanceScore: number;
    subgoals: number[];
  } | null;
}

interface ResonanceAnalysisProps {
  data: ResonanceData;
  isAnalyzing: boolean;
}

export default function ResonanceAnalysis({ data, isAnalyzing }: ResonanceAnalysisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.combinations.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      const centerY = canvas.height / 2;
      const amplitude = 40;
      
      // Draw wave functions for each combination
      data.combinations.slice(0, 5).forEach((combo, index) => {
        ctx.strokeStyle = `hsl(${180 + index * 40}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + 
            Math.sin((x * 0.01 + time) * combo.frequency) * 
            amplitude * combo.resonanceAmplitude * 0.1 +
            (index - 2) * 20;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      });
      
      // Draw interference pattern
      if (data.bestCombination) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          let y = centerY;
          
          data.combinations.slice(0, 3).forEach((combo) => {
            y += Math.sin((x * 0.01 + time) * combo.frequency) * 
                 amplitude * combo.resonanceAmplitude * 0.05;
          });
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [data]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Resonance Analysis</h2>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2 text-yellow-400">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Analyzing Frequencies...</span>
          </div>
        )}
      </div>

      {/* Wave Function Visualization */}
      <div className="mb-6">
        <h3 className="text-white/80 font-medium mb-3">Wave Function Interference</h3>
        <div className="bg-black/20 rounded-xl p-4 border border-white/10">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-auto max-w-full"
          />
        </div>
      </div>

      {/* Combination Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Combinations */}
        <div>
          <h3 className="text-white/80 font-medium mb-4">Top Resonant Combinations</h3>
          <div className="space-y-3">
            {data.combinations.slice(0, 5).map((combo, index) => (
              <div
                key={combo.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  index === 0
                    ? 'bg-yellow-500/20 border-yellow-400/50'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm font-mono">
                      K{index + 1}
                    </span>
                    <span className="text-xs text-white/50">
                      [{combo.subgoals.map(s => `C${s + 1}`).join(', ')}]
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-white/60">Probability</div>
                      <div className="font-mono text-sm text-white">
                        {(combo.probability * 100).toFixed(3)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/60">Resonance</div>
                      <div className="font-mono text-sm text-yellow-400">
                        {combo.resonanceAmplitude.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                        : 'bg-gradient-to-r from-blue-400 to-purple-400'
                    }`}
                    style={{ width: `${combo.probability * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Combination Details */}
        <div>
          <h3 className="text-white/80 font-medium mb-4">Optimal Solution</h3>
          {data.bestCombination ? (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span className="text-lg font-semibold text-white">Best Configuration</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-white/60 mb-1">Success Probability</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {(data.bestCombination.probability * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-white/60 mb-1">Resonance Score</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {data.bestCombination.resonanceScore.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-white/60 mb-2">Active Subgoals</div>
                  <div className="flex flex-wrap gap-2">
                    {data.bestCombination.subgoals.map(subgoal => (
                      <span
                        key={subgoal}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-mono"
                      >
                        C{subgoal + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/20 rounded-xl p-6 text-center text-white/60">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Analyzing combinations for optimal resonance...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}