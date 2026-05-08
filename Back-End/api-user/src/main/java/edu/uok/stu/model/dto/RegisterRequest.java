package edu.uok.stu.model.dto;

import edu.uok.stu.util.DepartmentCode;
import edu.uok.stu.util.Gender;
import edu.uok.stu.util.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder


public class RegisterRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private String address;
    @NotNull(message = "Role is required")
    private Role role;

    private String specialization;
    private DepartmentCode departmentCode;




}
