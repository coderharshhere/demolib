import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSeats, releaseSeat } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  UserCheck, 
  Armchair,
  Calendar,
  Zap,
  Lightbulb,
  Wind,
  Lock
} from 'lucide-react';
import type { Seat } from '@/types';
import { toast } from 'sonner';

export default function SeatManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showSeatDialog, setShowSeatDialog] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setSeats(getAllSeats());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReleaseSeat = () => {
    if (selectedSeat) {
      releaseSeat(selectedSeat.id);
      toast.success(`Seat ${selectedSeat.seatNumber} released`);
      setShowSeatDialog(false);
      setSelectedSeat(null);
      loadData();
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'occupied':
        return 'bg-red-100 border-red-300 hover:bg-red-200';
      case 'reserved':
        return 'bg-amber-100 border-amber-300 hover:bg-amber-200';
      case 'maintenance':
        return 'bg-slate-100 border-slate-300 hover:bg-slate-200';
      default:
        return 'bg-slate-100';
    }
  };

  const getSeatIcon = (type: string) => {
    switch (type) {
      case 'cabin':
        return <Lock className="h-4 w-4" />;
      case 'double':
        return <Users className="h-4 w-4" />;
      default:
        return <Armchair className="h-4 w-4" />;
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('AC')) return <Zap className="h-3 w-3" />;
    if (feature.includes('Light')) return <Lightbulb className="h-3 w-3" />;
    if (feature.includes('Fan')) return <Wind className="h-3 w-3" />;
    if (feature.includes('Locker')) return <Lock className="h-3 w-3" />;
    return null;
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Armchair, label: 'Seats', path: '/admin/seats', active: true },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: UserCheck, label: 'Settings', path: '/admin/settings' },
  ];

  // Group seats by rows
  const seatsByRow: Record<number, Seat[]> = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) seatsByRow[seat.row] = [];
    seatsByRow[seat.row].push(seat);
  });

  const stats = {
    total: seats.length,
    available: seats.filter(s => s.status === 'available').length,
    occupied: seats.filter(s => s.status === 'occupied').length,
    reserved: seats.filter(s => s.status === 'reserved').length,
    maintenance: seats.filter(s => s.status === 'maintenance').length,
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
          <span className="font-bold">Seat Management</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Seat Management</h1>
            <p className="text-slate-600">View and manage all library seats.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">Reserved</p>
                <p className="text-2xl font-bold text-amber-600">{stats.reserved}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">Maintenance</p>
                <p className="text-2xl font-bold text-slate-600">{stats.maintenance}</p>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-100 border border-amber-300 rounded"></div>
              <span className="text-sm">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-100 border border-slate-300 rounded"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>

          {/* Seat Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Library Seat Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(seatsByRow).map(([rowNum, rowSeats]) => (
                  <div key={rowNum} className="flex items-center gap-2">
                    <span className="w-8 font-medium text-slate-500">
                      {String.fromCharCode(64 + parseInt(rowNum))}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {rowSeats.sort((a: Seat, b: Seat) => a.column - b.column).map((seat: Seat) => (
                        <button
                          key={seat.id}
                          className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-colors ${getSeatColor(seat.status)}`}
                          onClick={() => {
                            setSelectedSeat(seat);
                            setShowSeatDialog(true);
                          }}
                        >
                          {getSeatIcon(seat.type)}
                          <span className="text-xs font-medium">{seat.seatNumber}</span>
                          <div className="flex gap-0.5">
                            {seat.features.slice(0, 2).map((f: string, i: number) => (
                              <span key={i}>{getFeatureIcon(f)}</span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Seat Details Dialog */}
      <Dialog open={showSeatDialog} onOpenChange={setShowSeatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seat Details</DialogTitle>
            <DialogDescription>
              Seat {selectedSeat?.seatNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedSeat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Seat Number</p>
                  <p className="font-medium">{selectedSeat.seatNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-medium capitalize">{selectedSeat.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge 
                    variant={selectedSeat.status === 'available' ? 'default' : 
                            selectedSeat.status === 'occupied' ? 'destructive' : 
                            selectedSeat.status === 'reserved' ? 'secondary' : 'outline'}
                  >
                    {selectedSeat.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="font-medium">₹{selectedSeat.price}/month</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500">Features</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSeat.features.map((feature: string, i: number) => (
                    <Badge key={i} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
              
              {selectedSeat.studentName && (
                <div>
                  <p className="text-sm text-slate-500">Assigned To</p>
                  <p className="font-medium">{selectedSeat.studentName}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSeatDialog(false)}>
              Close
            </Button>
            {selectedSeat?.status === 'occupied' && (
              <Button variant="destructive" onClick={handleReleaseSeat}>
                Release Seat
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
