import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, CreditCard, LayoutDashboard, Mail } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">LibraryHub</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/login')}>
              Admin Login
            </Button>
            <Button onClick={() => navigate('/student/login')}>
              Student Login
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Modern Library Management System
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Streamline your library operations with our comprehensive management solution. 
            From seat allocation to payment processing, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/student/register')}>
              Register as Student
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/admin/login')}>
              Admin Portal
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Student Management</h3>
                <p className="text-slate-600 text-sm">
                  Easy registration, approval workflow, and complete student profiles
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <LayoutDashboard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Seat Allocation</h3>
                <p className="text-slate-600 text-sm">
                  Visual seat layout like train compartments with easy allocation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Payment System</h3>
                <p className="text-slate-600 text-sm">
                  Online and cash payment options with automatic receipts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Notifications</h3>
                <p className="text-slate-600 text-sm">
                  Email and WhatsApp notifications for approvals and payments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-slate-600 text-sm">
                Student fills registration form with personal and academic details
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Approval</h3>
              <p className="text-slate-600 text-sm">
                Admin reviews and approves with seat assignment
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-slate-600 text-sm">
                Student receives notification and completes payment
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Access</h3>
              <p className="text-slate-600 text-sm">
                Student gets library access with assigned seat
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">LibraryHub</span>
          </div>
          <p className="text-slate-400">
            Modern library management system for the digital age.
          </p>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            © 2024 LibraryHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
