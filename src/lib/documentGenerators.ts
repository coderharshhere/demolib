import type { Student } from '@/types';

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
};

const formatCurrency = (amount?: number) => `₹${(amount || 0).toLocaleString('en-IN')}`;

const printDocument = (title: string, bodyHtml: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    window.alert('Unable to open print window. Please allow popups and try again.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 28px;
            color: #1e293b;
            background: #f8fafc;
          }
          .page {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
          }
          .header {
            background: linear-gradient(120deg, #6d28d9, #d946ef);
            color: white;
            padding: 20px 24px;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .header p {
            margin: 6px 0 0;
            opacity: 0.92;
          }
          .section {
            padding: 18px 24px;
            border-top: 1px solid #e2e8f0;
          }
          .section h2 {
            margin: 0 0 12px;
            font-size: 15px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: #475569;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px 18px;
          }
          .item {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            border-radius: 10px;
            padding: 10px 12px;
          }
          .label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 4px;
          }
          .value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            word-break: break-word;
          }
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 12px;
            padding: 18px 24px 24px;
            border-top: 1px solid #e2e8f0;
          }
          .receipt-badge {
            display: inline-block;
            margin-top: 8px;
            padding: 6px 10px;
            font-size: 11px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.18);
          }
          @media print {
            body {
              background: #ffffff;
              padding: 0;
            }
            .page {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 300);
};

export const downloadStudentProfilePdf = (student: Student) => {
  const bodyHtml = `
    <div class="page">
      <div class="header">
        <h1>Student Complete Profile Report</h1>
        <p>LibraryHub - Admin Student Documentation</p>
        <span class="receipt-badge">Generated: ${new Date().toLocaleString()}</span>
      </div>

      <div class="section">
        <h2>Primary Information</h2>
        <div class="grid">
          <div class="item"><div class="label">Full Name</div><div class="value">${student.name || 'N/A'}</div></div>
          <div class="item"><div class="label">Email</div><div class="value">${student.email || 'N/A'}</div></div>
          <div class="item"><div class="label">Phone</div><div class="value">${student.phone || 'N/A'}</div></div>
          <div class="item"><div class="label">Address</div><div class="value">${student.address || 'N/A'}</div></div>
          <div class="item"><div class="label">Course</div><div class="value">${student.course || 'N/A'}</div></div>
          <div class="item"><div class="label">Institute</div><div class="value">${student.institute || 'N/A'}</div></div>
        </div>
      </div>

      <div class="section">
        <h2>Identity & Guardian Details</h2>
        <div class="grid">
          <div class="item"><div class="label">Date of Birth</div><div class="value">${student.dateOfBirth || 'N/A'}</div></div>
          <div class="item"><div class="label">Gender</div><div class="value">${student.gender || 'N/A'}</div></div>
          <div class="item"><div class="label">Guardian Name</div><div class="value">${student.guardianName || 'N/A'}</div></div>
          <div class="item"><div class="label">Emergency Contact</div><div class="value">${student.emergencyContact || 'N/A'}</div></div>
          <div class="item"><div class="label">Preferred Shift</div><div class="value">${student.preferredShift || 'N/A'}</div></div>
          <div class="item"><div class="label">Study Goal</div><div class="value">${student.studyGoal || 'N/A'}</div></div>
          <div class="item"><div class="label">ID Type</div><div class="value">${student.idType || 'N/A'}</div></div>
        </div>
      </div>

      <div class="section">
        <h2>Library Membership Details</h2>
        <div class="grid">
          <div class="item"><div class="label">Student Status</div><div class="value">${student.status}</div></div>
          <div class="item"><div class="label">Seat Number</div><div class="value">${student.seatNumber || 'Not Assigned'}</div></div>
          <div class="item"><div class="label">Registration Date</div><div class="value">${formatDateTime(student.registrationDate)}</div></div>
          <div class="item"><div class="label">Approval Date</div><div class="value">${formatDateTime(student.approvalDate)}</div></div>
          <div class="item"><div class="label">Payment Status</div><div class="value">${student.paymentStatus}</div></div>
          <div class="item"><div class="label">Payment Method</div><div class="value">${student.paymentMethod || 'N/A'}</div></div>
          <div class="item"><div class="label">Payment Date</div><div class="value">${formatDateTime(student.paymentDate)}</div></div>
          <div class="item"><div class="label">Monthly Fee</div><div class="value">₹${student.paymentAmount || 0}</div></div>
        </div>
      </div>

      <div class="footer">
        This report is system generated by LibraryHub Admin Panel.
      </div>
    </div>
  `;

  printDocument(`Student-Profile-${student.name}`, bodyHtml);
};

