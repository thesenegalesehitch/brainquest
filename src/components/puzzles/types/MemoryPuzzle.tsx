
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Puzzle } from '@/types/puzzle';

interface MemoryPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string[]) => void;
  isAnswered: boolean;
}

const MemoryPuzzle: React.FC<MemoryPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [phase, setPhase] = useState<'display' | 'input'>('display');
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);

  const colors = ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet'];
  const colorMap: Record<string, string> = {
    rouge: 'bg-red-500',
    bleu: 'bg-blue-500',
    vert: 'bg-green-500',
    jaune: 'bg-yellow-500',
    orange: 'bg-orange-500',
    violet: 'bg-purple-500'
  };

  useEffect(() => {
    if (phase === 'display') {
      const timer = setTimeout(() => {
        if (displayIndex < puzzle.content.sequence.length - 1) {
          setDisplayIndex(displayIndex + 1);
        } else {
          setTimeout(() => setPhase('input'), 1000);
        }
      }, puzzle.content.displayTime / puzzle.content.sequence.length);
      
      return () => clearTimeout(timer);
    }
  }, [phase, displayIndex, puzzle.content]);

  const handleColorClick = (color: string) => {
    if (phase === 'input' && !isAnswered) {
      const newSequence = [...userSequence, color];
      setUserSequence(newSequence);
      
      if (newSequence.length === puzzle.content.sequence.length) {
        onAnswer(newSequence);
      }
    }
  };

  return (
    <div className="space-y-6">
      {phase === 'display' ? (
        <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-cosmic-400 mb-6">
              Mémorisez la séquence de couleurs :
            </h3>
            
            <div className="flex justify-center space-x-4 mb-6">
              {puzzle.content.sequence.map((color: string, index: number) => (
                <div
                  key={index}
                  className={`
                    w-16 h-16 rounded-full border-4 transition-all duration-300
                    ${index <= displayIndex 
                      ? `${colorMap[color]} border-white scale-110 shadow-lg` 
                      : 'bg-gray-600 border-gray-400'
                    }
                  `}
                />
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Couleur {displayIndex + 1} sur {puzzle.content.sequence.length}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Card className="bg-stellar-500/10 border-stellar-500/20 mb-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-stellar-400 mb-4">
                Reproduisez la séquence dans l'ordre :
              </h3>
              
              <div className="flex justify-center space-x-2 mb-4">
                {userSequence.map((color, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full ${colorMap[color]} border-2 border-white`}
                  />
                ))}
                {Array.from({ length: puzzle.content.sequence.length - userSequence.length }).map((_, index) => (
                  <div
                    key={index + userSequence.length}
                    className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-400"
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {userSequence.length} / {puzzle.content.sequence.length} couleurs
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {colors.map((color) => (
              <Button
                key={color}
                onClick={() => handleColorClick(color)}
                disabled={isAnswered || userSequence.length >= puzzle.content.sequence.length}
                className={`h-16 ${colorMap[color]} hover:scale-105 transition-transform border-2 border-white`}
              >
                <span className="text-white font-semibold text-sm">{color}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryPuzzle;
