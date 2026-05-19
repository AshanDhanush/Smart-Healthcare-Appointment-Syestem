package edu.uok.stu.model.dto;

import edu.uok.stu.util.Gender;
import edu.uok.stu.util.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {

    @NotBlank(message = "First Name is required")
    private String firstName;
    @NotBlank(message = "Last Name is required")
    private String lastName;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    private String phoneNumber;
    private String address;
    private Gender gender;
    private Role role;


    private String specialization;
    private String departmentCode;
    private String roomNumber;
    private String experience;
    private List<ShiftDto> availability;
}




