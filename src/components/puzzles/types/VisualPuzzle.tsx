
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle } from '@/types/puzzle';

interface VisualPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: number) => void;
  isAnswered: boolean;
}

const VisualPuzzle: React.FC<VisualPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
      onAnswer(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20 inline-block">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">{puzzle.content.baseShape}</div>
            <p className="text-sm text-muted-foreground">
              Forme de base (rotation de {puzzle.content.rotation}°)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4 text-cosmic-400">
          Choisissez la forme après rotation :
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {puzzle.content.rotatedOptions.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedOption === index ? "default" : "outline"}
              className={`h-20 text-4xl ${
                selectedOption === index 
                  ? 'bg-cosmic-500 hover:bg-cosmic-600' 
                  : 'hover:bg-cosmic-500/20'
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {selectedOption !== null && !isAnswered && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Option {selectedOption + 1} sélectionnée
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualPuzzle;
