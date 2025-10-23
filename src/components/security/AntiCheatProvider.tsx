import React, { useEffect, useState, createContext, useContext } from 'react';
import { toast } from '@/components/ui/sonner';
import { ServerValidation } from '@/utils/serverValidation';
import { SessionManager } from '@/utils/security';

interface AntiCheatContextType {
  violations: number;
  isSecure: boolean;
}

const AntiCheatContext = createContext<AntiCheatContextType>({
  violations: 0,
  isSecure: true
});

interface AntiCheatProviderProps {
  children: React.ReactNode;
}

const AntiCheatProvider: React.FC<AntiCheatProviderProps> = ({ children }) => {
  const [violations, setViolations] = useState(0);
  const [isSecure, setIsSecure] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionValidated, setSessionValidated] = useState(false);

  useEffect(() => {
    // Validate session integrity on mount
    const validateSession = () => {
      const session = SessionManager.getSession();
      if (session) {
        const isValid = ServerValidation.validateSessionIntegrity(session.sessionId, session.userId);
        if (!isValid) {
          addViolation('Session compromise détectée');
        }
      }
      setSessionValidated(true);
    };

    validateSession();

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation('Clic droit détecté');
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        addViolation('Tentative d\'accès aux outils développeur');
      }
    };

    // Detect blur events (alt-tab, etc.)
    const handleBlur = () => {
      addViolation('Perte de focus détectée');
    };

    // Detect unusual mouse patterns
    let mouseEvents: { x: number; y: number; time: number }[] = [];
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mouseEvents.push({ x: e.clientX, y: e.clientY, time: now });
      
      // Keep only recent events
      mouseEvents = mouseEvents.filter(event => now - event.time < 1000);
      
      // Detect inhuman patterns (too precise/fast)
      if (mouseEvents.length > 10) {
        const speeds = mouseEvents.slice(1).map((event, i) => {
          const prev = mouseEvents[i];
          const distance = Math.sqrt((event.x - prev.x) ** 2 + (event.y - prev.y) ** 2);
          const timeDiff = event.time - prev.time;
          return distance / timeDiff;
        });
        
        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        if (avgSpeed > 5) { // Threshold for suspicious speed
          addViolation('Mouvement de souris suspect');
        }
      }
      
      setLastActivity(now);
    };

    // Detect copy/paste attempts
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('Tentative de copie détectée');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('Tentative de collage détectée');
    };

    // Check for DevTools
    const devtools = { open: false };
    const checkDevTools = () => {
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          addViolation('Outils développeur détectés');
        }
      } else {
        devtools.open = false;
      }
    };

    // Periodic session validation
    const validateSessionPeriodically = () => {
      const session = SessionManager.getSession();
      if (session) {
        const cheatingPatterns = ServerValidation.detectCheatingPatterns(session.userId);
        cheatingPatterns.forEach(pattern => addViolation(pattern));
      }
    };

    // Activity monitoring
    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > 300000) { // 5 minutes
        addViolation('Inactivité prolongée détectée');
      }
    };

    // Event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    // Intervals
    const devToolsInterval = setInterval(checkDevTools, 1000);
    const inactivityInterval = setInterval(checkInactivity, 60000);
    const sessionValidationInterval = setInterval(validateSessionPeriodically, 300000); // Every 5 minutes

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      clearInterval(devToolsInterval);
      clearInterval(inactivityInterval);
      clearInterval(sessionValidationInterval);
    };
  }, [lastActivity]);

  const addViolation = (reason: string) => {
    setViolations(prev => {
      const newCount = prev + 1;
      
      toast.warning(`⚠️ ${reason}`, {
        description: `Violation ${newCount}/5`
      });
      
      if (newCount >= 5) {
        setIsSecure(false);
        toast.error('Session terminée pour activité suspecte', {
          description: 'Trop de violations de sécurité détectées'
        });
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
      
      return newCount;
    });
  };

  return (
    <AntiCheatContext.Provider value={{ violations, isSecure }}>
      {sessionValidated && (
        isSecure ? children : (
          <div className="min-h-screen stellar-bg flex items-center justify-center">
            <div className="text-center text-red-400">
              <h1 className="text-4xl font-bold mb-4">⚠️ Session Terminée</h1>
              <p className="text-lg">Activité suspecte détectée</p>
              <p className="text-sm mt-2">Redirection en cours...</p>
            </div>
          </div>
        )
      )}
    </AntiCheatContext.Provider>
  );
};

export const useAntiCheat = () => useContext(AntiCheatContext);

export default AntiCheatProvider;
