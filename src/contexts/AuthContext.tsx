import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Student } from '@/types';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  login: (email: string, password: string, role: 'admin' | 'student') => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  course: string;
  institute: string;
  guardianName?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  studyGoal?: string;
  preferredShift?: 'morning' | 'afternoon' | 'evening' | 'full-day';
  idType?: 'aadhaar' | 'pan' | 'college-id' | 'other';
  photoUrl?: string;
  idProofUrl?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials
const ADMIN_EMAIL = 'admin@library.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('library_user');
    const savedStudent = localStorage.getItem('library_student');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'student'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (role === 'admin') {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          name: 'Library Admin',
          role: 'admin',
          phone: '+91 9876543210'
        };
        setUser(adminUser);
        localStorage.setItem('library_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return true;
      }
    } else {
      // Check registered students
      const students = JSON.parse(localStorage.getItem('library_students') || '[]');
      const foundStudent = students.find((s: Student) => s.email === email);
      
      const passwords = JSON.parse(localStorage.getItem('library_passwords') || '{}');
      if (foundStudent && passwords[email] === password) {
        const studentUser: User = {
          id: foundStudent.userId,
          email: foundStudent.email,
          name: foundStudent.name,
          role: 'student',
          phone: foundStudent.phone
        };
        setUser(studentUser);
        setStudent(foundStudent);
        localStorage.setItem('library_user', JSON.stringify(studentUser));
        localStorage.setItem('library_student', JSON.stringify(foundStudent));
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const students = JSON.parse(localStorage.getItem('library_students') || '[]');
    
    // Check if email already exists
    if (students.some((s: Student) => s.email === data.email)) {
      setIsLoading(false);
      return false;
    }
    
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      course: data.course,
      institute: data.institute,
      guardianName: data.guardianName,
      emergencyContact: data.emergencyContact,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      studyGoal: data.studyGoal,
      preferredShift: data.preferredShift,
      idType: data.idType,
      photoUrl: data.photoUrl,
      idProofUrl: data.idProofUrl,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };
    
    students.push(newStudent);
    localStorage.setItem('library_students', JSON.stringify(students));
    
    // Store password separately (in real app, this would be hashed)
    const passwords = JSON.parse(localStorage.getItem('library_passwords') || '{}');
    passwords[data.email] = data.password;
    localStorage.setItem('library_passwords', JSON.stringify(passwords));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setStudent(null);
    localStorage.removeItem('library_user');
    localStorage.removeItem('library_student');
  };

  return (
    <AuthContext.Provider value={{ user, student, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
