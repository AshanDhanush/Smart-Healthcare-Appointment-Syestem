package edu.uok.stu.service.impl;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import edu.uok.stu.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor

public class InvoiceServiceImpl implements InvoiceService {
    @Override
    public String buildInvoiceHtml(String doctorName, String specialization, double consultationFee, String patientName, String patientEmail, String roomNumber, LocalDate date, LocalTime time) {
            StringBuilder html = new StringBuilder();

            html.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            html.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">");
            html.append("<html xmlns=\"http://www.w3.org/1999/xhtml\">");

            html.append("""
            <head>
                <title>Medical Appointment Invoice</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; color: #334155; padding: 20px; }
                    .header { text-align: center; border-bottom: 3px solid #0d9488; padding-bottom: 15px; }
                    .hospital-name { font-size: 26px; font-weight: bold; color: #0f172a; }
                    .invoice-title { font-size: 16px; margin-top: 5px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
                    
                    .section { margin-top: 25px; }
                    .patient-info { width: 100%; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
                    .label { font-weight: bold; color: #475569; width: 140px; font-size: 13px; }
                    
                    table.details-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 30px;
                    }
                    th {
                        background-color: #f1f5f9;
                        color: #1e293b;
                        padding: 12px;
                        text-align: left;
                        border-bottom: 2px solid #cbd5e1;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .total-section {
                        margin-top: 30px;
                        text-align: right;
                        padding-right: 10px;
                    }
                    .grand-total {
                        font-size: 22px;
                        font-weight: bold;
                        color: #0d9488;
                    }
                    .footer {
                        margin-top: 60px;
                        text-align: center;
                        font-size: 11px;
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="hospital-name">HEALTHSYNC MEDICAL CENTER</div>
                    <div class="invoice-title">Official Appointment Receipt</div>
                </div>

                <div class="section">
                    <table style="width:100%;">
                        <tr>
                            <td class="label">Patient Name:</td>
                            <td>""").append(patientName).append("""
                            </td>
                            <td class="label">Date:</td>
                            <td>""").append(date.toString()).append("""
                            </td>
                        </tr>
                        <tr>
                            <td class="label">Patient Email:</td>
                            <td>""").append(patientEmail).append("""
                            </td>
                            <td class="label">Time:</td>
                            <td>""").append(time.toString()).append("""
                            </td>
                        </tr>
                    </table>
                </div>

                <table class="details-table">
                    <thead>
                        <tr>
                            <th>Consultation Details</th>
                            <th>Specialization</th>
                            <th style="text-align: right;">Fee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dr. """).append(doctorName).append("<br/><small>Room: ").append(roomNumber).append("""
                            </small></td>
                            <td>""").append(specialization).append("""
                            </td>
                            <td style="text-align: right;">Rs. """).append(String.format("%.2f", consultationFee)).append("""
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="total-section">
                    <p>Subtotal: Rs. """).append(String.format("%.2f", consultationFee)).append("""
                    </p>
                    <p class="grand-total">Total Paid: Rs. """).append(String.format("%.2f", consultationFee)).append("""
                    </p>
                </div>

                <div class="footer">
                    <p>This is a computer-generated document. No signature required.</p>
                    <p>HealthSync Medical - 123 Healthcare Blvd, Colombo. | Emergency: +94 112 000 000</p>
                </div>
            </body>
            </html>
            """);

            return html.toString();
    }

    @Override
    public byte[] generateInvoicePdf(String html) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Medical Invoice PDF generation failed", e);
        }
    }
}
