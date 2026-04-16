import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentById } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  CreditCard, 
  Armchair,
  Save,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Building
} from 'lucide-react';
import type { Student } from '@/types';
import { toast } from 'sonner';

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, student: authStudent, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    course: '',
    institute: ''
  });

  useEffect(() => {
    if (authStudent) {
      const updatedStudent = getStudentById(authStudent.id);
      if (updatedStudent) {
        setStudent(updatedStudent);
        setFormData({
          name: updatedStudent.name,
          phone: updatedStudent.phone,
          address: updatedStudent.address,
          course: updatedStudent.course,
          institute: updatedStudent.institute
        });
      }
    }
  }, [authStudent]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, this would update the student data
    toast.success('Profile updated successfully');
    setIsEditing(false);
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Armchair, label: 'My Seat', path: '/student/my-seat' },
    { icon: CreditCard, label: 'Payment', path: '/student/payment' },
    { icon: User, label: 'Profile', path: '/student/profile', active: true },
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
          <span className="font-bold">My Profile</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-600">View and manage your profile information.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-slate-500">{student.email}</p>
                <div className="mt-4">
                  {getStatusBadge(student.status)}
                </div>
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{student.course}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{student.institute}</span>
                  </div>
                  {student.seatNumber && (
                    <div className="flex items-center gap-3">
                      <Armchair className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">Seat {student.seatNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Course/Class</Label>
                        <Input
                          name="course"
                          value={formData.course}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Institute/College</Label>
                        <Input
                          name="institute"
                          value={formData.institute}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-slate-500">Full Name</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-slate-400" />
                          {student.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Email</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {student.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Phone Number</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {student.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Course/Class</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <GraduationCap className="h-4 w-4 text-slate-400" />
                          {student.course}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-slate-500">Institute/College</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <Building className="h-4 w-4 text-slate-400" />
                          {student.institute}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-slate-500">Address</Label>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {student.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">Library Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-500">Registration Date</Label>
                          <p className="font-medium">
                            {new Date(student.registrationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-slate-500">Status</Label>
                          <p className="mt-1">{getStatusBadge(student.status)}</p>
                        </div>
                        {student.seatNumber && (
                          <div>
                            <Label className="text-slate-500">Assigned Seat</Label>
                            <p className="font-medium">{student.seatNumber}</p>
                          </div>
                        )}
                        {student.paymentAmount && (
                          <div>
                            <Label className="text-slate-500">Payment Amount</Label>
                            <p className="font-medium">₹{student.paymentAmount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
