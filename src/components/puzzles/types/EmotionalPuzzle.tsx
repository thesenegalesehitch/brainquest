
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface EmotionalPuzzleProps {
  puzzle: Puzzle;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const EmotionalPuzzle: React.FC<EmotionalPuzzleProps> = ({ puzzle, onAnswer, isAnswered }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const emotionEmojis: Record<string, string> = {
    'Joie': '😊',
    'Tristesse': '😢',
    'Colère': '😠',
    'Peur': '😨',
    'Surprise': '😲',
    'Dégoût': '🤢'
  };

  const handleEmotionSelect = (emotion: string) => {
    if (!isAnswered) {
      setSelectedEmotion(emotion);
      onAnswer(emotion);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cosmic-500/10 to-stellar-500/10 border-cosmic-500/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-cosmic-400 mr-3" />
            <h3 className="text-2xl font-semibold text-cosmic-400">Intelligence Émotionnelle</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-stellar-500/10 border-stellar-500/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-stellar-400 mb-4">Scénario :</h3>
          <p className="text-foreground leading-relaxed mb-6 text-center text-lg">
            {puzzle.content.scenario}
          </p>
          
          <h3 className="text-lg font-semibold text-cosmic-400 mb-4 text-center">
            Quelle émotion Marie ressent-elle ?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {puzzle.content.emotions.map((emotion: string) => (
              <Button
                key={emotion}
                variant={selectedEmotion === emotion ? "default" : "outline"}
                className={`h-16 text-lg ${
                  selectedEmotion === emotion
                    ? 'bg-cosmic-500 hover:bg-cosmic-600' 
                    : 'hover:bg-cosmic-500/20'
                }`}
                onClick={() => handleEmotionSelect(emotion)}
                disabled={isAnswered}
              >
                <span className="text-2xl mr-3">{emotionEmojis[emotion]}</span>
                {emotion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEmotion && !isAnswered && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Émotion sélectionnée: {emotionEmojis[selectedEmotion]} {selectedEmotion}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionalPuzzle;