export const downloadReceiptPdf = (student: Student) => {
  const baseAmount = student.paymentAmount || 0;
  const admissionFee = 0;
  const securityDeposit = 0;
  const discount = 0;
  const taxableAmount = baseAmount + admissionFee + securityDeposit - discount;
  const gstRate = 0;
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const grandTotal = taxableAmount + gstAmount;
  const invoiceNo = `LIB-INV-${student.id.slice(-6).toUpperCase()}`;

  const bodyHtml = `
    <div class="page">
      <div class="header">
        <h1>Tax Invoice / Payment Receipt</h1>
        <p>LibraryHub Professional Billing Document</p>
        <span class="receipt-badge">Invoice No: ${invoiceNo}</span>
      </div>

      <div class="section">
        <h2>Billing Details</h2>
        <div class="grid">
          <div class="item"><div class="label">Invoice Date</div><div class="value">${formatDateTime(student.paymentDate || new Date().toISOString())}</div></div>
          <div class="item"><div class="label">Receipt ID</div><div class="value">RCPT-${student.id}</div></div>
          <div class="item"><div class="label">Student Name</div><div class="value">${student.name}</div></div>
          <div class="item"><div class="label">Student Email</div><div class="value">${student.email}</div></div>
          <div class="item"><div class="label">Phone</div><div class="value">${student.phone}</div></div>
          <div class="item"><div class="label">Course</div><div class="value">${student.course || 'N/A'}</div></div>
          <div class="item"><div class="label">Assigned Seat</div><div class="value">${student.seatNumber || 'Not Assigned'}</div></div>
          <div class="item"><div class="label">Payment Method</div><div class="value">${(student.paymentMethod || 'N/A').toUpperCase()}</div></div>
          <div class="item"><div class="label">Payment Status</div><div class="value">${student.paymentStatus.toUpperCase()}</div></div>
          <div class="item"><div class="label">Generated On</div><div class="value">${formatDateTime(new Date().toISOString())}</div></div>
        </div>
      </div>

      <div class="section">
        <h2>Professional Billing Summary</h2>
        <div class="grid">
          <div class="item"><div class="label">Monthly Subscription Fee</div><div class="value">${formatCurrency(baseAmount)}</div></div>
          <div class="item"><div class="label">Admission Fee</div><div class="value">${formatCurrency(admissionFee)}</div></div>
          <div class="item"><div class="label">Security Deposit</div><div class="value">${formatCurrency(securityDeposit)}</div></div>
          <div class="item"><div class="label">Discount</div><div class="value">-${formatCurrency(discount)}</div></div>
          <div class="item"><div class="label">Taxable Amount</div><div class="value">${formatCurrency(taxableAmount)}</div></div>
          <div class="item"><div class="label">GST (${gstRate}%)</div><div class="value">${formatCurrency(gstAmount)}</div></div>
          <div class="item"><div class="label">Grand Total</div><div class="value">${formatCurrency(grandTotal)}</div></div>
          <div class="item"><div class="label">Outstanding Due</div><div class="value">₹0</div></div>
        </div>
      </div>

      <div class="section">
        <h2>Notes</h2>
        <div class="item">
          <div class="label">Payment Terms</div>
          <div class="value">Paid in full. This receipt is valid for library access and compliance records.</div>
        </div>
      </div>

      <div class="footer">
        This is a digitally generated professional billing receipt. Signature is not required.
      </div>
    </div>
  `;

  printDocument(`Payment-Receipt-${student.name}`, bodyHtml);
};
