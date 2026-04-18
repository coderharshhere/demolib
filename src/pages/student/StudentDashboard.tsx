import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentById, getAllNotifications } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  CreditCard, 
  Armchair,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  IndianRupee,
  MapPin,
  BookOpen
} from 'lucide-react';
import type { Student, Notification } from '@/types';
import { downloadReceiptPdf } from '@/lib/documentGenerators';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, student: authStudent, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (authStudent) {
      const updatedStudent = getStudentById(authStudent.id);
      if (updatedStudent) {
        setStudent(updatedStudent);
      }
      
      const allNotifications = getAllNotifications();
      setNotifications(allNotifications.filter(n => n.userId === authStudent.id).slice(-5));
    }
    
    const interval = setInterval(() => {
      if (authStudent) {
        const updatedStudent = getStudentById(authStudent.id);
        if (updatedStudent) {
          setStudent(updatedStudent);
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [authStudent]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      active: 'default',
      pending: 'secondary',
      approved: 'outline',
      rejected: 'destructive',
      inactive: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', active: true },
    { icon: Armchair, label: 'My Seat', path: '/student/my-seat' },
    { icon: CreditCard, label: 'Payment', path: '/student/payment' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Student Portal</span>
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
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
          <span className="font-bold">Student Dashboard</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {student.name}!</h1>
            <p className="text-slate-600">Here's your library account overview.</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Registration Status</p>
                    <div className="mt-1">{getStatusBadge(student.status)}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Payment Status</p>
                    <div className="mt-1">
                      <Badge variant={student.paymentStatus === 'paid' ? 'default' : 'secondary'}
                             className={student.paymentStatus === 'paid' ? 'bg-green-500' : ''}>
                        {student.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <IndianRupee className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Assigned Seat</p>
                    <p className="text-2xl font-bold">
                      {student.seatNumber || 'Not Assigned'}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Armchair className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="font-medium">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Course</p>
                    <p className="font-medium">{student.course}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Institute</p>
                  <p className="font-medium">{student.institute}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {student.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Registration Date</p>
                  <p className="font-medium">
                    {new Date(student.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  className="w-full"
                  disabled={student.paymentStatus !== 'paid'}
                  onClick={() => downloadReceiptPdf(student)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Professional Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          {notification.type === 'email' ? (
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-full">
                              <Bell className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-slate-600">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {notification.sentAt && new Date(notification.sentAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {student.status === 'approved' && student.paymentStatus === 'pending' && (
                  <Button onClick={() => navigate('/student/payment')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Payment
                  </Button>
                )}
                {student.seatNumber && (
                  <Button variant="outline" onClick={() => navigate('/student/my-seat')}>
                    <Armchair className="h-4 w-4 mr-2" />
                    View My Seat
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/student/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {student.status === 'pending' && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Registration Pending</p>
                <p className="text-sm text-amber-700">
                  Your registration is under review. You will receive an email and WhatsApp notification once approved.
                </p>
              </div>
            </div>
          )}

          {student.status === 'rejected' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Registration Rejected</p>
                <p className="text-sm text-red-700">
                  Unfortunately, your registration has been rejected. Please contact the library administration for more information.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
