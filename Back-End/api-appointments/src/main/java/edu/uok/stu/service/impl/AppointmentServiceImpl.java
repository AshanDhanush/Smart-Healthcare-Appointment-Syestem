package edu.uok.stu.service.impl;

import edu.uok.stu.model.dto.*;
import edu.uok.stu.model.entity.Appointments;
import edu.uok.stu.repository.AppointmentRepo;
import edu.uok.stu.service.AppointmentService;
import edu.uok.stu.service.InvoiceService;
import edu.uok.stu.util.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

        for (Appointments a : appointments) {
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
                    getAppointmentNumber(a.getDoctorEmail(), a.getDate()),
                    a.getStatus());
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
        List<Appointments> appointmentsEntity = appointmentRepo
                .findByDoctorEmailAndDate(appointmentsDto.getDoctorEmail(), appointmentsDto.getDate());

        int totalSlots = 10;
        int takenSlots = appointmentsEntity.size();
        int availableSlots = totalSlots - takenSlots;

        if (availableSlots == 0) {
            return false;
        }

        try {
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
                    getAppointmentNumber(appointmentsDto.getDoctorEmail(), appointmentsDto.getDate()),
                    Status.PENDING);
            appointmentRepo.save(appointments);
            String html = invoiceService.buildInvoiceHtml(
                    appointmentsDto.getDoctorName(),
                    appointments.getDoctorSpecialization(),
                    appointmentsDto.getAppointmentFees(),
                    appointmentsDto.getPatientName(),
                    appointments.getPatientEmail(),
                    appointmentsDto.getRoomNumber(),
                    appointmentsDto.getDate(),
                    appointments.getAppointmentNumber());
            byte[] pdfBytes = invoiceService.generateInvoicePdf(html);
            String pdfFileName = "Invoice_" + appointmentsDto.getPatientName() + ".pdf";

            NotificationEvent notificationEvent = new NotificationEvent(
                    appointments.getPatientEmail(),
                    "Appoint Details & Invoice",
                    "Thank you for your order! Please find your invoice attached.",
                    pdfFileName,
                    pdfBytes,
                    appointments.getAppointmentNumber(),
                    appointments.getDate(),
                    appointments.getStatus()

            );

            kafkaTemplate.send("appointment-topic", notificationEvent);

            return true;

        } catch (Exception e) {
            throw new RuntimeException("Failed to save order", e);

        }
    }

    private int getAppointmentNumber(String email, LocalDate date) {
        List<Appointments> appointments = appointmentRepo.findByDoctorEmailAndDate(email, date);

        if (appointments.isEmpty()) {
            return 1;
        }
        if (appointments.size() < 10) {
            return appointments.size() + 1;
        }
        return 0;
    }

    public String checkAvailabilty(LocalDate date, String doctorEmail) {
        List<Appointments> appointments = appointmentRepo.findByDoctorEmailAndDate(doctorEmail, date);

        int totalSlots = 10;
        int takenSlots = appointments.size();
        int availableSlots = totalSlots - takenSlots;

        if (availableSlots > 0) {
            return "Available. Only " + availableSlots + " slots remaining.";
        } else {
            return "Fully Booked. No slots available for this date.";
        }
    }

    @Override
    public List<AppointmentsDto> getPatientAppointments(String patientEmail) {
        List<Appointments> appointments = appointmentRepo.findByPatientEmail(patientEmail);
        List<AppointmentsDto> appointmentsDtos = new ArrayList<>();

        for (Appointments a : appointments) {
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
                    a.getAppointmentNumber(),
                    a.getStatus());
            appointmentsDtos.add(appointmentsDto);
        }
        return appointmentsDtos;
    }

    @Override
    public boolean deleteAppointment(AppointmentDeleteDto appointmentDeleteDto) {
        // 1. Fetch the appointment safely using an Optional container wrapping all 3
        // keys
        var appointmentOptional = appointmentRepo.findByAppointmentNumberAndDateAndDoctorEmail(
                appointmentDeleteDto.getAppointmentNumber(),
                appointmentDeleteDto.getDate(),
                appointmentDeleteDto.getDoctorEmail());

        // 2. Check if the document actually exists before trying to read its ID
        if (appointmentOptional.isPresent()) {
            String id = appointmentOptional.get().getId();

            // 3. Delete the document from your MongoDB Atlas cluster
            appointmentRepo.deleteById(id);
            return true; // Return true indicating successful deletion
        }

        // Return false if no tracking appointment matches the provided composite
        // criteria
        return false;
    }

    @Override
    public int getAppointmensAmmunt() {
        return appointmentRepo.findAll().size();
    }

    @Override
    public List<AppointmentsTrendDto> getAppointmentVolumeTrends() {
        return appointmentRepo.getAppointmentVolumeTrends();
    }

    @Override
    public boolean updateStatus(UpdateApointementDto u) {
        // 1. Fetch the targeted appointment record from MongoDB
        var appointmentOptional = appointmentRepo.findByAppointmentNumberAndDateAndPatientEmailAndDoctorEmail(
                u.getAppointmentNumber(),
                u.getDate(),
                u.getPatientEmail(),
                u.getDoctorEmail());

        if (!appointmentOptional.isPresent()) {
            return false;
        }
        Appointments appointment = appointmentOptional.get();

        // 2. Update tracking status state
        appointment.setStatus(u.getStatus());

        // 3. Save back to MongoDB Atlas
        appointmentRepo.save(appointment);

        return true;
    }
}
