import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatDate } from './dateUtils';
import { formatCurrency } from './priceUtils';

/**
 * Export data array to Excel file.
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Destination filename
 * @param {string} sheetName - Excel sheet tab name
 */
export const exportToExcel = (data, fileName = 'Gas_Agency_Report.xlsx', sheetName = 'Report') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });
  
  saveAs(dataBlob, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
};

/**
 * Export data array to CSV file.
 * @param {Array} data 
 * @param {string} fileName 
 */
export const exportToCSV = (data, fileName = 'Gas_Agency_Report.csv') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const dataBlob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  
  saveAs(dataBlob, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
};

/**
 * Export report to formatted PDF.
 * @param {Object} options { title, subtitle, headers, data, summaryRows, fileName }
 */
export const exportToPDF = ({
  title = 'Gas Agency Report',
  subtitle = '',
  headers = [],
  data = [],
  summaryRows = [],
  fileName = 'Gas_Agency_Report.pdf'
}) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Title Header
  doc.setFillColor(30, 58, 95); // Navy Blue
  doc.rect(0, 0, 210, 24, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 12);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 19);

  let currentY = 30;

  if (subtitle) {
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 14, currentY);
    currentY += 8;
  }

  // Summary Metrics Section
  if (summaryRows && summaryRows.length > 0) {
    doc.setFillColor(247, 248, 250);
    doc.rect(14, currentY, 182, 8 + (summaryRows.length * 6), 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(14, currentY, 182, 8 + (summaryRows.length * 6), 'S');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 95);
    doc.text('SUMMARY SNAPSHOT', 18, currentY + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    let rowY = currentY + 12;

    summaryRows.forEach(row => {
      doc.text(`${row.label}:`, 18, rowY);
      doc.setFont('helvetica', 'bold');
      doc.text(String(row.value), 90, rowY);
      doc.setFont('helvetica', 'normal');
      rowY += 6;
    });

    currentY = rowY + 6;
  }

  // Main Data Table
  if (headers.length > 0 && data.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [211, 47, 47], // Gas Red
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [31, 41, 55]
      },
      alternateRowStyles: {
        fillColor: [247, 248, 250]
      },
      margin: { left: 14, right: 14 }
    });
  }

  doc.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
};

/**
 * Download Printable Sale Receipt PDF.
 * @param {Object} sale 
 * @param {Object} agency 
 */
export const downloadSaleReceiptPDF = (sale, agency = {}) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 160] // Thermal receipt style formatting
  });

  const agencyName = agency.agencyName || 'BHARAT/HP/INDANE GAS AGENCY';
  const agencyPhone = agency.phone || '+91 9876543210';
  const agencyAddress = agency.address || 'Main Road, Agency City';

  // Receipt Header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(agencyName, 40, 10, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(agencyAddress, 40, 15, { align: 'center' });
  doc.text(`Ph: ${agencyPhone}`, 40, 19, { align: 'center' });

  doc.setLineDashPattern([1, 1], 0);
  doc.line(5, 22, 75, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL SALE RECEIPT', 40, 27, { align: 'center' });

  doc.line(5, 30, 75, 30);

  // Sale Details
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let y = 36;

  const addLine = (label, val) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 6, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), 74, y, { align: 'right' });
    y += 5;
  };

  addLine('Receipt ID:', sale.id ? sale.id.substring(0, 8).toUpperCase() : 'N/A');
  addLine('Date:', formatDate(sale.saleDate));
  addLine('Customer:', sale.customerName);
  addLine('Consumer ID:', sale.consumerId);
  addLine('Mobile:', sale.mobile || 'N/A');
  addLine('Company:', sale.company);
  addLine('Cylinder Weight:', `${sale.weight} KG`);
  addLine('Quantity:', sale.quantity);
  addLine('Unit Price:', formatCurrency(sale.unitPrice));
  addLine('Payment Method:', sale.paymentMethod || 'Cash');

  doc.line(5, y + 1, 75, y + 1);
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAID:', 6, y);
  doc.text(formatCurrency(sale.totalPrice), 74, y, { align: 'right' });
  y += 7;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(46, 125, 50); // Green accent
  doc.text(`Next Eligible Refill: ${formatDate(sale.nextEligibleDate)}`, 40, y, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  doc.line(5, y, 75, y);
  y += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing our service!', 40, y, { align: 'center' });
  doc.text('Please keep this receipt for future reference.', 40, y + 4, { align: 'center' });

  doc.save(`Receipt_${sale.consumerId}_${formatDate(sale.saleDate).replace(/\//g, '-')}.pdf`);
};
