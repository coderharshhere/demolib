import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Coffee,
  CreditCard,
  LayoutDashboard,
  Mail,
  MapPin,
  Monitor,
  ShieldCheck,
  Sparkles,
  Wifi,
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
    icon: Mail,
    title: 'Auto Notifications',
    description: 'Send timely reminders for approvals, payments, and attendance updates automatically.',
    accent: 'from-orange-500/20 to-rose-500/20',
  },
];

const highlights = [
  'AC + Non-AC dedicated study zones',
  'Silent library with strict discipline monitoring',
  'Online + cash payment flexibility',
  'Attendance, seat and billing all-in-one system',
];

const facilities = [
  { icon: Wifi, name: 'High-Speed Wi-Fi', detail: 'Stable broadband for online classes, tests and research work.' },
  { icon: Monitor, name: 'Digital Admin System', detail: 'Student approvals, seat control, attendance and payments tracked digitally.' },
  { icon: Coffee, name: 'Refreshment Zone', detail: 'Water and quick refreshment area for long study hours.' },
  { icon: ShieldCheck, name: 'Secure Premises', detail: 'Safe campus access with monitored entry and role-based controls.' },
  { icon: Clock3, name: 'Flexible Timings', detail: 'Morning to late evening shifts with full-day options available.' },
  { icon: MapPin, name: 'Prime Location', detail: 'Easy to reach location with student-friendly environment.' },
];

const seatPlans = [
  { plan: 'Single Seat', price: '₹800 / month', points: ['Personal space', 'Charging point', 'Fan zone'] },
  { plan: 'Double Seat', price: '₹1200 / month', points: ['Shared wide table', 'Charging point', 'AC/airflow section'] },
  { plan: 'Cabin Seat', price: '₹1500 / month', points: ['Premium private desk', 'AC + locker', 'Focused quiet area'] },
];

const steps = [
  { title: 'Register', text: 'Student complete details + photo + ID proof upload karta hai.' },
  { title: 'Verification', text: 'Admin profile review karta hai aur suitable seat assign karta hai.' },
  { title: 'Payment', text: 'Student online/cash payment complete karta hai.' },
  { title: 'Start Study', text: 'Seat activate ho jati hai aur attendance tracking start hoti hai.' },
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
                Modern & Professional Study Ecosystem
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Library ke bare me
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300">
                  sab kuch ek hi jagah
                </span>
              </h1>
              <p className="mt-6 text-slate-300 text-lg max-w-xl">
                LibraryHub ek complete digital library solution hai jahan registration se lekar seat allotment, payment, attendance,
                reminder notifications aur admin control sab integrated hai.
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
                  <h3 className="text-xl font-semibold">Library Overview</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-300/40">Open</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['10+ Hours', 'Daily Study Time'],
                    ['80+ Seats', 'Planned Capacity'],
                    ['4 Shifts', 'Morning to Full Day'],
                    ['100%', 'Digital Management'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-300 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-4 text-sm text-cyan-100 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5" />
                  Admin aur student dono ke liye secure role-based access aur transparent workflow.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold">Library ki Core Digital Suvidha</h2>
              <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
                Student management, seat control, payment handling aur smart communication - sab ek integrated panel me.
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
              <h2 className="text-3xl sm:text-4xl font-bold">Physical Facilities & Environment</h2>
              <p className="text-slate-300 mt-3 max-w-2xl mx-auto">
                Library me available practical suvidha jo regular students ko daily focused study me help karti hai.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((item) => (
                <Card key={item.name} className="border-white/10 bg-white/[0.04]">
                  <CardContent className="p-6">
                    <item.icon className="h-6 w-6 text-cyan-300 mb-3" />
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-300 mt-1">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold">Seat Plans & Pricing</h2>
              <p className="text-slate-300 mt-3">Different budget and comfort needs ke liye clear pricing structure.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {seatPlans.map((plan) => (
                <Card key={plan.plan} className="border-white/10 bg-white/[0.04]">
                  <CardContent className="p-6">
                    <p className="text-sm text-violet-300 font-semibold">{plan.plan}</p>
                    <p className="text-3xl font-bold my-2">{plan.price}</p>
                    <ul className="space-y-2">
                      {plan.points.map((point) => (
                        <li key={point} className="text-sm text-slate-300 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          {point}
                        </li>
                      ))}
                    </ul>
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
                  <span className="font-medium">Admission & Access Process</span>
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
            <h2 className="text-3xl sm:text-4xl font-bold">Join LibraryHub Today</h2>
            <p className="text-slate-300 mt-3 mb-7">
              Agar aapko professional, transparent aur tech-enabled library chahiye to registration start karein.
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
