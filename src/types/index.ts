export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  phone: string;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  course: string;
  institute: string;
  photoUrl?: string;
  idProofUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  seatId?: string;
  seatNumber?: string;
  registrationDate: string;
  approvalDate?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentAmount?: number;
  paymentDate?: string;
  paymentMethod?: 'online' | 'cash';
  libraryEntryTime?: string;
  libraryExitTime?: string;
}

export interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  type: 'single' | 'double' | 'cabin';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  studentId?: string;
  studentName?: string;
  price: number;
  features: string[];
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: 'online' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  transactionId?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'whatsapp' | 'sms';
  title: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt?: string;
}

export interface LibraryStats {
  totalStudents: number;
  activeStudents: number;
  pendingApprovals: number;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  seatNumber: string;
  entryTime: string;
  exitTime?: string;
  date: string;
  status: 'present' | 'absent';
}

export interface LibraryConfig {
  libraryName: string;
  openTime: string;
  closeTime: string;
  monthlyFee: number;
  lateFeePerHour: number;
  enableOnlinePayment: boolean;
  enableAttendanceTracking: boolean;
}
