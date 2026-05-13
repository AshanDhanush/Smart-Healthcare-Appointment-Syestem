package edu.uok.stu.model.dto;

import edu.uok.stu.util.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AppointmentsDto {
    String patientName;
    String patientEmail;
    String doctorName;
    String doctorEmail;
    String doctorSpecialization;
    String departmentCode;
    String roomNumber;
    double appointmentFees;
    LocalDate date;
    LocalTime time;
    Status status;
}
