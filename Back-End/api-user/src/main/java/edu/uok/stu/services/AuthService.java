package edu.uok.stu.services;

import edu.uok.stu.model.dto.AuthResponse;
import edu.uok.stu.model.dto.LoginRequest;
import edu.uok.stu.model.dto.RegisterRequest;
import jakarta.validation.Valid;

public interface AuthService {
    AuthResponse register(@Valid RegisterRequest registerRequest);

    AuthResponse login(LoginRequest request);
}
