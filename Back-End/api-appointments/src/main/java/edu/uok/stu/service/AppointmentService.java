package edu.uok.stu.service;

import edu.uok.stu.model.dto.AppointmentDeleteDto;
import edu.uok.stu.model.dto.AppointmentsDto;
import edu.uok.stu.model.dto.AppointmentsTrendDto;
import edu.uok.stu.model.dto.UpdateApointementDto;
import edu.uok.stu.util.Status;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentsDto> getAllAppointments();
    boolean addAppointments(AppointmentsDto appointmentsDto);

    String checkAvailabilty(LocalDate date, String doctorEmail);

    List<AppointmentsDto> getPatientAppointments(String patientEmail);

    boolean deleteAppointment(AppointmentDeleteDto appointmentDeleteDto);

    int getAppointmensAmmunt();

    List<AppointmentsTrendDto> getAppointmentVolumeTrends();

    boolean updateStatus(UpdateApointementDto updateApointementDto);
}
