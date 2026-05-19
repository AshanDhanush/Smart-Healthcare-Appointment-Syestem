package edu.uok.stu.model.dto;

import lombok.*;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AppointmentDeleteDto {

    private String doctorEmail;
    private LocalDate date;
    private int appointmentNumber;

}
