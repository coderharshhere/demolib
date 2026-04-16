import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPayments } from '@/services/dataService';
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
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import type { Payment } from '@/types';

export default function Payments() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    onlinePayments: 0,
    cashPayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const allPayments = getAllPayments();
    setPayments(allPayments);
    
    const completed = allPayments.filter(p => p.status === 'completed');
    setStats({
      totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
      onlinePayments: completed.filter(p => p.method === 'online').reduce((sum, p) => sum + p.amount, 0),
      cashPayments: completed.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: allPayments.filter(p => p.status === 'pending').length
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredPayments = payments.filter(payment => 
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Armchair, label: 'Seats', path: '/admin/seats' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments', active: true },
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
        <header className="bg-white border-b p-4 md:hidden flex justify-between items-center">
          <span className="font-bold">Payments</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-600">View and manage all payment transactions.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
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
                    <p className="text-sm text-slate-600">Online Payments</p>
                    <p className="text-2xl font-bold">₹{stats.onlinePayments.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Cash Payments</p>
                    <p className="text-2xl font-bold">₹{stats.cashPayments.toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending</p>
                    <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by student name or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Method</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{payment.studentName}</td>
                          <td className="py-3 px-4 font-medium">₹{payment.amount}</td>
                          <td className="py-3 px-4">
                            <Badge variant={payment.method === 'online' ? 'default' : 'secondary'}>
                              {payment.method}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={payment.status === 'completed' ? 'default' : 
                                      payment.status === 'pending' ? 'secondary' : 'destructive'}
                              className={payment.status === 'completed' ? 'bg-green-500' : ''}
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">
                            {payment.transactionId || '-'}
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
