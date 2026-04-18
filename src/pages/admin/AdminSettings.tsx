import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings,
  Bell,
  Mail,
  MessageCircle,
  Save,
  ReceiptText,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { getAdminNavItems } from '@/lib/adminNav';

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
    attendanceReminder: false,
    invoicePrefix: 'LIB-INV',
    admissionFee: 500,
    securityDeposit: 1000
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const navItems = getAdminNavItems('settings');

  return (
    <AdminLayout pageTitle="Settings" navItems={navItems} onLogout={handleLogout}>
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
                    <p className="font-medium">Library Policy Reminders</p>
                    <p className="text-sm text-slate-500">Send policy and renewal reminders</p>
                  </div>
                  <Switch 
                    checked={settings.attendanceReminder}
                    onCheckedChange={(v) => setSettings({...settings, attendanceReminder: v})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ReceiptText className="h-5 w-5" />
                  Billing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Invoice Prefix</Label>
                  <Input
                    value={settings.invoicePrefix}
                    onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Admission Fee</Label>
                  <Input
                    type="number"
                    value={settings.admissionFee}
                    onChange={(e) => setSettings({ ...settings, admissionFee: +e.target.value })}
                  />
                </div>
                <div>
                  <Label>Security Deposit</Label>
                  <Input
                    type="number"
                    value={settings.securityDeposit}
                    onChange={(e) => setSettings({ ...settings, securityDeposit: +e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Access & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Strict ID Verification</p>
                    <p className="text-sm text-slate-500">Require valid ID before approval</p>
                  </div>
                  <Switch checked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lock Manual Discounts</p>
                    <p className="text-sm text-slate-500">Only admin can apply billing discounts</p>
                  </div>
                  <Switch checked disabled />
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
    </AdminLayout>
  );
}
