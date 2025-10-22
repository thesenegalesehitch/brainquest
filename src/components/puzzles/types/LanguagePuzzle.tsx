
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Shuffle } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface LanguagePuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const LanguagePuzzle: React.FC<LanguagePuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState(puzzle.content.letters.split(''));

  const shuffleLetters = () => {
    if (!isAnswered) {
      const letters = [...shuffledLetters];
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      setShuffledLetters(letters);
    }
  };

  const addLetterToAnswer = (letter: string, index: number) => {
    if (!isAnswered) {
      setUserAnswer(prev => prev + letter);
      setShuffledLetters(prev => prev.filter((_, i) => i !== index));
    }
  };

  const removeLastLetter = () => {
    if (!isAnswered && userAnswer.length > 0) {
      const lastLetter = userAnswer[userAnswer.length - 1];
      setUserAnswer(prev => prev.slice(0, -1));
      setShuffledLetters(prev => [...prev, lastLetter]);
    }
  };

  const handleSubmit = () => {
    if (userAnswer.trim() && !isAnswered) {
      onAnswer(userAnswer);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-8 w-8 text-cosmic-400 mr-3" />
            <h3 className="text-2xl font-semibold text-cosmic-400">Anagramme</h3>
          </div>
          
          <p className="text-lg text-stellar-400 mb-4">
            {puzzle.content.clue}
          </p>
          
          <div className="text-sm text-muted-foreground">
            Réarrangez les lettres pour former le mot
          </div>
        </CardContent>
      </Card>

      <Card className="bg-stellar-500/10 border-stellar-500/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-stellar-400 mb-4">
              Lettres disponibles :
            </h3>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {shuffledLetters.map((letter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-12 w-12 text-xl font-bold hover:bg-cosmic-500/20"
                  onClick={() => addLetterToAnswer(letter, index)}
                  disabled={isAnswered}
                >
                  {letter}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={shuffleLetters}
              disabled={isAnswered}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-stellar-400"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Mélanger
            </Button>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-cosmic-400 mb-4">
              Votre réponse :
            </h3>
            
            <div className="flex justify-center mb-4">
              <div className="border-2 border-cosmic-400 rounded-lg p-4 min-w-48 min-h-12 bg-cosmic-500/10">
                <span className="text-2xl font-bold tracking-widest">
                  {userAnswer || '___'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={removeLastLetter}
                disabled={isAnswered || userAnswer.length === 0}
                variant="outline"
                size="sm"
              >
                ← Effacer
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || isAnswered}
                className="btn-cosmic"
              >
                Valider
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguagePuzzle;
