package edu.uok.stu.model.dto;

import edu.uok.stu.util.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UpdateApointementDto {

    private String patientEmail;
    private String doctorEmail;
    private Status status;
    private int appointmentNumber;
    private LocalDate date;

}
