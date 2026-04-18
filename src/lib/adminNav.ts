import { LayoutDashboard, Users, Armchair, CreditCard, UserCheck } from 'lucide-react';

export type AdminTabKey = 'dashboard' | 'students' | 'seats' | 'payments' | 'settings';

export const getAdminNavItems = (active: AdminTabKey) => [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: active === 'dashboard' },
  { icon: Users, label: 'Students', path: '/admin/students', active: active === 'students' },
  { icon: Armchair, label: 'Seats', path: '/admin/seats', active: active === 'seats' },
  { icon: CreditCard, label: 'Payments', path: '/admin/payments', active: active === 'payments' },
  { icon: UserCheck, label: 'Settings', path: '/admin/settings', active: active === 'settings' },
];
