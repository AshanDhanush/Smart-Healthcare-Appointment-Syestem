package edu.uok.stu.model.entity;

import edu.uok.stu.util.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "Appointments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Appointments {
    @Id
    String id;
    String patientName;
    String patientEmail;
    String doctorName;
    String doctorEmail;
    String doctorSpecialization;
    String departmentCode;
    String roomNumber;
    double appointmentFees;
    LocalDate date;
    int appointmentNumber;
    Status status;



}
