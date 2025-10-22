
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle } from '@/types/puzzle';

interface LogicPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const LogicPuzzle: React.FC<LogicPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    if (userAnswer.trim() && !isAnswered) {
      onAnswer(userAnswer);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-cosmic-400">Prémisses :</h3>
          {puzzle.content.premises.map((premise: string, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-stellar-400 rounded-full flex items-center justify-center text-sm font-bold text-dark">
                {index + 1}
              </div>
              <p className="text-foreground">{premise}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-stellar-500/10 border-stellar-500/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-stellar-400 mb-3">Question :</h3>
          <p className="text-foreground">{puzzle.content.question}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4">
        <Input
          placeholder="Tapez votre déduction..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isAnswered}
          className="text-center text-lg py-3"
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer.trim() || isAnswered}
          className="btn-cosmic mx-auto px-8"
        >
          Valider la déduction
        </Button>
      </div>
    </div>
  );
};

export default LogicPuzzle;
