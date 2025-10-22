
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle } from '@/types/puzzle';

interface SequencePuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: number) => void;
  isAnswered: boolean;
}

const SequencePuzzle: React.FC<SequencePuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
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
        <CardContent className="p-8">
          <h3 className="text-lg font-semibold text-cosmic-400 mb-4 text-center">
            Trouvez le nombre suivant dans la séquence :
          </h3>
          
          <div className="flex items-center justify-center space-x-4 text-2xl font-mono">
            {puzzle.content.sequence.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`
                  px-4 py-2 rounded-lg border-2 
                  ${item === '?' 
                    ? 'border-stellar-400 bg-stellar-500/20 text-stellar-400' 
                    : 'border-cosmic-400 bg-cosmic-500/20 text-cosmic-400'
                  }
                `}>
                  {item}
                </div>
                {index < puzzle.content.sequence.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Type: {puzzle.content.type === 'geometric' ? 'Suite géométrique' : 'Suite arithmétique'}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4">
        <Input
          type="number"
          placeholder="Entrez le nombre suivant..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isAnswered}
          className="text-center text-xl py-3 font-mono"
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer || isAnswered}
          className="btn-cosmic mx-auto px-8"
        >
          Valider la réponse
        </Button>
      </div>
    </div>
  );
};

export default SequencePuzzle;
