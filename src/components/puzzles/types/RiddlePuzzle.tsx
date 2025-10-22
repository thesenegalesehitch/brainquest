
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface RiddlePuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const RiddlePuzzle: React.FC<RiddlePuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (userAnswer.trim() && !isAnswered) {
      onAnswer(userAnswer);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-6">
          <p className="text-lg text-center leading-relaxed">
            {puzzle.content.question}
          </p>
        </CardContent>
      </Card>

      {puzzle.content.hint && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-stellar-400 hover:text-stellar-300"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {showHint ? 'Masquer l\'indice' : 'Afficher un indice'}
          </Button>
          
          {showHint && (
            <Card className="mt-3 bg-stellar-500/10 border-stellar-500/20">
              <CardContent className="p-4">
                <p className="text-sm text-stellar-300">{puzzle.content.hint}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <Input
          placeholder="Tapez votre réponse..."
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
          Valider la réponse
        </Button>
      </div>
    </div>
  );
};

export default RiddlePuzzle;
