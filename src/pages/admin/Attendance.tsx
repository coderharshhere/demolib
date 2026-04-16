import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllAttendance, getActiveStudents, markAttendance } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  UserCheck, 
  Armchair,
  Search,
  Calendar,
  LogIn,
  CheckCircle
} from 'lucide-react';
import type { Attendance, Student } from '@/types';
import { toast } from 'sonner';

export default function AttendancePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [todayStats, setTodayStats] = useState({ present: 0, currentlyIn: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allAttendance = getAllAttendance();
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = allAttendance.filter(a => a.date === today);
    
    setAttendance(todayAttendance);
    setActiveStudents(getActiveStudents());
    
    setTodayStats({
      present: todayAttendance.length,
      currentlyIn: todayAttendance.filter(a => !a.exitTime).length
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkEntry = (student: Student) => {
    if (student.seatNumber) {
      markAttendance(student.id, student.name, student.seatNumber);
      toast.success(`Entry marked for ${student.name}`);
      loadData();
    }
  };

  const filteredAttendance = attendance.filter(a => 
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.seatNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Armchair, label: 'Seats', path: '/admin/seats' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance', active: true },
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
        <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
          <span className="font-bold">Attendance</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
            <p className="text-slate-600">Track student library attendance.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Today's Present</p>
                    <p className="text-2xl font-bold">{todayStats.present}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Currently In</p>
                    <p className="text-2xl font-bold">{todayStats.currentlyIn}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <LogIn className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Students</p>
                    <p className="text-2xl font-bold">{activeStudents.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Entry */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeStudents.slice(0, 10).map((student) => (
                  <Button
                    key={student.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkEntry(student)}
                    disabled={attendance.some(a => a.studentId === student.id && !a.exitTime)}
                  >
                    <LogIn className="h-3 w-3 mr-1" />
                    {student.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by student name or seat number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance ({filteredAttendance.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-medium">Seat</th>
                      <th className="text-left py-3 px-4 font-medium">Entry Time</th>
                      <th className="text-left py-3 px-4 font-medium">Exit Time</th>
                      <th className="text-left py-3 px-4 font-medium">Duration</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No attendance records for today
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{record.studentName}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{record.seatNumber}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(record.entryTime).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4">
                            {record.exitTime ? new Date(record.exitTime).toLocaleTimeString() : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {record.exitTime ? (
                              (() => {
                                const entry = new Date(record.entryTime).getTime();
                                const exit = new Date(record.exitTime).getTime();
                                const hours = Math.round((exit - entry) / (1000 * 60 * 60) * 10) / 10;
                                return `${hours} hrs`;
                              })()
                            ) : (
                              (() => {
                                const entry = new Date(record.entryTime).getTime();
                                const now = Date.now();
                                const hours = Math.round((now - entry) / (1000 * 60 * 60) * 10) / 10;
                                return `${hours} hrs`;
                              })()
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={record.exitTime ? 'secondary' : 'default'}>
                              {record.exitTime ? 'Left' : 'In Library'}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
