package edu.uok.stu.service;

import edu.uok.stu.model.dto.AppointmentsDto;
import edu.uok.stu.model.dto.AppointmentsTrendDto;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentsDto> getAllAppointments();
    boolean addAppointments(AppointmentsDto appointmentsDto);

    String checkAvailabilty(LocalDate date, String doctorEmail);

    List<AppointmentsDto> getPatientAppointments(String patientEmail);

    boolean deleteAppointment(int appointmentNumber, LocalDate date);

    int getAppointmensAmmunt();

    List<AppointmentsTrendDto> getAppointmentVolumeTrends();
}
