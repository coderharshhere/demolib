import type { Student, Seat, Payment, Notification, LibraryStats, Attendance } from '@/types';

// Initialize mock data
export function initializeMockData() {
  if (!localStorage.getItem('library_seats')) {
    const seats: Seat[] = [];
    const rows = 10;
    const cols = 8;
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        const seatNumber = `${String.fromCharCode(64 + row)}${col}`;
        seats.push({
          id: `seat-${seatNumber}`,
          seatNumber,
          row,
          column: col,
          type: col <= 2 ? 'cabin' : col <= 5 ? 'single' : 'double',
          status: Math.random() > 0.7 ? 'occupied' : 'available',
          price: col <= 2 ? 1500 : col <= 5 ? 800 : 1200,
          features: col <= 2 ? ['AC', 'Charging Point', 'Personal Light', 'Locker'] : 
                    col <= 5 ? ['Fan', 'Charging Point', 'Personal Light'] : 
                    ['AC', 'Charging Point', 'Shared Table']
        });
      }
    }
    localStorage.setItem('library_seats', JSON.stringify(seats));
  }

  if (!localStorage.getItem('library_payments')) {
    localStorage.setItem('library_payments', JSON.stringify([]));
  }

  if (!localStorage.getItem('library_notifications')) {
    localStorage.setItem('library_notifications', JSON.stringify([]));
  }

  if (!localStorage.getItem('library_attendance')) {
    localStorage.setItem('library_attendance', JSON.stringify([]));
  }
}

// Student Services
export function getAllStudents(): Student[] {
  return JSON.parse(localStorage.getItem('library_students') || '[]');
}

export function getStudentById(id: string): Student | null {
  const students = getAllStudents();
  return students.find(s => s.id === id) || null;
}

export function updateStudent(student: Student): void {
  const students = getAllStudents();
  const index = students.findIndex(s => s.id === student.id);
  if (index !== -1) {
    students[index] = student;
    localStorage.setItem('library_students', JSON.stringify(students));
  }
}

export function getPendingStudents(): Student[] {
  return getAllStudents().filter(s => s.status === 'pending');
}

export function getActiveStudents(): Student[] {
  return getAllStudents().filter(s => s.status === 'active');
}

// Seat Services
export function getAllSeats(): Seat[] {
  return JSON.parse(localStorage.getItem('library_seats') || '[]');
}

export function getSeatById(id: string): Seat | null {
  const seats = getAllSeats();
  return seats.find(s => s.id === id) || null;
}

export function updateSeat(seat: Seat): void {
  const seats = getAllSeats();
  const index = seats.findIndex(s => s.id === seat.id);
  if (index !== -1) {
    seats[index] = seat;
    localStorage.setItem('library_seats', JSON.stringify(seats));
  }
}

export function getAvailableSeats(): Seat[] {
  return getAllSeats().filter(s => s.status === 'available');
}

export function assignSeatToStudent(seatId: string, studentId: string, studentName: string): void {
  const seat = getSeatById(seatId);
  if (seat) {
    seat.status = 'occupied';
    seat.studentId = studentId;
    seat.studentName = studentName;
    updateSeat(seat);
  }
  
  const student = getStudentById(studentId);
  if (student) {
    student.seatId = seatId;
    student.seatNumber = seat?.seatNumber;
    updateStudent(student);
  }
}

export function releaseSeat(seatId: string): void {
  const seat = getSeatById(seatId);
  if (seat) {
    const student = getStudentById(seat.studentId || '');
    if (student) {
      student.seatId = undefined;
      student.seatNumber = undefined;
      updateStudent(student);
    }
    
    seat.status = 'available';
    seat.studentId = undefined;
    seat.studentName = undefined;
    updateSeat(seat);
  }
}

// Payment Services
export function getAllPayments(): Payment[] {
  return JSON.parse(localStorage.getItem('library_payments') || '[]');
}

export function createPayment(payment: Omit<Payment, 'id' | 'date'>): Payment {
  const payments = getAllPayments();
  const newPayment: Payment = {
    ...payment,
    id: `pay-${Date.now()}`,
    date: new Date().toISOString()
  };
  payments.push(newPayment);
  localStorage.setItem('library_payments', JSON.stringify(payments));
  return newPayment;
}

export function updatePaymentStatus(paymentId: string, status: Payment['status']): void {
  const payments = getAllPayments();
  const index = payments.findIndex(p => p.id === paymentId);
  if (index !== -1) {
    payments[index].status = status;
    localStorage.setItem('library_payments', JSON.stringify(payments));
    
    // Update student payment status
    const student = getStudentById(payments[index].studentId);
    if (student) {
      student.paymentStatus = status === 'completed' ? 'paid' : status;
      student.paymentDate = new Date().toISOString();
      student.paymentMethod = payments[index].method;
      student.paymentAmount = payments[index].amount;
      if (status === 'completed' && student.status === 'approved') {
        student.status = 'active';
      }
      updateStudent(student);
    }
  }
}

