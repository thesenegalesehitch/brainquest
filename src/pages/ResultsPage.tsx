
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  Clock, 
  Target,
  Brain,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { categories } from '@/data/categories';
import { useProgress } from '@/contexts/ProgressContext';
import { useToast } from '@/hooks/use-toast';

interface LocationState {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  totalTime: number;
  sessionResults: Array<{
    isCorrect: boolean;
    responseTime: number;
    puzzle: any;
  }>;
}

const ResultsPage = () => {
  const { categoryId, level } = useParams<{ categoryId: string; level: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryProgress } = useProgress();
  const { toast } = useToast();
  
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }
  }, [state, navigate]);

  if (!state || !categoryId || !level) {
    return null;
  }

  const { score, correctAnswers, totalQuestions, totalTime, sessionResults } = state;
  const currentCategory = categories.find(cat => cat.id === categoryId);
  const categoryData = categoryProgress[categoryId];
  
  // Calculate performance metrics
  const averageResponseTime = sessionResults.reduce((acc, result) => acc + result.responseTime, 0) / sessionResults.length;
  const difficulty = sessionResults.reduce((acc, result) => acc + result.puzzle.difficulty, 0) / sessionResults.length;
  
  // Performance rating
  const getPerformanceRating = (score: number) => {
    if (score >= 95) return { rating: 'Parfait', color: 'text-yellow-400', stars: 5 };
    if (score >= 90) return { rating: 'Excellent', color: 'text-green-400', stars: 4 };
    if (score >= 75) return { rating: 'Bien', color: 'text-blue-400', stars: 3 };
    if (score >= 60) return { rating: 'Correct', color: 'text-orange-400', stars: 2 };
    return { rating: 'À améliorer', color: 'text-red-400', stars: 1 };
  };

  const performance = getPerformanceRating(score);
  const canAdvance = score >= 90;
  const nextLevel = parseInt(level) + 1;
  const hasNextLevel = nextLevel <= 3;

  // XP calculation
  const baseXP = score * parseInt(level) * 10;
  const timeBonus = totalTime < 300 ? Math.floor((300 - totalTime) * 2) : 0;
  const streakBonus = score >= 90 ? 100 : 0;
  const totalXP = baseXP + timeBonus + streakBonus;

  const handleRetry = () => {
    navigate(`/game/${categoryId}/${level}`);
  };

  const handleNextLevel = () => {
    if (canAdvance && hasNextLevel) {
      navigate(`/game/${categoryId}/${nextLevel}`);
    } else {
      toast({
        title: "Niveau verrouillé",
        description: "Vous devez obtenir 90% ou plus pour débloquer le niveau suivant",
        variant: "destructive",
      });
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen stellar-bg">
      <header className="border-b border-cosmic-500/20 bg-dark/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cosmic-400 to-stellar-400 bg-clip-text text-transparent">
                Résultats de Session
              </span>
            </h1>
            <p className="text-muted-foreground">
              {currentCategory?.title} - Niveau {level}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Score Card */}
          <Card className="card-cosmic text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {score >= 90 ? (
                  <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
                ) : score >= 75 ? (
                  <Award className="h-16 w-16 text-blue-400" />
                ) : (
                  <Target className="h-16 w-16 text-orange-400" />
                )}
              </div>
              <CardTitle className="text-4xl font-bold mb-2">
                <span className={performance.color}>{score}%</span>
              </CardTitle>
              <p className={`text-xl font-semibold ${performance.color}`}>
                {performance.rating}
              </p>
              <div className="flex justify-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < performance.stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cosmic-400">{correctAnswers}</p>
                  <p className="text-sm text-muted-foreground">Bonnes réponses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-stellar-400">{totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Questions totales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{formatTime(totalTime)}</p>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">+{totalXP}</p>
                  <p className="text-sm text-muted-foreground">XP gagnés</p>
                </div>
              </div>

              {/* Progress to next level */}
              {categoryData && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progression du niveau</span>
                    <span className="text-sm text-muted-foreground">
                      {categoryData.puzzlesCompleted}/100 puzzles
                    </span>
                  </div>
                  <Progress value={categoryData.progress} className="h-3" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={handleHome}
                  variant="outline"
                  className="border-cosmic-500/50 hover:bg-cosmic-500/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>

                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="border-stellar-500/50 hover:bg-stellar-500/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Recommencer
                </Button>

                {hasNextLevel && (
                  <Button
                    onClick={handleNextLevel}
                    disabled={!canAdvance}
                    className={`${
                      canAdvance 
                        ? 'bg-gradient-to-r from-cosmic-500 to-stellar-500 hover:from-cosmic-600 hover:to-stellar-600' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Niveau suivant
                  </Button>
                )}
              </div>

              {!canAdvance && (
                <div className="mt-4 p-4 bg-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-300">
                    💡 Obtenez 90% ou plus pour débloquer le niveau suivant !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Analysis */}
            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-cosmic-400" />
                  <span>Analyse de Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temps de réponse moyen</span>
                  <span className="font-medium">{Math.round(averageResponseTime / 1000)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Difficulté moyenne</span>
                  <span className="font-medium">{difficulty.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de réussite</span>
                  <span className="font-medium text-green-400">{score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bonus temporel</span>
                  <span className="font-medium text-stellar-400">+{timeBonus} XP</span>
                </div>
              </CardContent>
            </Card>

            {/* Category Progress */}
            <Card className="card-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-stellar-400" />
                  <span>Progression Catégorie</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Niveau actuel</span>
                      <span className="font-medium">{categoryData.level}/3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Puzzles complétés</span>
                      <span className="font-medium">{categoryData.puzzlesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Meilleur score</span>
                      <span className="font-medium text-cosmic-400">{categoryData.bestScore || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temps total passé</span>
                      <span className="font-medium">{formatTime(categoryData.totalTime || 0)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Scientific Insight */}
          <Card className="card-cosmic">
            <CardHeader>
              <CardTitle className="text-center text-stellar-400">
                💡 Insight Scientifique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {score >= 90 
                    ? "Excellent travail ! Votre cerveau a démontré une neuroplasticité remarquable. Selon les études de Merzenich, ce type d'entraînement cognitif renforce les connexions synaptiques."
                    : score >= 75
                    ? "Bonne performance ! L'entraînement régulier améliore les fonctions exécutives selon les recherches de Diamond (2013). Continuez pour optimiser vos capacités cognitives."
                    : "Ne vous découragez pas ! La théorie de la zone proximale de développement de Vygotsky montre que la difficulté optimale mène à l'amélioration. Persévérez !"
                  }
                </p>
                <div className="inline-block px-4 py-2 bg-cosmic-500/20 rounded-lg">
                  <p className="text-sm font-medium text-cosmic-400">
                    Prochaine session recommandée : {score >= 90 ? 'Niveau supérieur' : 'Même niveau'} dans 4-6h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
