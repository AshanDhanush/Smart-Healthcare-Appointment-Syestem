package edu.uok.stu.service;

import edu.uok.stu.model.dto.AppointmentsDto;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentsDto> getAllAppointments();
    boolean addAppointments(AppointmentsDto appointmentsDto);

    String checkAvailabilty(LocalDate date, String doctorEmail);
}
