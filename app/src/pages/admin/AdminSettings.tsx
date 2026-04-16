import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  LogOut, 
  UserCheck, 
  Armchair,
  Calendar,
  Settings,
  Bell,
  Mail,
  MessageCircle,
  Save
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [settings, setSettings] = useState({
    libraryName: 'LibraryHub',
    emailNotifications: true,
    whatsappNotifications: true,
    smsNotifications: false,
    autoApprove: false,
    paymentReminder: true,
    attendanceReminder: true
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Armchair, label: 'Seats', path: '/admin/seats' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: UserCheck, label: 'Settings', path: '/admin/settings', active: true },
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
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserCheck className="h-4 w-4 text-primary" />
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
          <span className="font-bold">Settings</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Configure your library management system.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Library Name</Label>
                  <Input 
                    value={settings.libraryName}
                    onChange={(e) => setSettings({...settings, libraryName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Admin Email</Label>
                  <Input value={user?.email} disabled />
                </div>
                <div>
                  <Label>Admin Phone</Label>
                  <Input value={user?.phone} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(v) => setSettings({...settings, emailNotifications: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-slate-500" />
                    <span>WhatsApp Notifications</span>
                  </div>
                  <Switch 
                    checked={settings.whatsappNotifications}
                    onCheckedChange={(v) => setSettings({...settings, whatsappNotifications: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-500" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch 
                    checked={settings.smsNotifications}
                    onCheckedChange={(v) => setSettings({...settings, smsNotifications: v})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Automation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Approve Students</p>
                    <p className="text-sm text-slate-500">Automatically approve new registrations</p>
                  </div>
                  <Switch 
                    checked={settings.autoApprove}
                    onCheckedChange={(v) => setSettings({...settings, autoApprove: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Reminders</p>
                    <p className="text-sm text-slate-500">Send reminders for pending payments</p>
                  </div>
                  <Switch 
                    checked={settings.paymentReminder}
                    onCheckedChange={(v) => setSettings({...settings, paymentReminder: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Attendance Reminders</p>
                    <p className="text-sm text-slate-500">Notify students about their attendance</p>
                  </div>
                  <Switch 
                    checked={settings.attendanceReminder}
                    onCheckedChange={(v) => setSettings({...settings, attendanceReminder: v})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
              <CardContent className="p-6">
                <Button className="w-full" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
