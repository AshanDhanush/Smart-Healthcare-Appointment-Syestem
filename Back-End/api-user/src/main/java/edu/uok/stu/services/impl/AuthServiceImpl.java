package edu.uok.stu.services.impl;

import edu.uok.stu.model.dto.AuthResponse;
import edu.uok.stu.model.dto.LoginRequest;
import edu.uok.stu.model.dto.RegisterRequest;
import edu.uok.stu.model.dto.UserDto;
import edu.uok.stu.model.entity.User;
import edu.uok.stu.repository.UserRepository;
import edu.uok.stu.services.AuthService;
import edu.uok.stu.services.JWTService;
import edu.uok.stu.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;


    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        Role userRole = registerRequest.getRole() != null ? registerRequest.getRole() : Role.PATIENT;

        // 2. Build the User Entity
        var userBuilder = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .gender(registerRequest.getGender())
                .address(registerRequest.getAddress())
                .role(userRole)
                .dateOfBirth(registerRequest.getDateOfBirth() != null ? registerRequest.getDateOfBirth() : LocalDate.now());

        // 3. Conditionally add Doctor attributes
        if (userRole == Role.DOCTOR) {
            userBuilder.specialization(registerRequest.getSpecialization());
            userBuilder.departmentCode(registerRequest.getDepartmentCode());
        }

        User user = userBuilder.build();
        User savedUser = userRepository.save(user);

        // FIX: Add role to claims so Gateway can read it
        Map<String, Object> extraClaims = new HashMap<>();
        if (savedUser.getRole() != null) {
            extraClaims.put("role", savedUser.getRole().name());
        }

        var jwtToken = jwtService.generateToken(extraClaims, user);

        var userDto = UserDto.builder()
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .gender(savedUser.getGender())
                .dateOfBirth(savedUser.getDateOfBirth())
                .phoneNumber(savedUser.getPhoneNumber())
                .address(savedUser.getAddress())
                .role(savedUser.getRole())
                .build();

        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        // FIX: Add role to claims so Gateway can read it
        Map<String, Object> extraClaims = new HashMap<>();
        if (user.getRole() != null) {
            extraClaims.put("role", user.getRole().name());
        }

        var jwtToken = jwtService.generateToken(extraClaims, user);

        var userDto = UserDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .departmentCode(user.getDepartmentCode())
                .specialization(user.getSpecialization())
                .availability(user.getAvailability())
                .experience(user.getExperience())
                .build();


        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

}