// Notification Services
export function getAllNotifications(): Notification[] {
  return JSON.parse(localStorage.getItem('library_notifications') || '[]');
}

export function sendNotification(notification: Omit<Notification, 'id' | 'sentAt'>): Notification {
  const notifications = getAllNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    sentAt: new Date().toISOString()
  };
  notifications.push(newNotification);
  localStorage.setItem('library_notifications', JSON.stringify(notifications));
  return newNotification;
}

export function sendApprovalNotification(student: Student): void {
  // Email notification
  sendNotification({
    userId: student.id,
    type: 'email',
    title: 'Library Registration Approved',
    message: `Congratulations! Your registration has been approved. Your seat number is ${student.seatNumber}. Please complete the payment to activate your account.`,
    status: 'sent'
  });
  
  // WhatsApp notification
  sendNotification({
    userId: student.id,
    type: 'whatsapp',
    title: 'Library Registration Approved',
    message: `Hello ${student.name}, your library registration is approved! Seat: ${student.seatNumber}. Amount: ₹${student.paymentAmount}. Please pay to activate.`,
    status: 'sent'
  });
}

export function sendPaymentConfirmation(student: Student): void {
  // Email notification
  sendNotification({
    userId: student.id,
    type: 'email',
    title: 'Payment Received',
    message: `Your payment of ₹${student.paymentAmount} has been received. You can now access the library. Your seat number is ${student.seatNumber}.`,
    status: 'sent'
  });
  
  // WhatsApp notification
  sendNotification({
    userId: student.id,
    type: 'whatsapp',
    title: 'Payment Received',
    message: `Hello ${student.name}, payment of ₹${student.paymentAmount} received! You can now access the library. Seat: ${student.seatNumber}.`,
    status: 'sent'
  });
}

// Attendance Services
export function getAllAttendance(): Attendance[] {
  return JSON.parse(localStorage.getItem('library_attendance') || '[]');
}

export function markAttendance(studentId: string, studentName: string, seatNumber: string): Attendance {
  const attendance = getAllAttendance();
  const newAttendance: Attendance = {
    id: `att-${Date.now()}`,
    studentId,
    studentName,
    seatNumber,
    entryTime: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  };
  attendance.push(newAttendance);
  localStorage.setItem('library_attendance', JSON.stringify(attendance));
  return newAttendance;
}

export function markExit(attendanceId: string): void {
  const attendance = getAllAttendance();
  const index = attendance.findIndex(a => a.id === attendanceId);
  if (index !== -1) {
    attendance[index].exitTime = new Date().toISOString();
    localStorage.setItem('library_attendance', JSON.stringify(attendance));
  }
}

// Stats Services
export function getLibraryStats(): LibraryStats {
  const students = getAllStudents();
  const seats = getAllSeats();
  const payments = getAllPayments();
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const todayRevenue = payments
    .filter(p => p.date.startsWith(today) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const monthlyRevenue = payments
    .filter(p => p.date.startsWith(currentMonth) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    pendingApprovals: students.filter(s => s.status === 'pending').length,
    totalSeats: seats.length,
    occupiedSeats: seats.filter(s => s.status === 'occupied').length,
    availableSeats: seats.filter(s => s.status === 'available').length,
    todayRevenue,
    monthlyRevenue
  };
}

// Approval Workflow
export function approveStudent(studentId: string, seatId: string): void {
  const student = getStudentById(studentId);
  const seat = getSeatById(seatId);
  
  if (student && seat) {
    student.status = 'approved';
    student.seatId = seatId;
    student.seatNumber = seat.seatNumber;
    student.approvalDate = new Date().toISOString();
    student.paymentAmount = seat.price;
    updateStudent(student);
    
    assignSeatToStudent(seatId, studentId, student.name);
    sendApprovalNotification(student);
  }
}

export function rejectStudent(studentId: string): void {
  const student = getStudentById(studentId);
  if (student) {
    student.status = 'rejected';
    updateStudent(student);
  }
}

export function completePayment(studentId: string, method: 'online' | 'cash'): void {
  const student = getStudentById(studentId);
  if (student && student.paymentAmount) {
    const payment = createPayment({
      studentId,
      studentName: student.name,
      amount: student.paymentAmount,
      method,
      status: 'completed',
      transactionId: method === 'online' ? `TXN${Date.now()}` : undefined,
      notes: method === 'cash' ? 'Cash payment received' : 'Online payment'
    });
    
    updatePaymentStatus(payment.id, 'completed');
    sendPaymentConfirmation(student);
  }
}
