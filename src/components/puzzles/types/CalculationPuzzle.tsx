
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface CalculationPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: number) => void;
  isAnswered: boolean;
}

const CalculationPuzzle: React.FC<CalculationPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = () => {
    const numAnswer = parseFloat(userAnswer);
    if (!isNaN(numAnswer) && !isAnswered) {
      onAnswer(numAnswer);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="h-8 w-8 text-cosmic-400 mr-3" />
            <h3 className="text-2xl font-semibold text-cosmic-400">Calcul Mental</h3>
          </div>
          
          <div className="text-6xl font-mono text-foreground mb-6">
            {puzzle.content.operation}
          </div>
          
          <p className="text-lg text-stellar-400">
            Calculez mentalement, le plus rapidement possible !
          </p>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Type: {puzzle.content.type === 'addition' ? 'Addition' : 
                   puzzle.content.type === 'subtraction' ? 'Soustraction' :
                   puzzle.content.type === 'multiplication' ? 'Multiplication' : 'Division'}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4">
        <Input
          type="number"
          placeholder="Résultat..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isAnswered}
          className="text-center text-3xl py-4 font-mono"
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer || isAnswered}
          className="btn-cosmic mx-auto px-8 text-lg py-3"
        >
          Valider le calcul
        </Button>
      </div>
    </div>
  );
};

export default CalculationPuzzle;
