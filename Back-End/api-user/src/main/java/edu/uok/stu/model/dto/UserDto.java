package edu.uok.stu.model.dto;

import edu.uok.stu.util.Gender;
import edu.uok.stu.util.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private String address;
    private Role role;
    private String departmentCode;
    private String specialization;
    private List<ShiftDto> availability;
    private String roomNumber;
    private String experience;
}
