import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Archive,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileBadge2,
  FileText,
  LayoutDashboard,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Smart Student Management',
    description: 'One-click approvals, profile tracking, and real-time status updates for every student.',
    accent: 'from-fuchsia-500/20 to-purple-500/20',
  },
  {
    icon: LayoutDashboard,
    title: 'Visual Seat Allocation',
    description: 'Interactive seat layout with instant occupancy view and quick assignment controls.',
    accent: 'from-sky-500/20 to-indigo-500/20',
  },
  {
    icon: CreditCard,
    title: 'Integrated Billing',
    description: 'Track online/cash payments, pending dues, and revenue insights from one dashboard.',
    accent: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: FileText,
    title: 'Detailed Student Records',
    description: 'Store complete student details including guardian, shift, ID proof, and complete profile history.',
    accent: 'from-cyan-500/20 to-sky-500/20',
  },
  {
    icon: Mail,
    title: 'Auto Notifications',
    description: 'Send timely reminders for approvals, payments, and attendance updates automatically.',
    accent: 'from-orange-500/20 to-rose-500/20',
  },
];

const highlights = [
  'Fast onboarding for new students',
  'Secure admin controls and approvals',
  'Insightful analytics for daily operations',
  'Designed for desktop and mobile experiences',
];

const steps = [
  { title: 'Student Registers', text: 'Students submit details and choose preferred seat options.' },
  { title: 'Admin Approves', text: 'Admin reviews requests and confirms seat allocation instantly.' },
  { title: 'Payment Completed', text: 'Students pay via online or cash with transparent records.' },
  { title: 'Library Access Active', text: 'Attendance starts, reminders are automated, and usage is tracked.' },
];

const modules = [
  {
    icon: LayoutDashboard,
    title: 'Admin Control Center',
    points: ['Dashboard analytics', 'Student approvals', 'Seat assignment', 'Attendance records'],
  },
  {
    icon: Users,
    title: 'Student Portal',
    points: ['Status tracking', 'Seat updates', 'Profile management', 'Latest notifications'],
  },
  {
    icon: ReceiptText,
    title: 'Billing & Receipts',
    points: ['Online/Cash payments', 'Receipt download', 'Payment history', 'Monthly fee tracking'],
  },
  {
    icon: Archive,
    title: 'Document Management',
    points: ['Full student profile view', 'Professional PDF export', 'Printable reports', 'Audit-ready details'],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <header className="relative border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 rounded-xl shadow-lg shadow-fuchsia-500/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">LibraryHub</p>
              <p className="text-xs text-slate-300">Professional Library Operations</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => navigate('/student/login')}
            >
              Student Login
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-5 bg-violet-500/20 text-violet-100 border-violet-300/30">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Next-gen Library Management
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Super Professional
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300">
                  Library Experience
                </span>
              </h1>
              <p className="mt-6 text-slate-300 text-lg max-w-xl">
                Manage registrations, seat allocation, attendance, and billing from a beautiful, fast, and powerful platform built for modern libraries.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                  onClick={() => navigate('/student/register')}
                >
                  Start Registration
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => navigate('/admin/login')}
                >
                  Open Admin Portal
                </Button>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300 mt-0.5" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-violet-950/40">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Live Operations Snapshot</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-300/40">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['1,240+', 'Students'],
                    ['98%', 'Seat Utilization'],
                    ['₹8.2L', 'Monthly Revenue'],
                    ['24/7', 'System Uptime'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-300 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-4 text-sm text-cyan-100 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5" />
                  Role-based admin and student login ensures secure and reliable daily operations.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features, Premium Feel</h2>
              <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
                Everything you need to run a high-performance library, presented in a colorful professional interface.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <CardContent className="p-6">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.accent} border border-white/10 flex items-center justify-center mb-4`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold">Everything Available In Your Library App</h2>
              <p className="text-slate-300 mt-3 max-w-3xl mx-auto">
                A complete system for modern libraries: student registration, approvals, seat management,
                attendance, payments, and downloadable professional documents for admins and students.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
              {modules.map((module) => (
                <Card key={module.title} className="border-white/10 bg-white/[0.04]">
                  <CardContent className="p-6">
                    <div className="h-11 w-11 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center mb-4">
                      <module.icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{module.title}</h3>
                    <div className="space-y-2.5">
                      {module.points.map((point) => (
                        <p key={point} className="text-sm text-slate-300 flex items-start gap-2">
                          <FileBadge2 className="h-4 w-4 mt-0.5 text-emerald-300" />
                          <span>{point}</span>
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="border-white/10 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15">
              <CardContent className="p-8 sm:p-10">
                <div className="flex items-center gap-2 mb-6 text-cyan-200">
                  <CalendarClock className="h-5 w-5" />
                  <span className="font-medium">How it works</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {steps.map((step, index) => (
                    <div key={step.title} className="rounded-xl border border-white/15 bg-slate-900/50 p-5">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold mb-3">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold mb-1.5">{step.title}</h3>
                      <p className="text-sm text-slate-300">{step.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center rounded-2xl border border-white/15 bg-white/[0.04] p-10">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to transform your library?</h2>
            <p className="text-slate-300 mt-3 mb-7">
              Join a smarter workflow for students and admins with a premium modern platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                onClick={() => navigate('/student/register')}
              >
                Create Student Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10"
                onClick={() => navigate('/admin/login')}
              >
                Admin Dashboard Login
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/90 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">LibraryHub</span>
          </div>
          <p className="text-sm">© 2026 LibraryHub. Designed for modern libraries.</p>
        </div>
      </footer>
    </div>
  );
}
