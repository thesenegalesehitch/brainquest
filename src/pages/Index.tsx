
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, BarChart3, Trophy, BookOpen, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userStats, categoryProgress } = useProgress();

  const handleCategorySelect = (categoryId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const progress = categoryProgress[categoryId];
    const startLevel = Math.max(1, progress.level);

    console.log(`Starting category: ${categoryId} at level ${startLevel}`);
    navigate(`/game/${categoryId}/${startLevel}`);
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen stellar-bg">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cosmic-400 via-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
                  Welcome to CogniQuest++
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Entraînez votre cerveau avec des défis scientifiquement conçus.
                Explorez 10 catégories cognitives avec plus de 100 puzzles par niveau.
              </p>

              <div className="card-cosmic max-w-lg mx-auto p-8">
                <h2 className="text-2xl font-bold mb-4 text-cosmic-400">Commencez votre aventure</h2>
                <p className="text-muted-foreground mb-6">
                  Créez un compte pour sauvegarder votre progression, débloquer des achievements
                  et accéder à tous les niveaux de CogniQuest++.
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-gradient-to-r from-cosmic-500 to-stellar-500 hover:from-cosmic-600 hover:to-stellar-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter / S'inscrire
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {categories.slice(0, 6).map((category) => (
                  <CategoryCard
                    key={category.id}
                    title={category.title}
                    description={category.description}
                    icon={category.icon}
                    progress={0}
                    level={1}
                    totalLevels={3}
                    puzzlesCompleted={0}
                    totalPuzzles={300}
                    isLocked={true}
                    onSelect={() => setShowAuthModal(true)}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen stellar-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cosmic-400 via-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
              Welcome back, {user.username}!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Continuez votre entraînement cérébral avec des défis personnalisés.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-dark-100/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard stats={userStats} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-cosmic-400">
                Catégories d'Entraînement
              </h2>
              <p className="text-muted-foreground">
                Chaque catégorie contient 3 niveaux avec 100+ puzzles.
                Obtenez 90%+ pour débloquer le niveau suivant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const progress = categoryProgress[category.id];
                return (
                  <CategoryCard
                    key={category.id}
                    title={category.title}
                    description={category.description}
                    icon={category.icon}
                    progress={progress.progress}
                    level={progress.level}
                    totalLevels={3}
                    puzzlesCompleted={progress.puzzlesCompleted}
                    totalPuzzles={300}
                    isLocked={progress.isLocked}
                    onSelect={() => handleCategorySelect(category.id)}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-stellar-400">
                Achievements & Trophées
              </h2>
              <p className="text-muted-foreground mb-8">
                Collectionnez des trophées en progressant dans vos entraînements cognitifs
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card-cosmic">
                  <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Premier Pas</h3>
                  <p className="text-sm text-muted-foreground">Complétez votre premier puzzle</p>
                  <div className="w-full bg-dark-200 rounded-full h-2 mt-4">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: userStats.puzzlesSolved > 0 ? '100%' : '0%' }}></div>
                  </div>
                </div>

                <div className="card-cosmic">
                  <Trophy className="h-12 w-12 text-stellar-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Marathonien</h3>
                  <p className="text-sm text-muted-foreground">Maintenez un streak de 7 jours</p>
                  <div className="w-full bg-dark-200 rounded-full h-2 mt-4">
                    <div className="bg-stellar-400 h-2 rounded-full" style={{ width: `${Math.min(100, (userStats.streak / 7) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="card-cosmic">
                  <Trophy className="h-12 w-12 text-cosmic-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Expert</h3>
                  <p className="text-sm text-muted-foreground">Atteignez 90% de moyenne</p>
                  <div className="w-full bg-dark-200 rounded-full h-2 mt-4">
                    <div className="bg-cosmic-400 h-2 rounded-full" style={{ width: `${Math.min(100, (userStats.averageScore / 90) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-cosmic-400">
                Base Scientifique
              </h2>
              <p className="text-muted-foreground mb-8">
                Découvrez la science derrière chaque exercice cognitif
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.slice(0, 4).map((category) => (
                  <div key={category.id} className="card-cosmic text-left">
                    <div className="flex items-center space-x-3 mb-4">
                      <category.icon className="h-6 w-6 text-cosmic-400" />
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Compétences :</strong> {category.cognitiveSkills.join(', ')}
                    </p>
                    <p className="text-sm text-stellar-400">
                      {category.scientificBasis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
