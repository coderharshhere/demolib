import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAllAttendance,
  getAllPayments,
  getAllSeats,
  getAllStudents,
  getLibraryConfig,
  getLibraryStats,
  getPendingStudents,
  updateLibraryConfig,
  updateSeatPricesByType,
} from '@/services/dataService';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Armchair,
  Calendar,
  CalendarCheck,
  CheckCircle,
  Clock,
  CreditCard,
  IndianRupee,
  LayoutDashboard,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import type { LibraryConfig, LibraryStats, Seat, Student } from '@/types';

const defaultConfig: LibraryConfig = {
  libraryName: 'LibraryHub',
  openTime: '07:00',
  closeTime: '22:00',
  monthlyFee: 1000,
  lateFeePerHour: 20,
  enableOnlinePayment: true,
  enableAttendanceTracking: true,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<LibraryConfig>(defaultConfig);
  const [seatPrices, setSeatPrices] = useState<Record<Seat['type'], number>>({
    single: 0,
    double: 0,
    cabin: 0,
  });
  const [todayAttendanceCount, setTodayAttendanceCount] = useState(0);
  const [todayPaymentCount, setTodayPaymentCount] = useState(0);

  const loadData = () => {
    setStats(getLibraryStats());
    setPendingStudents(getPendingStudents().slice(0, 5));

    const allStudents = getAllStudents();
    setRecentStudents(allStudents.slice(-5).reverse());

    setConfig(getLibraryConfig());

    const seats = getAllSeats();
    setSeatPrices({
      single: seats.find((s) => s.type === 'single')?.price ?? 0,
      double: seats.find((s) => s.type === 'double')?.price ?? 0,
      cabin: seats.find((s) => s.type === 'cabin')?.price ?? 0,
    });

    const today = new Date().toISOString().split('T')[0];
    const todayPayments = getAllPayments().filter((p) => p.date.startsWith(today));
    const todayAttendance = getAllAttendance().filter((a) => a.date === today);
    setTodayPaymentCount(todayPayments.length);
    setTodayAttendanceCount(todayAttendance.length);
  };

  useEffect(() => {
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

  const quickActions = useMemo(
    () => [
      {
        title: 'Student Management',
        subtitle: 'Approvals, profiles, status',
        path: '/admin/students',
        icon: Users,
      },
      {
        title: 'Seat Management',
        subtitle: 'Seat layout and assignment',
        path: '/admin/seats',
        icon: Armchair,
      },
      {
        title: 'Payment Management',
        subtitle: 'Revenue and due tracking',
        path: '/admin/payments',
        icon: CreditCard,
      },
      {
        title: 'Attendance',
        subtitle: 'Daily presence monitoring',
        path: '/admin/attendance',
        icon: CalendarCheck,
      },
      {
        title: 'System Settings',
        subtitle: 'Notifications and controls',
        path: '/admin/settings',
        icon: Settings,
      },
    ],
    []
  );

  const handleSeatPriceSave = () => {
    if (seatPrices.single <= 0 || seatPrices.double <= 0 || seatPrices.cabin <= 0) {
      toast.error('Please enter valid seat pricing values.');
      return;
    }

    updateSeatPricesByType(seatPrices);
    toast.success('Seat pricing updated from dashboard successfully.');
    loadData();
  };

  const handleConfigSave = () => {
    if (config.monthlyFee <= 0 || config.lateFeePerHour < 0) {
      toast.error('Please enter valid monthly/late fee values.');
      return;
    }

    updateLibraryConfig(config);
    toast.success('Library settings saved successfully.');
    loadData();
  };

  return (
    <AdminLayout pageTitle="Admin Dashboard" navItems={navItems} onLogout={handleLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Detailed Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Library ke saare major controls ab yahin se: students, seats, pricing, payments, attendance, and settings.
        </p>
      </div>

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeStudents}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingApprovals}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Available Seats</p>
              <p className="text-2xl font-bold text-blue-600">{stats.availableSeats}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Today&apos;s Revenue</p>
              <p className="text-2xl font-bold">₹{stats.todayRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Monthly Revenue</p>
              <p className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              All Library Modules
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="rounded-lg border p-4 text-left transition-colors hover:bg-slate-50"
              >
                <item.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Today&apos;s Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Attendance Entries</span>
              <span className="font-semibold">{todayAttendanceCount}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Payments Recorded</span>
              <span className="font-semibold">{todayPaymentCount}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-sm text-slate-600">Occupancy Rate</span>
              <span className="font-semibold">
                {stats && stats.totalSeats > 0 ? Math.round((stats.occupiedSeats / stats.totalSeats) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              Seat Pricing Control (From Dashboard)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Single Seat Price</Label>
                <Input
                  type="number"
                  min={1}
                  value={seatPrices.single}
                  onChange={(e) =>
                    setSeatPrices((prev) => ({
                      ...prev,
                      single: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Double Seat Price</Label>
                <Input
                  type="number"
                  min={1}
                  value={seatPrices.double}
                  onChange={(e) =>
                    setSeatPrices((prev) => ({
                      ...prev,
                      double: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Cabin Seat Price</Label>
                <Input
                  type="number"
                  min={1}
                  value={seatPrices.cabin}
                  onChange={(e) =>
                    setSeatPrices((prev) => ({
                      ...prev,
                      cabin: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={handleSeatPriceSave}>Update All Seat Prices</Button>
            <p className="text-xs text-slate-500">
              Ye update karte hi approved students ke naye allocations me updated price apply hoga.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-slate-700" />
              Library Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Library Name</Label>
              <Input
                value={config.libraryName}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    libraryName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Open Time</Label>
                <Input
                  type="time"
                  value={config.openTime}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      openTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Close Time</Label>
                <Input
                  type="time"
                  value={config.closeTime}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      closeTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Fee</Label>
                <Input
                  type="number"
                  min={1}
                  value={config.monthlyFee}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      monthlyFee: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Late Fee / Hour</Label>
                <Input
                  type="number"
                  min={0}
                  value={config.lateFeePerHour}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      lateFeePerHour: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Enable Online Payments</p>
                <p className="text-xs text-slate-500">UPI / online flow on payment workflows</p>
              </div>
              <Switch
                checked={config.enableOnlinePayment}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    enableOnlinePayment: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Enable Attendance Tracking</p>
                <p className="text-xs text-slate-500">Mark in/out entry for active students</p>
              </div>
              <Switch
                checked={config.enableAttendanceTracking}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    enableAttendanceTracking: checked,
                  }))
                }
              />
            </div>

            <Button onClick={handleConfigSave}>Save Library Controls</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Approvals
            </CardTitle>
            <Badge variant="secondary">{pendingStudents.length}</Badge>
          </CardHeader>
          <CardContent>
            {pendingStudents.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingStudents.map((student) => (
                  <div
                    key={student.id}
                    className="cursor-pointer rounded-lg bg-slate-50 p-3 hover:bg-slate-100"
                    onClick={() => navigate('/admin/students')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.course}</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate('/admin/students')}
            >
              View All Students
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStudents.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.email}</p>
                  </div>
                  <Badge
                    variant={
                      student.status === 'active'
                        ? 'default'
                        : student.status === 'pending'
                          ? 'secondary'
                          : student.status === 'approved'
                            ? 'outline'
                            : 'destructive'
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => navigate('/admin/students')}
            >
              View All
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
