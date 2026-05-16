package edu.uok.stu.services;

import edu.uok.stu.model.dto.AuthResponse;
import edu.uok.stu.model.dto.LoginRequest;
import edu.uok.stu.model.dto.RegisterRequest;
import edu.uok.stu.model.dto.UserDto;
import jakarta.validation.Valid;

import java.util.List;

public interface AuthService {
    AuthResponse register(@Valid RegisterRequest registerRequest);

    AuthResponse login(LoginRequest request);

    List<UserDto> getDoctors();
}
