import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, Plus, Download, Upload, Users, UserCheck, 
  UserX, Shield, Eye, Edit, Trash2, Activity, Lock, Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { useUserManager } from '@/hooks/useUserManager';
import ModernLoginPage from '@/components/auth/ModernLoginPage';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

export default function UsersPage() {
  const { user, isAuthenticated } = useApp();
  const { 
    users, 
    isLoading: loading, 
    error,
    updateUser,
    deleteUser: deleteUserAction,
  } = useUserManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [userToView, setUserToView] = useState<any>(null);

  // Only super_admin can access this page
  if (!isAuthenticated || !user) {
    return <ModernLoginPage />;
  }
  
  if (user?.role !== 'superadmin') {
    return (
      <ErrorBoundary>
        <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Akses Terbatas</h2>
            <p className="text-muted-foreground">Anda tidak memiliki akses ke halaman ini.</p>
          </div>
        </div>
      </MainLayout>
      </ErrorBoundary>
    );
  }

  // Mock data for roles and activities until API is connected
  const mockRoles = [
    { id: '1', name: 'User', description: 'Basic user', permissions: [], isDefault: true },
    { id: '2', name: 'Admin', description: 'Administrator', permissions: [], isDefault: false },
    { id: '3', name: 'Super Admin', description: 'Super Administrator', permissions: [], isDefault: false }
  ];
  const mockUserActivities = [];

  const filteredUsers = users.filter(userData => {
    const matchesSearch = 
      userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || userData.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || userData.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || userData.department === selectedDepartment;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const departments = Array.from(new Set(users.map(userData => userData.department)));

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-destructive text-destructive-foreground';
      case 'admin': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'suspended': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(userData => userData.status === 'active').length;
  const adminUsers = users.filter(userData => ['admin', 'superadmin'].includes(userData.role)).length;
  const recentActivities = mockUserActivities.slice(0, 10);

  return (
    <ErrorBoundary>
      <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manajemen User</h1>
            <p className="text-muted-foreground">Kelola user, role, dan permission sistem</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah User Baru</DialogTitle>
                  <DialogDescription>Buat akun user baru dengan role dan permission</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="user@telnet.co.id" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">No. Telepon</Label>
                      <Input id="phone" placeholder="+62..." />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept, index) => (
                            <SelectItem key={index} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Posisi</Label>
                      <Input id="position" placeholder="Jabatan/posisi" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password Sementara</Label>
                    <Input id="password" type="password" placeholder="Masukkan password sementara" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Batal</Button>
                  <Button>Buat User</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Users
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Semua user terdaftar</p>
            </CardContent>
          </Card>

          <Card className="bg-success/10 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">User aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-warning/10 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">Admin & super admin</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Activity className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Total department</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari berdasarkan nama, email, atau department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Semua Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Department</SelectItem>
              {departments.map((dept, index) => (
                <SelectItem key={index} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="activities">User Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar User</CardTitle>
                  <CardDescription>
                    Manajemen user dan informasi akun
                    {filteredUsers.length !== totalUsers && (
                      <span className="ml-2 text-primary">
                        ({filteredUsers.length} dari {totalUsers} user)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userData) => (
                        <TableRow key={userData.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {userData.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{userData.name}</p>
                                <p className="text-sm text-muted-foreground">{userData.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(userData.role)}>
                               {userData.role === 'superadmin' ? 'Super Admin' : 
                                userData.role === 'admin' ? 'Admin' : 'User'}
                            </Badge>
                          </TableCell>
                          <TableCell>{userData.department}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(userData.status)}>
                              {userData.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {userData.lastLogin ? userData.lastLogin.toLocaleString('id-ID') : 'Never'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => {
                                   setUserToView(userData);
                                   setViewDialogOpen(true);
                                 }}
                                 title="View user details"
                               >
                                 <Eye className="w-4 h-4" />
                               </Button>
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => {
                                   setUserToEdit(userData);
                                   setEditDialogOpen(true);
                                 }}
                                 title="Edit user"
                               >
                                 <Edit className="w-4 h-4" />
                               </Button>
                               {userData.status === 'active' ? (
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={async () => {
                                     const success = await updateUser(userData.id, { status: 'inactive' });
                                     if (success) {
                                       toast.success(`User ${userData.name} has been suspended`);
                                     }
                                   }}
                                   title="Suspend user"
                                 >
                                   <Lock className="w-4 h-4" />
                                 </Button>
                               ) : (
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={async () => {
                                     const success = await updateUser(userData.id, { status: 'active' });
                                     if (success) {
                                       toast.success(`User ${userData.name} has been activated`);
                                     }
                                   }}
                                   title="Activate user"
                                 >
                                   <Unlock className="w-4 h-4" />
                                 </Button>
                               )}
                               {userData.id !== user?.id && (
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => {
                                     setUserToDelete(userData);
                                     setDeleteDialogOpen(true);
                                   }}
                                   title="Delete user"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manajemen role dan permission sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {role.permissions.length} permissions
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {users.filter(u => u.role === role.name.toLowerCase().replace(' ', '_')).length}
                          </TableCell>
                          <TableCell>
                            {role.isDefault && <Badge variant="secondary">Default</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activities</CardTitle>
                  <CardDescription>Log aktivitas user dan audit trail</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.userName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {activity.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{activity.resource}</TableCell>
                          <TableCell className="max-w-md truncate">{activity.details}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {activity.timestamp.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {activity.ipAddress}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus User</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus user "{userToDelete?.name}"? 
                Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data yang terkait dengan user ini.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={async () => {
                  if (userToDelete) {
                    const success = await deleteUserAction(userToDelete.id);
                    if (success) {
                      toast.success(`User ${userToDelete.name} has been deleted`);
                    }
                  }
                  setDeleteDialogOpen(false);
                  setUserToDelete(null);
                }}
              >
                Hapus User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View User Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail User</DialogTitle>
              <DialogDescription>Informasi lengkap user</DialogDescription>
            </DialogHeader>
            {userToView && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nama Lengkap</label>
                    <p className="font-medium">{userToView.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{userToView.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p>{userToView.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(userToView.status)}>
                      {userToView.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p>{userToView.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p>{userToView.position}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p>{userToView.lastLogin ? userToView.lastLogin.toLocaleString('id-ID') : 'Never'}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setViewDialogOpen(false)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update informasi user</DialogDescription>
            </DialogHeader>
            {userToEdit && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nama Lengkap</Label>
                    <Input 
                      id="edit-name" 
                      defaultValue={userToEdit.name}
                      placeholder="Masukkan nama lengkap" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      defaultValue={userToEdit.email}
                      placeholder="user@telnet.co.id" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select defaultValue={userToEdit.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select defaultValue={userToEdit.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select defaultValue={userToEdit.department}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept, index) => (
                          <SelectItem key={index} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-position">Posisi</Label>
                    <Input 
                      id="edit-position" 
                      defaultValue={userToEdit.position}
                      placeholder="Jabatan/posisi" 
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={async () => {
                  // TODO: Implement actual form submission with form data
                  console.log('Update user:', userToEdit);
                  setEditDialogOpen(false);
                  setUserToEdit(null);
                }}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
    </ErrorBoundary>
  );
}