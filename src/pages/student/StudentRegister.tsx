import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Upload,
  UserRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StudentRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    course: '',
    institute: '',
    guardianName: '',
    emergencyContact: '',
    dateOfBirth: '',
    gender: '',
    studyGoal: '',
    preferredShift: '',
    idType: '',
    photoUrl: '',
    idProofUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'photoUrl' | 'idProofUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Please upload file smaller than 2MB.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, [field]: base64 }));
      toast.success(`${field === 'photoUrl' ? 'Photo' : 'ID proof'} uploaded.`);
    } catch {
      toast.error('Unable to process file. Please try another file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.phone.length < 10 || formData.emergencyContact.length < 10) {
      setError('Please enter valid phone and emergency contact numbers');
      return;
    }

    if (!formData.photoUrl) {
      setError('Please upload your profile photo');
      return;
    }

    if (!formData.idProofUrl) {
      setError('Please upload ID proof');
      return;
    }

    if (!formData.gender || !formData.preferredShift || !formData.idType) {
      setError('Please complete all required dropdown selections');
      return;
    }

    setIsLoading(true);

    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
      course: formData.course,
      institute: formData.institute,
      guardianName: formData.guardianName,
      emergencyContact: formData.emergencyContact,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'male' | 'female' | 'other',
      studyGoal: formData.studyGoal,
      preferredShift: formData.preferredShift as 'morning' | 'afternoon' | 'evening' | 'full-day',
      idType: formData.idType as 'aadhaar' | 'pan' | 'college-id' | 'other',
      photoUrl: formData.photoUrl,
      idProofUrl: formData.idProofUrl,
    });

    if (success) {
      setIsSuccess(true);
      toast.success('Registration successful! Please wait for admin approval.');
    } else {
      setError('Email already registered. Please use a different email or login.');
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-white/20 bg-white/95">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
              <p className="text-slate-600 mb-6">
                Your profile and documents are submitted. Admin verification ke baad aapko access mil jayega.
              </p>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate('/student/login')}>
                  Go to Login
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-4 text-white hover:bg-white/10 hover:text-white" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-white/15 bg-white/95 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl">Student Registration Form</CardTitle>
            <CardDescription className="text-base">
              Professional library membership ke liye complete details + document upload karein.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg border p-3 bg-slate-50">
                <p className="text-sm font-semibold flex items-center gap-2"><UserRound className="h-4 w-4" />Personal Details</p>
                <p className="text-xs text-slate-600">Identity and contact verification</p>
              </div>
              <div className="rounded-lg border p-3 bg-slate-50">
                <p className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Required Documents</p>
                <p className="text-xs text-slate-600">Photo + ID proof (max 2MB each)</p>
              </div>
              <div className="rounded-lg border p-3 bg-slate-50">
                <p className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" />Study Preferences</p>
                <p className="text-xs text-slate-600">Goal and preferred shift selection</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name *</Label>
                  <Input id="guardianName" name="guardianName" placeholder="Parent / Guardian Name" value={formData.guardianName} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input id="emergencyContact" name="emergencyContact" type="tel" placeholder="Emergency number" value={formData.emergencyContact} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course/Class *</Label>
                  <Input id="course" name="course" placeholder="e.g., UPSC, SSC, B.Tech" value={formData.course} onChange={handleChange} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="institute">Institute/College *</Label>
                  <Input id="institute" name="institute" placeholder="Institute/College name" value={formData.institute} onChange={handleChange} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" name="address" placeholder="Complete address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Shift *</Label>
                  <Select value={formData.preferredShift} onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredShift: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="full-day">Full Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ID Proof Type *</Label>
                  <Select value={formData.idType} onValueChange={(value) => setFormData((prev) => ({ ...prev, idType: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="college-id">College ID</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="studyGoal">Study Goal / Exam Preparation *</Label>
                  <Textarea id="studyGoal" name="studyGoal" placeholder="Example: Preparing for UPSC CSE 2027, need quiet full-day desk" value={formData.studyGoal} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photoUpload">Profile Photo *</Label>
                  <Input id="photoUpload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photoUrl')} required />
                  <p className="text-xs text-slate-500">JPG/PNG, max 2MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idProofUpload">ID Proof Upload *</Label>
                  <Input id="idProofUpload" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'idProofUrl')} required />
                  <p className="text-xs text-slate-500">Image/PDF, max 2MB</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" name="password" type="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Registration with Documents
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already registered?{' '}
                <Button variant="link" className="p-0" onClick={() => navigate('/student/login')}>
                  Login here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
