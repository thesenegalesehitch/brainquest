
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Home, Pause, Play, SkipForward } from 'lucide-react';
import PuzzleRenderer from '@/components/puzzles/PuzzleRenderer';
import { getPuzzlesByCategory } from '@/data/puzzles';
import { categories } from '@/data/categories';
import { Puzzle } from '@/types/puzzle';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useToast } from '@/hooks/use-toast';

const GamePage = () => {
  const { categoryId, level } = useParams<{ categoryId: string; level: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  const { toast } = useToast();
  
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    isCorrect: boolean;
    responseTime: number;
    puzzle: Puzzle;
  }[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Load puzzles for category and level
  useEffect(() => {
    if (categoryId && level) {
      const categoryPuzzles = getPuzzlesByCategory(categoryId, parseInt(level));
      // Shuffle and take first 20 puzzles for the session
      const shuffled = [...categoryPuzzles].sort(() => Math.random() - 0.5);
      setPuzzles(shuffled.slice(0, 20));
      setTimeLeft(shuffled[0]?.timeLimit || 60);
    }
  }, [categoryId, level]);

  const calculatePoints = useCallback((isCorrect: boolean, responseTime: number, difficulty: number, timeRemaining: number): number => {
    if (!isCorrect) return 0;

    const basePoints = difficulty * 10;
    const speedBonus = Math.max(0, timeRemaining * 2);
    const difficultyBonus = difficulty * 5;

    return Math.floor(basePoints + speedBonus + difficultyBonus);
  }, []);

  const handleSessionComplete = useCallback(() => {
    const finalScore = Math.floor((correctAnswers / puzzles.length) * 100);
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);

    // Update progress
    if (categoryId && level) {
      updateProgress(categoryId, parseInt(level), finalScore, totalTime);
    }

    navigate(`/results/${categoryId}/${level}`, {
      state: {
        score: finalScore,
        correctAnswers,
        totalQuestions: puzzles.length,
        totalTime,
        sessionResults
      }
    });
  }, [correctAnswers, puzzles.length, gameStartTime, categoryId, level, updateProgress, navigate, sessionResults]);

  const handleNextPuzzle = useCallback(() => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
      setTimeLeft(puzzles[currentPuzzleIndex + 1]?.timeLimit || 60);
      setIsAnswered(false);
    } else {
      // End of session
      handleSessionComplete();
    }
  }, [currentPuzzleIndex, puzzles, handleSessionComplete]);

  const handleAnswer = useCallback((isCorrect: boolean, responseTime: number) => {
    if (isAnswered) return;

    setIsAnswered(true);

    const currentPuzzle = puzzles[currentPuzzleIndex];
    const points = calculatePoints(isCorrect, responseTime, currentPuzzle.difficulty, timeLeft);

    setScore(prev => prev + points);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Store result for final analysis
    setSessionResults(prev => [...prev, {
      isCorrect,
      responseTime,
      puzzle: currentPuzzle
    }]);

    // Show feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: `+${points} points`,
      duration: 1500,
    });

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextPuzzle();
    }, 2000);
  }, [isAnswered, puzzles, currentPuzzleIndex, calculatePoints, timeLeft, toast, handleNextPuzzle]);

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      handleAnswer(false, puzzles[currentPuzzleIndex]?.timeLimit * 1000 || 60000);
    }
  }, [isAnswered, puzzles, currentPuzzleIndex, handleAnswer]);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleSkip = useCallback(() => {
    if (!isAnswered) {
      handleAnswer(false, puzzles[currentPuzzleIndex]?.timeLimit * 1000 || 60000);
    }
  }, [isAnswered, puzzles, currentPuzzleIndex, handleAnswer]);

  // Timer logic
  useEffect(() => {
    if (isPaused || isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, isAnswered, handleTimeUp]);

  const currentCategory = categories.find(cat => cat.id === categoryId);
  const currentPuzzle = puzzles[currentPuzzleIndex];
  const progress = ((currentPuzzleIndex + 1) / puzzles.length) * 100;

  if (!user) return null;

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen stellar-bg flex items-center justify-center">
        <div className="card-cosmic">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
          <div className="w-full bg-dark-200 rounded-full h-2">
            <div className="bg-cosmic-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen stellar-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-cosmic-500/20 bg-dark/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-cosmic-500/20"
              >
                <Home className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-cosmic-400">
                  {currentCategory?.title} - Niveau {level}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentPuzzleIndex + 1} sur {puzzles.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                <Clock className="h-4 w-4 text-stellar-400" />
                <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-stellar-400'}`}>
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                <span className="text-sm font-medium text-cosmic-400">
                  Score: {score}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePause}
                className="hover:bg-cosmic-500/20"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="hover:bg-red-500/20 text-red-400"
                disabled={isAnswered}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Progression: {Math.round(progress)}%
            </p>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container mx-auto px-4 py-8">
        {isPaused ? (
          <div className="text-center">
            <div className="card-cosmic max-w-md mx-auto">
              <Pause className="h-16 w-16 text-stellar-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Session en pause</h2>
              <p className="text-muted-foreground mb-6">
                Reprenez quand vous êtes prêt !
              </p>
              <Button 
                onClick={handlePause}
                className="bg-gradient-to-r from-cosmic-500 to-stellar-500 hover:from-cosmic-600 hover:to-stellar-600"
              >
                <Play className="h-4 w-4 mr-2" />
                Reprendre
              </Button>
            </div>
          </div>
        ) : (
          <PuzzleRenderer
            puzzle={currentPuzzle}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
            isAnswered={isAnswered}
          />
        )}
      </main>
    </div>
  );
};

export default GamePage;
