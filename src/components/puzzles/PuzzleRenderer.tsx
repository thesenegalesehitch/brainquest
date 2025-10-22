
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Puzzle } from '@/types/puzzle';
import RiddlePuzzle from './types/RiddlePuzzle';
import VisualPuzzle from './types/VisualPuzzle';
import LogicPuzzle from './types/LogicPuzzle';
import SequencePuzzle from './types/SequencePuzzle';
import MemoryPuzzle from './types/MemoryPuzzle';
import CalculationPuzzle from './types/CalculationPuzzle';
import SpatialPuzzle from './types/SpatialPuzzle';
import EmotionalPuzzle from './types/EmotionalPuzzle';
import OrientationPuzzle from './types/OrientationPuzzle';
import LanguagePuzzle from './types/LanguagePuzzle';

interface PuzzleRendererProps {
  puzzle: Puzzle;
  onAnswer: (isCorrect: boolean, responseTime: number) => void;
  timeLeft: number;
  isAnswered: boolean;
}

const PuzzleRenderer: React.FC<PuzzleRendererProps> = ({
  puzzle,
  onAnswer,
  timeLeft,
  isAnswered
}) => {
  const [startTime] = useState(Date.now());
  
  const handleAnswer = (answer: any) => {
    if (isAnswered) return;
    
    const responseTime = Date.now() - startTime;
    const isCorrect = checkAnswer(answer, puzzle.solution);
    onAnswer(isCorrect, responseTime);
  };

  const checkAnswer = (userAnswer: any, solution: any): boolean => {
    if (typeof solution === 'string' && typeof userAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === solution.toLowerCase().trim();
    }
    return JSON.stringify(userAnswer) === JSON.stringify(solution);
  };

  const renderPuzzleByType = () => {
    switch (puzzle.type) {
      case 'riddle':
        return <RiddlePuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'visual':
        return <VisualPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'logic':
        return <LogicPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'sequence':
        return <SequencePuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'memory':
        return <MemoryPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'calculation':
        return <CalculationPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'spatial':
        return <SpatialPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'emotional':
        return <EmotionalPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'orientation':
        return <OrientationPuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      case 'language':
        return <LanguagePuzzle puzzle={puzzle} onAnswer={handleAnswer} isAnswered={isAnswered} />;
      default:
        return <div>Type de puzzle non supporté</div>;
    }
  };

  return (
    <Card className="card-cosmic max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-cosmic-400">
          {puzzle.title}
        </CardTitle>
        <p className="text-muted-foreground">{puzzle.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stellar-400">Difficulté: {puzzle.difficulty}/10</span>
          <span className="text-cosmic-400">Temps optimal: {puzzle.timeLimit}s</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderPuzzleByType()}
      </CardContent>
    </Card>
  );
};

export default PuzzleRenderer;
