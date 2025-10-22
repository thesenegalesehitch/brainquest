
import React, { useState } from 'react';
import { Edit, Trash2, Plus, UserPlus, Crown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/admin';

interface UserManagementProps {
  users: User[];
  onCreateUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (id: string, userData: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    level: 1,
    totalXP: 0,
    streak: 0,
    isAdmin: false
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    onCreateUser(formData);
    setFormData({ username: '', email: '', level: 1, totalXP: 0, streak: 0, isAdmin: false });
    setShowCreateModal(false);
  };

  const handleUpdate = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, formData);
      setEditingUser(null);
      setFormData({ username: '', email: '', level: 1, totalXP: 0, streak: 0, isAdmin: false });
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      level: user.level,
      totalXP: user.totalXP,
      streak: user.streak,
      isAdmin: user.isAdmin || false
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-cosmic-500 hover:bg-cosmic-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dark border-cosmic-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Créer un Utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-dark-100 border-cosmic-500/30"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-dark-100 border-cosmic-500/30"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="level" className="text-white">Niveau</Label>
                  <Input
                    id="level"
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="bg-dark-100 border-cosmic-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="totalXP" className="text-white">XP Total</Label>
                  <Input
                    id="totalXP"
                    type="number"
                    value={formData.totalXP}
                    onChange={(e) => setFormData({ ...formData, totalXP: parseInt(e.target.value) })}
                    className="bg-dark-100 border-cosmic-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="streak" className="text-white">Série</Label>
                  <Input
                    id="streak"
                    type="number"
                    value={formData.streak}
                    onChange={(e) => setFormData({ ...formData, streak: parseInt(e.target.value) })}
                    className="bg-dark-100 border-cosmic-500/30"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
                />
                <Label htmlFor="isAdmin" className="text-white">Administrateur</Label>
              </div>
              <Button onClick={handleCreate} className="w-full bg-cosmic-500 hover:bg-cosmic-600">
                Créer l'Utilisateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-dark-100 border-cosmic-500/30"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-dark-100/50 border-cosmic-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cosmic-500/20 rounded-full flex items-center justify-center">
                    <span className="text-cosmic-400 font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                      {user.isAdmin && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-cosmic-400">Niveau {user.level}</span>
                      <span className="text-stellar-400">{user.totalXP} XP</span>
                      <span className="text-muted-foreground">{user.streak} jours de série</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(user)}
                    className="text-cosmic-400 hover:text-cosmic-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-dark border-cosmic-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'Utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username" className="text-white">Nom d'utilisateur</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-dark-100 border-cosmic-500/30"
              />
            </div>
            <div>
              <Label htmlFor="edit-email" className="text-white">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-dark-100 border-cosmic-500/30"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-level" className="text-white">Niveau</Label>
                <Input
                  id="edit-level"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="bg-dark-100 border-cosmic-500/30"
                />
              </div>
              <div>
                <Label htmlFor="edit-totalXP" className="text-white">XP Total</Label>
                <Input
                  id="edit-totalXP"
                  type="number"
                  value={formData.totalXP}
                  onChange={(e) => setFormData({ ...formData, totalXP: parseInt(e.target.value) })}
                  className="bg-dark-100 border-cosmic-500/30"
                />
              </div>
              <div>
                <Label htmlFor="edit-streak" className="text-white">Série</Label>
                <Input
                  id="edit-streak"
                  type="number"
                  value={formData.streak}
                  onChange={(e) => setFormData({ ...formData, streak: parseInt(e.target.value) })}
                  className="bg-dark-100 border-cosmic-500/30"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
              />
              <Label htmlFor="edit-isAdmin" className="text-white">Administrateur</Label>
            </div>
            <Button onClick={handleUpdate} className="w-full bg-cosmic-500 hover:bg-cosmic-600">
              Mettre à Jour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
