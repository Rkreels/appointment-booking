import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserRole } from '../hooks/useAuth';
import { Shield, UserPlus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'Alex Smith', email: 'alex@example.com', role: 'admin', status: 'active', lastLogin: '2026-02-17' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'manager', status: 'active', lastLogin: '2026-02-16' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', role: 'user', status: 'active', lastLogin: '2026-02-15' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'user', status: 'active', lastLogin: '2026-02-14' },
  { id: '5', name: 'David Kim', email: 'david@example.com', role: 'manager', status: 'active', lastLogin: '2026-02-13' },
  { id: '6', name: 'Rachel Green', email: 'rachel@example.com', role: 'user', status: 'inactive', lastLogin: '2026-02-10' },
  { id: '7', name: 'Tom Harris', email: 'tom@example.com', role: 'viewer', status: 'active', lastLogin: '2026-02-12' },
  { id: '8', name: 'Lisa Wang', email: 'lisa@example.com', role: 'user', status: 'active', lastLogin: '2026-02-11' },
  { id: '9', name: 'James Martinez', email: 'james@example.com', role: 'manager', status: 'active', lastLogin: '2026-02-09' },
  { id: '10', name: 'Olivia Taylor', email: 'olivia@example.com', role: 'user', status: 'active', lastLogin: '2026-02-08' },
  { id: '11', name: 'Chris Anderson', email: 'chris@example.com', role: 'viewer', status: 'active', lastLogin: '2026-02-07' },
  { id: '12', name: 'Nina Patel', email: 'nina@example.com', role: 'user', status: 'inactive', lastLogin: '2026-01-30' },
  { id: '13', name: 'Robert Lee', email: 'robert@example.com', role: 'user', status: 'active', lastLogin: '2026-02-06' },
  { id: '14', name: 'Sophie Turner', email: 'sophie@example.com', role: 'viewer', status: 'active', lastLogin: '2026-02-05' },
  { id: '15', name: 'Daniel White', email: 'daniel@example.com', role: 'manager', status: 'active', lastLogin: '2026-02-04' },
  { id: '16', name: 'Grace Nguyen', email: 'grace@example.com', role: 'user', status: 'active', lastLogin: '2026-02-03' },
  { id: '17', name: 'Kevin Brown', email: 'kevin@example.com', role: 'user', status: 'active', lastLogin: '2026-02-02' },
  { id: '18', name: 'Amanda Clark', email: 'amanda@example.com', role: 'viewer', status: 'inactive', lastLogin: '2026-01-25' },
  { id: '19', name: 'Brian Scott', email: 'brian@example.com', role: 'user', status: 'active', lastLogin: '2026-02-01' },
  { id: '20', name: 'Jessica Adams', email: 'jessica@example.com', role: 'manager', status: 'active', lastLogin: '2026-01-31' },
];

const AccessControl: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as UserRole });
  const [showAddUser, setShowAddUser] = useState(false);
  const { toast } = useToast();

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800', manager: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800', viewer: 'bg-gray-100 text-gray-800'
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = { id: Date.now().toString(), name: newUser.name, email: newUser.email, role: newUser.role, status: 'active', lastLogin: 'Never' };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddUser(false);
      toast({ title: "User Added", description: `${user.name} has been added successfully.` });
    }
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: "User Removed", description: `${user?.name} has been removed.`, variant: "destructive" });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const } : u
    ));
    const user = users.find(u => u.id === userId);
    toast({ title: "Status Updated", description: `${user?.name} is now ${user?.status === 'active' ? 'inactive' : 'active'}.` });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const user = users.find(u => u.id === userId);
    toast({ title: "Role Updated", description: `${user?.name}'s role changed to ${newRole}.` });
  };

  if (!hasPermission('manage_users')) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>You don't have permission to manage user access. Contact your administrator.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Access Control ({users.length} users)</span>
          </CardTitle>
          <Button onClick={() => setShowAddUser(!showAddUser)} className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" /><span>Add User</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddUser && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-semibold">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="viewer">Viewer</option><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddUser}>Save User</Button>
                <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Name</th>
                    <th className="border border-gray-300 p-3 text-left">Email</th>
                    <th className="border border-gray-300 p-3 text-left">Role</th>
                    <th className="border border-gray-300 p-3 text-left">Status</th>
                    <th className="border border-gray-300 p-3 text-left">Last Login</th>
                    <th className="border border-gray-300 p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">{user.name}</td>
                      <td className="border border-gray-300 p-3">{user.email}</td>
                      <td className="border border-gray-300 p-3">
                        <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)} className="p-1 border rounded text-sm">
                          <option value="viewer">Viewer</option><option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.status}
                          </Badge>
                          <Switch checked={user.status === 'active'} onCheckedChange={() => handleToggleStatus(user.id)} />
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3 text-sm text-gray-600">{user.lastLogin}</td>
                      <td className="border border-gray-300 p-3">
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Role Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['admin', 'manager', 'user', 'viewer'] as UserRole[]).map((role) => (
                <Card key={role}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="capitalize">{role}</span>
                      <Badge className={roleColors[role]}>{role}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    {role === 'admin' && (<><div>✓ Full access</div><div>✓ Manage users</div><div>✓ System settings</div><div>✓ Analytics</div></>)}
                    {role === 'manager' && (<><div>✓ Manage bookings</div><div>✓ View analytics</div><div>✓ Read/Write access</div><div>✗ System settings</div></>)}
                    {role === 'user' && (<><div>✓ Own bookings</div><div>✓ Read/Write access</div><div>✗ Manage others</div><div>✗ Analytics</div></>)}
                    {role === 'viewer' && (<><div>✓ Read access only</div><div>✗ Create/Edit</div><div>✗ Manage bookings</div><div>✗ Settings</div></>)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;
