import React from 'react';
import { Brain, Target, Clock, Flame, Trophy, TrendingUp, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  stats: {
    totalXP: number;
    level: number;
    streak: number;
    puzzlesSolved: number;
    averageScore: number;
    timeSpent: number;
    achievements: number;
    weeklyProgress: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const progressToNextLevel = ((stats.totalXP % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-cosmic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-stellar-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cosmic-400">
              {stats.totalXP.toLocaleString()}
            </div>
            <div className="progress-cosmic mt-2">
              <div 
                className="progress-fill" 
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.ceil((1000 - (stats.totalXP % 1000)))} XP to level {stats.level + 1}
            </p>
          </CardContent>
        </Card>

        <Card className="card-cosmic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-stellar-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stellar-400">
              {stats.level}
            </div>
            <p className="text-xs text-muted-foreground">
              Cognitive Master
            </p>
          </CardContent>
        </Card>

        <Card className="card-cosmic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-4 w-4 text-stellar-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stellar-400">
              {stats.streak}
            </div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card className="card-cosmic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puzzles Solved</CardTitle>
            <Target className="h-4 w-4 text-cosmic-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cosmic-400">
              {stats.puzzlesSolved}
            </div>
            <p className="text-xs text-muted-foreground">
              total completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-cosmic-400" />
              <span>Cognitive Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Score</span>
              <span className="text-lg font-semibold text-cosmic-400">
                {stats.averageScore}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time Spent</span>
              <span className="text-lg font-semibold text-stellar-400">
                {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Achievements</span>
              <span className="text-lg font-semibold text-stellar-400">
                {stats.achievements}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-cosmic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-stellar-400" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-stellar-400 mb-2">
              +{stats.weeklyProgress}%
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Improvement this week
            </p>
            <div className="progress-cosmic">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(stats.weeklyProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-stellar-400" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-dark-100/50 rounded-lg">
              <div className="w-8 h-8 bg-stellar-400/20 rounded-full flex items-center justify-center">
                <Flame className="h-4 w-4 text-stellar-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Week Warrior</p>
                <p className="text-xs text-muted-foreground">7-day streak</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-dark-100/50 rounded-lg">
              <div className="w-8 h-8 bg-cosmic-400/20 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-cosmic-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Logic Master</p>
                <p className="text-xs text-muted-foreground">100% in Logic</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-dark-100/50 rounded-lg">
              <div className="w-8 h-8 bg-stellar-400/20 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-stellar-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Speed Demon</p>
                <p className="text-xs text-muted-foreground">Sub 30s average</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
