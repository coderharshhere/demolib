import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentById, getAllSeats } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  CreditCard, 
  Armchair,
  Zap,
  Lightbulb,
  Wind,
  Lock,
  MapPin,
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import type { Student, Seat } from '@/types';

export default function MySeat() {
  const navigate = useNavigate();
  const { user, student: authStudent, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [seat, setSeat] = useState<Seat | null>(null);

  useEffect(() => {
    if (authStudent) {
      const updatedStudent = getStudentById(authStudent.id);
      if (updatedStudent) {
        setStudent(updatedStudent);
        
        if (updatedStudent.seatId) {
          const seats = getAllSeats();
          const assignedSeat = seats.find(s => s.id === updatedStudent.seatId);
          if (assignedSeat) {
            setSeat(assignedSeat);
          }
        }
      }
    }
  }, [authStudent]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('AC')) return <Zap className="h-5 w-5" />;
    if (feature.includes('Light')) return <Lightbulb className="h-5 w-5" />;
    if (feature.includes('Fan')) return <Wind className="h-5 w-5" />;
    if (feature.includes('Locker')) return <Lock className="h-5 w-5" />;
    if (feature.includes('Charging')) return <Zap className="h-5 w-5" />;
    return null;
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Armchair, label: 'My Seat', path: '/student/my-seat', active: true },
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
          <span className="font-bold">My Seat</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Seat</h1>
            <p className="text-slate-600">View your assigned library seat details.</p>
          </div>

          {!seat ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-amber-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">No Seat Assigned</h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  You don't have a seat assigned yet. Please wait for admin approval. 
                  Once approved, you will be assigned a seat and notified via email and WhatsApp.
                </p>
                <Button onClick={() => navigate('/student/dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Seat Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Armchair className="h-5 w-5" />
                    Seat Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-xl">
                    <p className="text-sm text-slate-500 mb-2">Your Seat Number</p>
                    <p className="text-6xl font-bold text-primary">{seat.seatNumber}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Seat Type</p>
                      <p className="font-medium capitalize">{seat.type}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Monthly Price</p>
                      <p className="font-medium">₹{seat.price}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500 mb-3">Seat Features</p>
                    <div className="grid grid-cols-2 gap-3">
                      {seat.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="text-primary">
                            {getFeatureIcon(feature)}
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">Library Location</p>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Main Library Hall</p>
                        <p className="text-sm text-slate-600">Row {seat.row}, Column {seat.column}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500 mb-2">Access Status</p>
                    <div className="flex items-center gap-3">
                      {student.status === 'active' && student.paymentStatus === 'paid' ? (
                        <>
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-700">Access Granted</p>
                            <p className="text-sm text-green-600">You can use the library</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-amber-100 p-2 rounded-full">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-amber-700">Access Pending</p>
                            <p className="text-sm text-amber-600">
                              {student.paymentStatus === 'pending' 
                                ? 'Complete payment to access' 
                                : 'Wait for admin approval'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {student.paymentStatus === 'pending' && (
                    <Button className="w-full" onClick={() => navigate('/student/payment')}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Payment
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Seat Layout Preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Seat Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Row {String.fromCharCode(64 + seat.row)}</div>
                      <div className="flex gap-2">
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((col) => (
                          <div
                            key={col}
                            className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-lg font-bold
                              ${col === seat.column 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white border-slate-200 text-slate-400'}`}
                          >
                            {String.fromCharCode(64 + seat.row)}{col}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-slate-500">Your seat is highlighted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
