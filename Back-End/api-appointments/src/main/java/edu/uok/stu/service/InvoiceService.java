package edu.uok.stu.service;

import java.time.LocalDate;
import java.time.LocalTime;

public interface InvoiceService {
    String buildInvoiceHtml(
            String doctorName,
            String specialization,
            double consultationFee,
            String patientName,
            String patientEmail,
            String roomNumber,
            LocalDate date,
            int number
    );
    byte[] generateInvoicePdf(String html);

}
