package edu.uok.stu.services;

import edu.uok.stu.model.dto.*;
import jakarta.validation.Valid;

import java.util.List;

public interface AuthService {
    AuthResponse register(@Valid RegisterRequest registerRequest);

    AuthResponse login(LoginRequest request);

    List<UserDto> getDoctors();

    boolean updateProfile(String email, UpdateProfile updateProfile);
}
