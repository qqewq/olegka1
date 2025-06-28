import { useState, useCallback, useRef } from 'react';

export interface Subgoal {
  id: number;
  text: string;
  probability: number;
  resonanceScore: number;
  isActive: boolean;
}

export interface ResonanceData {
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

export interface Iteration {
  id: number;
  goal: string;
  bestProbability: number;
  resonanceScore: number;
  convergenceRate: number;
  isComplete: boolean;
}

const SAMPLE_SUBGOALS = [
  "Develop nanobots for telomere restoration and cellular rejuvenation",
  "Create mitochondrial repair systems for energy optimization",
  "Engineer molecular-level oxidative stress reduction mechanisms",
  "Build neural interface systems for neurogenesis stimulation",
  "Design immune system nanobots for chronic inflammation elimination",
  "Develop self-replicating nanobot maintenance networks",
  "Create glucose-to-energy conversion systems for autonomous power",
  "Engineer DNA repair mechanisms with real-time error correction",
  "Build organ-nanobot communication protocols for system integration",
  "Design entropy-reversing metabolic processes for cellular regeneration"
];

export function useResonanceAlgorithm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [subgoals, setSubgoals] = useState<Subgoal[]>([]);
  const [resonanceData, setResonanceData] = useState<ResonanceData>({
    combinations: [],
    bestCombination: null
  });
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isConverging, setIsConverging] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  const generateSubgoals = useCallback((goal: string, constraints: string[]) => {
    const generatedSubgoals = SAMPLE_SUBGOALS.map((text, index) => ({
      id: index,
      text,
      probability: Math.random() * 0.1 + 0.001, // Low initial probability
      resonanceScore: Math.random() * 2 + 0.1,
      isActive: false
    }));

    setSubgoals(generatedSubgoals);
    return generatedSubgoals;
  }, []);

  const analyzeResonance = useCallback((subgoals: Subgoal[]) => {
    const combinations = [];
    
    // Generate combinations of subgoals
    for (let i = 0; i < subgoals.length - 2; i++) {
      for (let j = i + 1; j < subgoals.length - 1; j++) {
        for (let k = j + 1; k < subgoals.length; k++) {
          const combo = [i, j, k];
          const combinedProbability = subgoals[i].probability * subgoals[j].probability * subgoals[k].probability;
          const resonanceAmplitude = (subgoals[i].resonanceScore + subgoals[j].resonanceScore + subgoals[k].resonanceScore) / 3;
          
          combinations.push({
            id: `${i}-${j}-${k}`,
            subgoals: combo,
            probability: combinedProbability * (1 + resonanceAmplitude * 0.1), // Resonance boost
            resonanceAmplitude,
            frequency: Math.random() * 2 + 0.5
          });
        }
      }
    }

    // Sort by probability
    combinations.sort((a, b) => b.probability - a.probability);
    
    const bestCombination = combinations[0] ? {
      probability: combinations[0].probability,
      resonanceScore: combinations[0].resonanceAmplitude,
      subgoals: combinations[0].subgoals
    } : null;

    return {
      combinations: combinations.slice(0, 10),
      bestCombination
    };
  }, []);

  const runIteration = useCallback((goal: string, currentSubgoals: Subgoal[], iterationNumber: number) => {
    const resonanceResult = analyzeResonance(currentSubgoals);
    
    // Update subgoals with resonance effects
    const updatedSubgoals = currentSubgoals.map((subgoal, index) => {
      const isInBestCombination = resonanceResult.bestCombination?.subgoals.includes(index);
      return {
        ...subgoal,
        probability: isInBestCombination 
          ? Math.min(subgoal.probability * (1.2 + Math.random() * 0.3), 0.95)
          : subgoal.probability * (1.05 + Math.random() * 0.1),
        isActive: isInBestCombination || false
      };
    });

    const bestProbability = resonanceResult.bestCombination?.probability || 0;
    const convergenceRate = iterationNumber > 1 
      ? bestProbability - (iterations[iterations.length - 1]?.bestProbability || 0)
      : 0;

    const newIteration: Iteration = {
      id: iterationNumber,
      goal,
      bestProbability,
      resonanceScore: resonanceResult.bestCombination?.resonanceScore || 0,
      convergenceRate,
      isComplete: bestProbability >= 0.95
    };

    return {
      updatedSubgoals,
      resonanceResult,
      newIteration
    };
  }, [analyzeResonance, iterations]);

  const startAlgorithm = useCallback(async (goal: string, constraints: string[]) => {
    setIsProcessing(true);
    setIsConverging(true);
    setIterations([]);
    setCurrentIteration(1);

    // Generate initial subgoals
    const initialSubgoals = generateSubgoals(goal, constraints);
    
    let currentSubgoals = [...initialSubgoals];
    let iterationNumber = 1;
    let hasConverged = false;

    const runIterationCycle = () => {
      const result = runIteration(goal, currentSubgoals, iterationNumber);
      
      currentSubgoals = result.updatedSubgoals;
      setSubgoals([...currentSubgoals]);
      setResonanceData(result.resonanceResult);
      setIterations(prev => [...prev, result.newIteration]);
      setCurrentIteration(iterationNumber);

      // Check for convergence
      if (result.newIteration.bestProbability >= 0.95) {
        hasConverged = true;
        setIsConverging(false);
        setIsProcessing(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      iterationNumber++;
      
      // Limit iterations to prevent infinite loops
      if (iterationNumber > 20) {
        setIsConverging(false);
        setIsProcessing(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    // Start the iteration cycle
    intervalRef.current = setInterval(runIterationCycle, 2000);
    
    // Run first iteration immediately
    setTimeout(runIterationCycle, 500);
  }, [generateSubgoals, runIteration]);

  const stopAlgorithm = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsProcessing(false);
    setIsConverging(false);
  }, []);

  return {
    isProcessing,
    subgoals,
    resonanceData,
    iterations,
    currentIteration,
    isConverging,
    startAlgorithm,
    stopAlgorithm
  };
}