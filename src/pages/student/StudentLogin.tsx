import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const success = await login(email, password, 'student');
    
    if (success) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid email or password. Please register first if you are new.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>
              Sign in to access your library account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 mb-3">Don't have an account?</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/student/register')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register Now
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
              <p className="font-medium">Note:</p>
              <p>Default password for new registrations is: <strong>student123</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
