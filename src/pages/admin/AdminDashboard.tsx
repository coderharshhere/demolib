import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import {
  Wallet,
  Armchair,
  CreditCard,
  UserRoundCheck,
} from 'lucide-react';

import { toast } from 'sonner';
import type { LibraryConfig, LibraryStats, Seat, Student } from '@/types';
import { getAdminNavItems } from '@/lib/adminNav';

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

  const [, setStats] = useState<LibraryStats | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<LibraryConfig>(defaultConfig);
  const [seatPrices, setSeatPrices] = useState<Record<Seat['type'], number>>({
    single: 0,
    double: 0,
    cabin: 0,
  });

  const [todayPaymentCount, setTodayPaymentCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [occupiedSeats, setOccupiedSeats] = useState(0);

  const loadData = () => {
    setStats(getLibraryStats());
    setPendingStudents(getPendingStudents().slice(0, 5));

    const allStudents = getAllStudents();
    setRecentStudents(allStudents.slice(-5).reverse());

    const settings = getLibraryConfig();
    setConfig(settings);

    const seats = getAllSeats();
    setSeatPrices({
      single: seats.find(s => s.type === 'single')?.price ?? 0,
      double: seats.find(s => s.type === 'double')?.price ?? 0,
      cabin: seats.find(s => s.type === 'cabin')?.price ?? 0,
    });

    const today = new Date().toISOString().split('T')[0];
    const todaysPayments = getAllPayments().filter(p => p.date.startsWith(today) && p.status === 'completed');
    setTodayPaymentCount(todaysPayments.length);
    setTodayRevenue(todaysPayments.reduce((sum, p) => sum + p.amount, 0));
    setOccupiedSeats(getAllSeats().filter((seat) => seat.status === 'occupied').length);
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

  const handleSeatPriceSave = () => {
    updateSeatPricesByType(seatPrices);
    toast.success('Seat prices updated successfully');
  };

  const handleConfigSave = () => {
    updateLibraryConfig(config);
    toast.success('Library configuration updated successfully');
  };

  const navItems = getAdminNavItems('dashboard');

  return (
    <AdminLayout pageTitle="Admin Dashboard" navItems={navItems} onLogout={handleLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening in your library.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Today's Revenue</p>
            <p className="text-2xl font-bold mt-1">₹{todayRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2 text-emerald-600 text-xs">
              <Wallet className="h-4 w-4" />
              Received today
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Today's Payments</p>
            <p className="text-2xl font-bold mt-1">{todayPaymentCount}</p>
            <div className="flex items-center gap-2 mt-2 text-sky-600 text-xs">
              <CreditCard className="h-4 w-4" />
              Completed transactions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Occupied Seats</p>
            <p className="text-2xl font-bold mt-1">{occupiedSeats}</p>
            <div className="flex items-center gap-2 mt-2 text-violet-600 text-xs">
              <Armchair className="h-4 w-4" />
              Live seat usage
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Pending Approvals</p>
            <p className="text-2xl font-bold mt-1">{pendingStudents.length}</p>
            <div className="flex items-center gap-2 mt-2 text-amber-600 text-xs">
              <UserRoundCheck className="h-4 w-4" />
              Awaiting review
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Seat Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Single</Label>
            <Input type="number" value={seatPrices.single} onChange={(e) => setSeatPrices(p => ({ ...p, single: +e.target.value }))} />

            <Label>Double</Label>
            <Input type="number" value={seatPrices.double} onChange={(e) => setSeatPrices(p => ({ ...p, double: +e.target.value }))} />

            <Label>Cabin</Label>
            <Input type="number" value={seatPrices.cabin} onChange={(e) => setSeatPrices(p => ({ ...p, cabin: +e.target.value }))} />

            <Button onClick={handleSeatPriceSave}>Save</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Library Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Name</Label>
            <Input value={config.libraryName} onChange={(e) => setConfig(p => ({ ...p, libraryName: e.target.value }))} />

            <Label>Monthly Fee</Label>
            <Input type="number" value={config.monthlyFee} onChange={(e) => setConfig(p => ({ ...p, monthlyFee: +e.target.value }))} />

            <Switch checked={config.enableOnlinePayment} onCheckedChange={(v) => setConfig(p => ({ ...p, enableOnlinePayment: v }))} />

            <Button onClick={handleConfigSave}>Save</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Students</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingStudents.map(s => (
              <div key={s.id}>{s.name}</div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            {recentStudents.map(s => (
              <div key={s.id}>{s.name}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
