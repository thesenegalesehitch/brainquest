import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, Moon, Sun, Volume2, VolumeX, Smartphone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Preferences State
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            // Phone is not in user type yet, but we'll add the field for future use
            // setPhone(user.phone || ''); 
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            // Update profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    username,
                    // phone, // Add this when schema supports it
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: "Profil mis à jour",
                description: "Vos informations ont été enregistrées avec succès.",
            });
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast({
                title: "Erreur",
                description: error.message || "Impossible de mettre à jour le profil",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        // Here you would typically update a ThemeContext or document class
        toast({
            title: "Thème modifié",
            description: `Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé (Simulation)`,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-dark-100 border border-cosmic-500/30">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                        <Settings className="h-6 w-6 text-cosmic-400" />
                        Paramètres
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-dark-200/50">
                        <TabsTrigger value="profile" className="data-[state=active]:bg-cosmic-500/20">
                            Profil
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="data-[state=active]:bg-cosmic-500/20">
                            Préférences
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">Nom d'utilisateur</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 bg-dark-200/50 border-cosmic-500/30 focus:border-stellar-400 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="pl-10 bg-dark-200/50 border-cosmic-500/30 opacity-50 cursor-not-allowed text-white"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié pour le moment.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white">Téléphone</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+33 6 12 34 56 78"
                                    className="pl-10 bg-dark-200/50 border-cosmic-500/30 focus:border-stellar-400 text-white"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cosmic-500 to-stellar-500 hover:from-cosmic-600 hover:to-stellar-600"
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </TabsContent>

                    <TabsContent value="preferences" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-dark-200/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? <Moon className="h-5 w-5 text-stellar-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                                <div>
                                    <p className="font-medium text-white">Thème de l'interface</p>
                                    <p className="text-sm text-muted-foreground">Basculer entre mode sombre et clair</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={toggleTheme} className="border-cosmic-500/30 hover:bg-cosmic-500/10">
                                {theme === 'dark' ? 'Mode Sombre' : 'Mode Clair'}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-dark-200/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                {soundEnabled ? <Volume2 className="h-5 w-5 text-green-400" /> : <VolumeX className="h-5 w-5 text-red-400" />}
                                <div>
                                    <p className="font-medium text-white">Effets sonores</p>
                                    <p className="text-sm text-muted-foreground">Activer les sons en jeu</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="border-cosmic-500/30 hover:bg-cosmic-500/10"
                            >
                                {soundEnabled ? 'Activé' : 'Désactivé'}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
