
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, MapPin } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface OrientationPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: number[][]) => void;
  isAnswered: boolean;
}

const OrientationPuzzle: React.FC<OrientationPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [selectedPath, setSelectedPath] = useState<number[][]>([]);
  const [currentPos, setCurrentPos] = useState<number[]>(puzzle.content.start);

  const getCellContent = (row: number, col: number) => {
    const cell = puzzle.content.maze[row][col];
    
    if (selectedPath.some(([r, c]) => r === row && c === col)) {
      return '🟡'; // Path
    }
    
    switch (cell) {
      case 'S': return '🟢'; // Start
      case 'E': return '🔴'; // End
      case '█': return '⬛'; // Wall
      case '░': return '⬜'; // Empty
      default: return '⬜';
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (isAnswered || puzzle.content.maze[row][col] === '█') return;
    
    const newPath = [...selectedPath, [row, col]];
    setSelectedPath(newPath);
    setCurrentPos([row, col]);
    
    if (row === puzzle.content.end[0] && col === puzzle.content.end[1]) {
      onAnswer(newPath);
    }
  };

  const resetPath = () => {
    if (!isAnswered) {
      setSelectedPath([]);
      setCurrentPos(puzzle.content.start);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Compass className="h-8 w-8 text-cosmic-400 mr-3" />
            <h3 className="text-2xl font-semibold text-cosmic-400">Navigation Spatiale</h3>
          </div>
          
          <p className="text-lg text-stellar-400">
            Trouvez le chemin le plus court de 🟢 à 🔴
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>🟢</span>
              <span>Départ</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔴</span>
              <span>Arrivée</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⬛</span>
              <span>Obstacle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-stellar-500/10 border-stellar-500/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
            {puzzle.content.maze.map((row: string[], rowIndex: number) =>
              row.map((_, colIndex: number) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant="outline"
                  className="h-12 w-12 p-0 text-xl hover:scale-105 transition-transform"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={isAnswered}
                >
                  {getCellContent(rowIndex, colIndex)}
                </Button>
              ))
            )}
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-stellar-400" />
                <span className="text-sm">Position: ({currentPos[0]}, {currentPos[1]})</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Étapes: {selectedPath.length}
              </div>
            </div>
            
            <Button 
              onClick={resetPath}
              disabled={isAnswered || selectedPath.length === 0}
              variant="outline"
              className="btn-stellar"
            >
              Recommencer le chemin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrientationPuzzle;
