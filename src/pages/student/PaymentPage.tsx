import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentById, completePayment } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  CreditCard, 
  Armchair,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Download,
  Smartphone,
  Banknote,
  Loader2,
  BookOpen
} from 'lucide-react';
import type { Student } from '@/types';
import { toast } from 'sonner';
import { downloadReceiptPdf } from '@/lib/documentGenerators';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user, student: authStudent, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (authStudent) {
      const updatedStudent = getStudentById(authStudent.id);
      if (updatedStudent) {
        setStudent(updatedStudent);
      }
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

  const handlePayment = async () => {
    if (!student) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    completePayment(student.id, paymentMethod);
    
    setIsProcessing(false);
    setIsSuccess(true);
    toast.success('Payment completed successfully!');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Armchair, label: 'My Seat', path: '/student/my-seat' },
    { icon: CreditCard, label: 'Payment', path: '/student/payment', active: true },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-slate-600 mb-6">
                Your payment of ₹{student.paymentAmount} has been received. 
                You can now access the library with your assigned seat.
              </p>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate('/student/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/student/my-seat')}>
                  View My Seat
                </Button>
                <Button variant="outline" className="w-full" onClick={() => downloadReceiptPdf(student)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Professional Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
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
          <span className="font-bold">Payment</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
            <p className="text-slate-600">Complete your library seat payment.</p>
          </div>

          {student.paymentStatus === 'paid' ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Payment Already Completed</h2>
                <p className="text-slate-600 mb-6">
                  Your payment of ₹{student.paymentAmount} has been received. 
                  You have full access to the library.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate('/student/dashboard')}>
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/student/my-seat')}>
                    View My Seat
                  </Button>
                  <Button variant="outline" onClick={() => downloadReceiptPdf(student)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : student.status !== 'approved' && student.status !== 'active' ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-amber-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Payment Not Available</h2>
                <p className="text-slate-600 mb-6">
                  Please wait for admin approval before making payment. 
                  You will be notified via email and WhatsApp once approved.
                </p>
                <Button onClick={() => navigate('/student/dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-primary/5 rounded-xl text-center">
                    <p className="text-sm text-slate-500 mb-2">Total Amount</p>
                    <p className="text-5xl font-bold text-primary">₹{student.paymentAmount || 0}</p>
                    <p className="text-sm text-slate-500 mt-2">Monthly Subscription</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Student Name</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Seat Number</span>
                      <span className="font-medium">{student.seatNumber || 'Not Assigned'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Course</span>
                      <span className="font-medium">{student.course}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Select Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(v: 'online' | 'cash') => setPaymentMethod(v)}
                    className="space-y-4"
                  >
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-slate-200'
                    }`}>
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Smartphone className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Online Payment</p>
                            <p className="text-sm text-slate-500">Pay via UPI, Card, or Net Banking</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-slate-200'
                    }`}>
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Banknote className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Cash Payment</p>
                            <p className="text-sm text-slate-500">Pay cash at library counter</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-6">
                    {paymentMethod === 'online' ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay ₹{student.paymentAmount}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Banknote className="h-4 w-4 mr-2" />
                            Confirm Cash Payment
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Important Note</p>
                        <p className="text-sm text-amber-700">
                          {paymentMethod === 'online' 
                            ? 'You will receive a confirmation email and WhatsApp message after successful payment.'
                            : 'Please visit the library counter to complete your cash payment. Your seat will be activated after payment confirmation.'}
                        </p>
                      </div>
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
