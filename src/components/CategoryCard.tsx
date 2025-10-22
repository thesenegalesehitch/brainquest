
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  level: number;
  totalLevels: number;
  puzzlesCompleted: number;
  totalPuzzles: number;
  isLocked: boolean;
  onSelect: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon: Icon,
  progress,
  level,
  totalLevels,
  puzzlesCompleted,
  totalPuzzles,
  isLocked,
  onSelect
}) => {
  return (
    <div className={`card-cosmic group cursor-pointer transform transition-all duration-300 hover:scale-105 ${isLocked ? 'opacity-60' : 'hover:glow-cosmic'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${isLocked ? 'bg-gray-600' : 'bg-gradient-to-br from-cosmic-500/20 to-stellar-500/20'} backdrop-blur-sm`}>
          <Icon className={`h-6 w-6 ${isLocked ? 'text-gray-400' : 'text-cosmic-400'}`} />
        </div>
        
        {!isLocked && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-stellar-400 font-medium">Level {level}/{totalLevels}</span>
            <div className="flex space-x-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i < level ? 'bg-stellar-400' : 'bg-gray-600'}`} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className={`text-lg font-semibold mb-2 ${isLocked ? 'text-gray-400' : 'text-foreground'}`}>
        {title}
      </h3>
      
      <p className={`text-sm mb-4 ${isLocked ? 'text-gray-500' : 'text-muted-foreground'}`}>
        {description}
      </p>

      {!isLocked && (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs text-cosmic-400 font-medium">
              {puzzlesCompleted}/{totalPuzzles}
            </span>
          </div>
          
          <div className="progress-cosmic mb-4">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      <Button 
        onClick={onSelect}
        disabled={isLocked}
        className={`w-full ${isLocked ? 'bg-gray-600 text-gray-400' : 'btn-cosmic'}`}
      >
        {isLocked ? 'Locked' : 'Start Training'}
      </Button>

      {isLocked && (
        <p className="text-xs text-center mt-2 text-gray-500">
          Complete previous categories to unlock
        </p>
      )}
    </div>
  );
};

export default CategoryCard;
