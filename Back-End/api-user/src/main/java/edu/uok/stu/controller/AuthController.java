package edu.uok.stu.controller;

import edu.uok.stu.model.dto.AuthResponse;
import edu.uok.stu.model.dto.LoginRequest;
import edu.uok.stu.model.dto.RegisterRequest;
import edu.uok.stu.model.dto.UserDto;
import edu.uok.stu.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest registerRequest){
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/get/doctors")
    public List<UserDto> getDoctors(){
        return authService.getDoctors();
    }

}
