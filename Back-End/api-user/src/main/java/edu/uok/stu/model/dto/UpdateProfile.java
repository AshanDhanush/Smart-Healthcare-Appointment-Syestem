package edu.uok.stu.model.dto;

import edu.uok.stu.util.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UpdateProfile {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private Gender gender;
    private LocalDate dateOfBirth;

    private String specialization;
    private String departmentCode;
    private String roomNumber;
    private String availability;
    private String experience;
}
