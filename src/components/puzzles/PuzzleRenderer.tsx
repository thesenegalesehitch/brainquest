
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Puzzle, PuzzleSolution } from '@/types/puzzle';

// Lazy load puzzle components for better performance
const RiddlePuzzle = lazy(() => import('./types/RiddlePuzzle'));
const VisualPuzzle = lazy(() => import('./types/VisualPuzzle'));
const LogicPuzzle = lazy(() => import('./types/LogicPuzzle'));
const SequencePuzzle = lazy(() => import('./types/SequencePuzzle'));
const MemoryPuzzle = lazy(() => import('./types/MemoryPuzzle'));
const CalculationPuzzle = lazy(() => import('./types/CalculationPuzzle'));
const SpatialPuzzle = lazy(() => import('./types/SpatialPuzzle'));
const EmotionalPuzzle = lazy(() => import('./types/EmotionalPuzzle'));
const OrientationPuzzle = lazy(() => import('./types/OrientationPuzzle'));
const LanguagePuzzle = lazy(() => import('./types/LanguagePuzzle'));

interface PuzzleRendererProps {
  puzzle: Puzzle;
  onAnswer: (isCorrect: boolean, responseTime: number) => void;
  timeLeft: number;
  isAnswered: boolean;
}

const PuzzleRenderer: React.FC<PuzzleRendererProps> = React.memo(({
  puzzle,
  onAnswer,
  timeLeft,
  isAnswered
}) => {
  const [startTime] = useState<number>(Date.now());

  const checkAnswer = React.useCallback((userAnswer: PuzzleSolution, solution: PuzzleSolution): boolean => {
    if (typeof solution === 'string' && typeof userAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === solution.toLowerCase().trim();
    }
    if (typeof solution === 'number' && typeof userAnswer === 'number') {
      return userAnswer === solution;
    }
    if (Array.isArray(solution) && Array.isArray(userAnswer)) {
      return JSON.stringify(userAnswer) === JSON.stringify(solution);
    }
    return false;
  }, []);

  const handleAnswer = React.useCallback((answer: PuzzleSolution) => {
    if (isAnswered) return;

    const responseTime = Date.now() - startTime;
    const isCorrect = checkAnswer(answer, puzzle.solution);
    onAnswer(isCorrect, responseTime);
  }, [isAnswered, startTime, puzzle.solution, onAnswer, checkAnswer]);

  const renderPuzzleByType = () => {
    const commonProps = { puzzle, onAnswer: handleAnswer, isAnswered };

    switch (puzzle.type) {
      case 'riddle':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <RiddlePuzzle {...commonProps} />
          </Suspense>
        );
      case 'visual':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <VisualPuzzle {...commonProps} />
          </Suspense>
        );
      case 'logic':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <LogicPuzzle {...commonProps} />
          </Suspense>
        );
      case 'sequence':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <SequencePuzzle {...commonProps} />
          </Suspense>
        );
      case 'memory':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <MemoryPuzzle {...commonProps} />
          </Suspense>
        );
      case 'calculation':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <CalculationPuzzle {...commonProps} />
          </Suspense>
        );
      case 'spatial':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <SpatialPuzzle {...commonProps} />
          </Suspense>
        );
      case 'emotional':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <EmotionalPuzzle {...commonProps} />
          </Suspense>
        );
      case 'orientation':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <OrientationPuzzle {...commonProps} />
          </Suspense>
        );
      case 'language':
        return (
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <LanguagePuzzle {...commonProps} />
          </Suspense>
        );
      default:
        return <div className="text-center py-8 text-red-400">Type de puzzle non supporté</div>;
    }
  };

  return (
    <Card className="card-cosmic max-w-4xl mx-auto" role="main" aria-label={`Puzzle: ${puzzle.title}`}>
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
});

PuzzleRenderer.displayName = 'PuzzleRenderer';

export default PuzzleRenderer;
