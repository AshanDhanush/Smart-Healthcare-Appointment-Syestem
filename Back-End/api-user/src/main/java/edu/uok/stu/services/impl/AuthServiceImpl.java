package edu.uok.stu.services.impl;

import edu.uok.stu.model.dto.*;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
        var user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .gender(registerRequest.getGender())
                .address(registerRequest.getAddress())
                .role(registerRequest.getRole())
                .dateOfBirth(LocalDate.now())

                // FIX: Map Doctor specific fields here so they save to MongoDB!
                .specialization(registerRequest.getSpecialization())
                .departmentCode(registerRequest.getDepartmentCode())
                .roomNumber(registerRequest.getRoomNumber())
                .experience(registerRequest.getExperience())
                .availability(registerRequest.getAvailability())
                .build();

        User savedUser = userRepository.save(user);


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
                // FIX: Ensure the returned response object also includes doctor fields
                .specialization(savedUser.getSpecialization())
                .departmentCode(savedUser.getDepartmentCode())
                .roomNumber(savedUser.getRoomNumber())
                .experience(savedUser.getExperience())
                .availability(savedUser.getAvailability())
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
                .build();


        return AuthResponse.builder()
                .token(jwtToken)
                .user(userDto)
                .build();
    }

    @Override
    public List<UserDto> getDoctors() {
        return userRepository.findByRole(Role.DOCTOR).stream()
                .map(u -> UserDto.builder()
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .email(u.getEmail())
                        .dateOfBirth(u.getDateOfBirth())
                        .gender(u.getGender())
                        .phoneNumber(u.getPhoneNumber())
                        .address(u.getAddress())
                        .role(u.getRole())
                        .departmentCode(u.getDepartmentCode())
                        .specialization(u.getSpecialization())
                        .availability(u.getAvailability())
                        .roomNumber(u.getRoomNumber())
                        .experience(u.getExperience())
                        .build())
                .toList();
    }

    @Override
    public boolean updateProfile(String email, UpdateProfile updateProfile) {
        var userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (updateProfile.getFirstName() != null && !updateProfile.getFirstName().isBlank()) {
                user.setFirstName(updateProfile.getFirstName());
            }
            if (updateProfile.getLastName() != null && !updateProfile.getLastName().isBlank()) {
                user.setLastName(updateProfile.getLastName());
            }
            if (updateProfile.getPhoneNumber() != null && !updateProfile.getPhoneNumber().isBlank()) {
                user.setPhoneNumber(updateProfile.getPhoneNumber());
            }
            if (updateProfile.getAddress() != null && !updateProfile.getAddress().isBlank()) {
                user.setAddress(updateProfile.getAddress());
            }
            if (updateProfile.getGender() != null) {
                user.setGender(updateProfile.getGender());
            }
            if (updateProfile.getDateOfBirth() != null) {
                user.setDateOfBirth(updateProfile.getDateOfBirth());
            }
            if (user.getRole() == edu.uok.stu.util.Role.DOCTOR) {
                if (updateProfile.getSpecialization() != null && !updateProfile.getSpecialization().isBlank()) {
                    user.setSpecialization(updateProfile.getSpecialization());
                }
                if (updateProfile.getDepartmentCode() != null && !updateProfile.getDepartmentCode().isBlank()) {
                    user.setDepartmentCode(updateProfile.getDepartmentCode());
                }
                if (updateProfile.getRoomNumber() != null && !updateProfile.getRoomNumber().isBlank()) {
                    user.setRoomNumber(updateProfile.getRoomNumber());
                }
                if (updateProfile.getAvailability() != null && !updateProfile.getAvailability().isBlank()) {
                    user.setAvailability(updateProfile.getAvailability());
                }
                if (updateProfile.getExperience() != null && !updateProfile.getExperience().isBlank()) {
                    user.setExperience(updateProfile.getExperience());
                }
            }


            userRepository.save(user);
            return true;
        }

        return false;
    }


}
