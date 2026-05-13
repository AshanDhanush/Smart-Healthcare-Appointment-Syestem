package edu.uok.stu.service.impl;

import edu.uok.stu.model.dto.AppointmentsDto;
import edu.uok.stu.model.dto.NotificationEvent;
import edu.uok.stu.model.entity.Appointments;
import edu.uok.stu.repository.AppointmentRepo;
import edu.uok.stu.service.AppointmentService;
import edu.uok.stu.service.InvoiceService;
import edu.uok.stu.util.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service

public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    private AppointmentRepo appointmentRepo;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public List<AppointmentsDto> getAllAppointments() {

        List<Appointments> appointments = appointmentRepo.findAll();
        List<AppointmentsDto> appointmentsDtos = new ArrayList<>();

        for(Appointments a : appointments){
            AppointmentsDto appointmentsDto = new AppointmentsDto(
                    a.getPatientName(),
                    a.getPatientEmail(),
                    a.getDoctorName(),
                    a.getDoctorEmail(),
                    a.getDoctorSpecialization(),
                    a.getDepartmentCode(),
                    a.getRoomNumber(),
                    a.getAppointmentFees(),
                    a.getDate(),
                    a.getTime(),
                    a.getStatus()
            );
            appointmentsDtos.add(appointmentsDto);
        }

        return appointmentsDtos;

    }

    @Override
    @Transactional
    public boolean addAppointments(AppointmentsDto appointmentsDto) {
        if (appointmentsDto == null) {
            return false;
        }

        try{
            Appointments appointments = new Appointments(
                    null,
                    appointmentsDto.getPatientName(),
                    appointmentsDto.getPatientEmail(),
                    appointmentsDto.getDoctorName(),
                    appointmentsDto.getDoctorEmail(),
                    appointmentsDto.getDoctorSpecialization(),
                    appointmentsDto.getDepartmentCode(),
                    appointmentsDto.getRoomNumber(),
                    appointmentsDto.getAppointmentFees(),
                    appointmentsDto.getDate(),
                    appointmentsDto.getTime(),
                    Status.PENDING
            );
            appointmentRepo.save(appointments);
            String html = invoiceService.buildInvoiceHtml(
                    appointmentsDto.getDoctorName(),
                    appointments.getDoctorSpecialization(),
                    appointmentsDto.getAppointmentFees(),
                    appointmentsDto.getPatientName(),
                    appointments.getPatientEmail(),
                    appointmentsDto.getRoomNumber(),
                    appointmentsDto.getDate(),
                    appointmentsDto.getTime()
            );
            byte[] pdfBytes = invoiceService.generateInvoicePdf(html);
            String pdfFileName = "Invoice_" + appointmentsDto.getPatientName() + ".pdf";

                NotificationEvent notificationEvent= new NotificationEvent(
                     appointments.getPatientEmail(),
                    "Appoint Details & Invoice",
                    "Thank you for your order! Please find your invoice attached.",
                    pdfFileName,
                    pdfBytes
            );

                kafkaTemplate.send("appointment-topic", notificationEvent);

                return true;

        }catch(Exception e) {
            throw new RuntimeException("Failed to save order", e);

        }
    }
}
