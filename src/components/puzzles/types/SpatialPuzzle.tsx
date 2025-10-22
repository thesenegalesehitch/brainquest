
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shapes } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface SpatialPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string[]) => void;
  isAnswered: boolean;
}

const SpatialPuzzle: React.FC<SpatialPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

  const pieceShapes: Record<string, string> = {
    triangle_large: '🔺',
    triangle_medium: '🔻',
    square: '⬜',
    parallelogram: '🔶',
    rhombus: '🔷'
  };

  const handlePieceClick = (piece: string) => {
    if (!isAnswered) {
      const newSelection = selectedPieces.includes(piece)
        ? selectedPieces.filter(p => p !== piece)
        : [...selectedPieces, piece];
      
      setSelectedPieces(newSelection);
    }
  };

  const handleSubmit = () => {
    if (selectedPieces.length > 0 && !isAnswered) {
      onAnswer(selectedPieces);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shapes className="h-8 w-8 text-cosmic-400 mr-3" />
            <h3 className="text-2xl font-semibold text-cosmic-400">Tangram Créatif</h3>
          </div>
          
          <div className="text-8xl mb-6">
            {puzzle.content.target === 'square' ? '⬜' : '🔺'}
          </div>
          
          <p className="text-lg text-stellar-400">
            Formez un {puzzle.content.target === 'square' ? 'carré' : 'triangle'} avec les pièces disponibles
          </p>
        </CardContent>
      </Card>

      <Card className="bg-stellar-500/10 border-stellar-500/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-stellar-400 mb-4 text-center">
            Pièces disponibles (cliquez pour sélectionner) :
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {puzzle.content.pieces.map((piece: string, index: number) => (
              <Button
                key={index}
                variant={selectedPieces.includes(piece) ? "default" : "outline"}
                className={`h-20 text-4xl ${
                  selectedPieces.includes(piece)
                    ? 'bg-cosmic-500 hover:bg-cosmic-600' 
                    : 'hover:bg-cosmic-500/20'
                }`}
                onClick={() => handlePieceClick(piece)}
                disabled={isAnswered}
              >
                {pieceShapes[piece] || '🔸'}
              </Button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Pièces sélectionnées: {selectedPieces.length}
            </p>
            
            <Button 
              onClick={handleSubmit}
              disabled={selectedPieces.length === 0 || isAnswered}
              className="btn-cosmic px-8"
            >
              Valider l'arrangement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpatialPuzzle;
