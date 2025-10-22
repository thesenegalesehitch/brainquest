
import React from 'react';
import { WifiOff, Wifi, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useAuth();
  const { syncProgress, isLoading } = useProgress();

  if (isOnline) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-lg">
        <Wifi className="h-4 w-4 text-green-400" />
        <span className="text-xs text-green-400">En ligne</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={syncProgress}
          disabled={isLoading}
          className="p-1 h-6 hover:bg-green-500/20"
        >
          <Cloud className={`h-3 w-3 ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 rounded-lg">
      <WifiOff className="h-4 w-4 text-red-400" />
      <span className="text-xs text-red-400">Hors ligne</span>
      <CloudOff className="h-3 w-3 text-red-400" />
    </div>
  );
};

export default OfflineIndicator;
