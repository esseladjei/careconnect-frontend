/**
 * Utility function to generate and download prescription as PDF
 * Uses HTML to PDF conversion via canvas/blob
 */

interface PrescriptionData {
  appointmentId: string;
  patientName: string;
  providerName: string;
  consultationNotes: string;
  prescriptions: string;
  appointmentDate: string;
  appointmentTime: string;
}

export const prescriptionPdfGenerator = (
  role: string,
  data: PrescriptionData
): void => {
  if (role === 'patient') {
    downloadPrescriptionPDF(data);
  } else if (role === 'provider') {
    openPrescriptionPrintView(data);
  }
};
/**
 *  USE THIS FUNCTION FOR PATIENTS TO DOWNLOAD AN HTML FILE THEY CAN OPEN OR CONVERT TO PDF,
 *  AND THE OTHER FUNCTION FOR PROVIDERS TO PRINT OR SAVE AS PDF
 *
 * */
const downloadPrescriptionPDF = (data: PrescriptionData) => {
  const {
    appointmentId,
    patientName,
    providerName,
    consultationNotes,
    prescriptions,
    appointmentDate,
    appointmentTime,
  } = data;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Prescription - ${appointmentId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #0ea5e9;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0ea5e9;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }
        .info-item {
          margin-bottom: 15px;
        }
        .info-item label {
          display: block;
          font-weight: 600;
          color: #0ea5e9;
          margin-bottom: 5px;
          font-size: 12px;
          text-transform: uppercase;
        }
        .info-item value {
          display: block;
          color: #333;
          font-size: 15px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0f2fe;
        }
        .section-content {
          background: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
          line-height: 1.8;
          color: #444;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #999;
          font-size: 12px;
        }
        .timestamp {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Prescription</h1>
          <h3>Patient's Copy</h3>
          <p>Appointment ID: ${appointmentId}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>Patient Name</label>
            <value>${patientName || 'N/A'}</value>
          </div>
          <div class="info-item">
            <label>Healthcare Provider</label>
            <value>${providerName || 'N/A'}</value>
          </div>
          <div class="info-item">
            <label>Appointment Date</label>
            <value>${appointmentDate || 'N/A'}</value>
          </div>
          <div class="info-item">
            <label>Appointment Time</label>
            <value>${appointmentTime || 'N/A'}</value>
          </div>
        </div>
      
       <div class="section">
          <div class="section-title">Consultation Notes</div>
          <div class="section-content">
            ${consultationNotes || '<em>No consultation notes</em>'}
          </div>
        </div>
       
        <div class="section">
          <div class="section-title">Prescription Information</div>
          <div class="section-content">
            ${prescriptions || '<em style="color: #999;">No consultation notes provided</em>'}
          </div>
        </div>

        <div class="footer">
          <p>Electronically signed by the responsible healthcare professional. No physical signature required under applicable digital documentation practices.</p>
          <p>This document was generated from CareConnect telemedicine application, a product of KOADEL Connect</p>
          <div class="timestamp">Generated on: ${new Date().toLocaleString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          )})
           </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Prescription_${appointmentId}_${new Date().getTime()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Alternative: Generate PDF using print-to-PDF (browser's print functionality)
 * This approach preserves styling better
 * USE THIS FOR PROVIDERS TO PRINT OR SAVE AS PDF, AND THE ABOVE FOR PATIENTS TO DOWNLOAD AN HTML FILE THEY CAN OPEN OR CONVERT TO PDF
 */
const openPrescriptionPrintView = (data: PrescriptionData) => {
  const {
    appointmentId,
    patientName,
    providerName,
    consultationNotes,
    prescriptions,
    appointmentDate,
    appointmentTime,
  } = data;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Prescription - ${appointmentId}</title>
      <style>
        @media print {
          * {
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
          }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #0ea5e9;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #0ea5e9;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-item label {
          display: block;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 5px;
          font-size: 11px;
          text-transform: uppercase;
        }
        .info-item p {
          color: #333;
          font-size: 14px;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0ea5e9;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e0f2fe;
        }
        .section-content {
          background: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
          line-height: 1.7;
          color: #444;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #999;
          font-size: 11px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Prescription & Consultation Report</h1>
          <h3>Provider's Copy</h3>
          <p style="color: #666; font-size: 13px;">Appointment ID: ${appointmentId}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <label>Patient Name</label>
            <p>${patientName || 'N/A'}</p>
          </div>
          <div class="info-item">
            <label>Healthcare Provider</label>
            <p>${providerName || 'N/A'}</p>
          </div>
          <div class="info-item">
            <label>Appointment Date</label>
            <p>${appointmentDate || 'N/A'}</p>
          </div>
          <div class="info-item">
            <label>Appointment Time</label>
            <p>${appointmentTime || 'N/A'}</p>
          </div>
        </div>

       <div class="section">
           <div class="section-title">Consultation Notes</div>
           <div class="section-content">
             ${consultationNotes ? consultationNotes.replace(/\n/g, '<br>') : '<em style="color: #999;">No consultation notes provided</em>'}
           </div>
         </div>
      
       <div class="section">
          <div class="section-title">Prescription Information</div>
          <div class="section-content">
            ${prescriptions ? prescriptions.replace(/\n/g, '<br>') : '<em style="color: #999;">No prescription information provided</em>'}
          </div>
        </div>

        <div class="footer">
          <p>Electronically signed by the responsible healthcare professional. No physical signature required under applicable digital documentation practices.</p>
          <p>This document was generated from CareConnect telemedicine application, a product of KOADEL Connect</p>
          <div class="timestamp">Generated on: ${new Date().toLocaleString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          )})
           </div>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
};
