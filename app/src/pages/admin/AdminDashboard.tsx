import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLibraryStats, getPendingStudents, getAllStudents } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  UserCheck, 
  Armchair,
  IndianRupee,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { LibraryStats, Student } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadData = () => {
      setStats(getLibraryStats());
      setPendingStudents(getPendingStudents().slice(0, 5));
      const allStudents = getAllStudents();
      setRecentStudents(allStudents.slice(-5).reverse());
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: true },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Armchair, label: 'Seats', path: '/admin/seats' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: UserCheck, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  variant={item.active ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
          <span className="font-bold">Admin Dashboard</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's what's happening in your library.</p>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Students</p>
                      <p className="text-3xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Active Students</p>
                      <p className="text-3xl font-bold">{stats.activeStudents}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Available Seats</p>
                      <p className="text-3xl font-bold">{stats.availableSeats}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Armchair className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Today's Revenue</p>
                      <p className="text-3xl font-bold">₹{stats.todayRevenue}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <IndianRupee className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Pending Approvals
                </CardTitle>
                <Badge variant="secondary">{pendingStudents.length}</Badge>
              </CardHeader>
              <CardContent>
                {pendingStudents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingStudents.map((student) => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                        onClick={() => navigate('/admin/students')}
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-slate-500">{student.course}</p>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate('/admin/students')}
                >
                  View All Students
                </Button>
              </CardContent>
            </Card>

            {/* Recent Registrations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Recent Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentStudents.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.email}</p>
                      </div>
                      <Badge 
                        variant={student.status === 'active' ? 'default' : 
                                student.status === 'pending' ? 'secondary' : 
                                student.status === 'approved' ? 'outline' : 'destructive'}
                      >
                        {student.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate('/admin/students')}
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-slate-600 mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-slate-600 mb-1">Total Seats</p>
                  <p className="text-2xl font-bold">{stats.totalSeats}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-slate-600 mb-1">Occupancy Rate</p>
                  <p className="text-2xl font-bold">
                    {stats.totalSeats > 0 ? Math.round((stats.occupiedSeats / stats.totalSeats) * 100) : 0}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
