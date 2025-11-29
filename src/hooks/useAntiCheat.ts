import { useContext } from 'react';
import { AntiCheatContext } from '@/components/security/AntiCheatProvider';

export const useAntiCheat = () => {
    const context = useContext(AntiCheatContext);
    if (!context) {
        throw new Error('useAntiCheat must be used within an AntiCheatProvider');
    }
    return context;
};
