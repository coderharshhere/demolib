import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllStudents, 
  getAllSeats, 
  approveStudent, 
  rejectStudent,
  completePayment
} from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  UserCheck, 
  Armchair,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  IndianRupee,
  CheckCheck
} from 'lucide-react';
import type { Student, Seat } from '@/types';
import { toast } from 'sonner';

export default function StudentManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setStudents(getAllStudents());
    setSeats(getAllSeats());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApprove = () => {
    if (selectedStudent && selectedSeat) {
      approveStudent(selectedStudent.id, selectedSeat);
      toast.success(`Student ${selectedStudent.name} approved with seat ${seats.find(s => s.id === selectedSeat)?.seatNumber}`);
      setShowApproveDialog(false);
      setSelectedStudent(null);
      setSelectedSeat('');
      loadData();
    }
  };

  const handleReject = () => {
    if (selectedStudent) {
      rejectStudent(selectedStudent.id);
      toast.success(`Student ${selectedStudent.name} rejected`);
      setShowRejectDialog(false);
      setSelectedStudent(null);
      loadData();
    }
  };

  const handlePayment = () => {
    if (selectedStudent) {
      completePayment(selectedStudent.id, paymentMethod);
      toast.success(`Payment completed for ${selectedStudent.name}`);
      setShowPaymentDialog(false);
      setSelectedStudent(null);
      loadData();
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableSeats = seats.filter(s => s.status === 'available');

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students', active: true },
    { icon: Armchair, label: 'Seats', path: '/admin/seats' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: UserCheck, label: 'Settings', path: '/admin/settings' },
  ];

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
          <span className="font-bold">Student Management</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
            <p className="text-slate-600">Manage student registrations, approvals, and payments.</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Students ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Contact</th>
                      <th className="text-left py-3 px-4 font-medium">Course</th>
                      <th className="text-left py-3 px-4 font-medium">Seat</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Payment</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-slate-500">{student.institute}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm">{student.email}</p>
                            <p className="text-sm text-slate-500">{student.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{student.course}</td>
                        <td className="py-3 px-4">
                          {student.seatNumber ? (
                            <Badge variant="outline">{student.seatNumber}</Badge>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(student.status)}</td>
                        <td className="py-3 px-4">
                          {student.paymentStatus === 'paid' ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {student.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowApproveDialog(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {student.status === 'approved' && student.paymentStatus === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowPaymentDialog(true);
                                }}
                              >
                                <IndianRupee className="h-4 w-4 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Student</DialogTitle>
            <DialogDescription>
              Select a seat for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Seat</Label>
              <Select value={selectedSeat} onValueChange={setSelectedSeat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available seat" />
                </SelectTrigger>
                <SelectContent>
                  {availableSeats.map((seat) => (
                    <SelectItem key={seat.id} value={seat.id}>
                      {seat.seatNumber} - {seat.type} (₹{seat.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={!selectedSeat}>
              Approve & Assign Seat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedStudent?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Payment as Complete</DialogTitle>
            <DialogDescription>
              Record payment for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v: 'online' | 'cash') => setPaymentMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Amount to be paid:</p>
              <p className="text-2xl font-bold">₹{selectedStudent?.paymentAmount || 0}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent && !showApproveDialog && !showRejectDialog && !showPaymentDialog} 
              onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Name</Label>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Email</Label>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Phone</Label>
                  <p className="font-medium">{selectedStudent.phone}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Course</Label>
                  <p className="font-medium">{selectedStudent.course}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Institute</Label>
                  <p className="font-medium">{selectedStudent.institute}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Status</Label>
                  <p>{getStatusBadge(selectedStudent.status)}</p>
                </div>
                {selectedStudent.seatNumber && (
                  <div>
                    <Label className="text-slate-500">Seat Number</Label>
                    <p className="font-medium">{selectedStudent.seatNumber}</p>
                  </div>
                )}
                {selectedStudent.paymentAmount && (
                  <div>
                    <Label className="text-slate-500">Payment Amount</Label>
                    <p className="font-medium">₹{selectedStudent.paymentAmount}</p>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-slate-500">Address</Label>
                <p className="font-medium">{selectedStudent.address}</p>
              </div>
              <div>
                <Label className="text-slate-500">Registration Date</Label>
                <p className="font-medium">
                  {new Date(selectedStudent.registrationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
