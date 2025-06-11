
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserRole } from '../hooks/useAuth';
import { Shield, UserPlus, Trash2, Edit3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const AccessControl: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Smith',
      email: 'alex@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-01-10'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as UserRole
  });

  const [showAddUser, setShowAddUser] = useState(false);

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800'
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        lastLogin: 'Never'
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  if (!hasPermission('manage_users')) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage user access. Contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Access Control</span>
          </CardTitle>
          <Button 
            onClick={() => setShowAddUser(!showAddUser)}
            data-action="add-user"
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddUser && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
              <h3 className="font-semibold">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserName">Name</Label>
                  <Input
                    id="newUserName"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter full name"
                    data-action="edit-new-user-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Email</Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                    data-action="edit-new-user-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newUserRole">Role</Label>
                  <select
                    id="newUserRole"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-action="select-new-user-role"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddUser} data-action="save-new-user">
                  Save User
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddUser(false)}
                  data-action="cancel-add-user"
                >
                  Cancel
                </Button>
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
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="p-1 border rounded text-sm"
                          data-action={`change-role-${user.id}`}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {user.status}
                          </Badge>
                          <Switch
                            checked={user.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(user.id)}
                            data-action={`toggle-status-${user.id}`}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3 text-sm text-gray-600">
                        {user.lastLogin}
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            data-action={`delete-user-${user.id}`}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                    {role === 'admin' && (
                      <>
                        <div>✓ Full access</div>
                        <div>✓ Manage users</div>
                        <div>✓ System settings</div>
                        <div>✓ Analytics</div>
                      </>
                    )}
                    {role === 'manager' && (
                      <>
                        <div>✓ Manage bookings</div>
                        <div>✓ View analytics</div>
                        <div>✓ Read/Write access</div>
                        <div>✗ System settings</div>
                      </>
                    )}
                    {role === 'user' && (
                      <>
                        <div>✓ Own bookings</div>
                        <div>✓ Read/Write access</div>
                        <div>✗ Manage others</div>
                        <div>✗ Analytics</div>
                      </>
                    )}
                    {role === 'viewer' && (
                      <>
                        <div>✓ Read access only</div>
                        <div>✗ Create/Edit</div>
                        <div>✗ Manage bookings</div>
                        <div>✗ Settings</div>
                      </>
                    )}
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
