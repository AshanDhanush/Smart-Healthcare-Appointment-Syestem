package edu.uok.stu.services.impl;

import edu.uok.stu.model.dto.UserDto;
import edu.uok.stu.model.entity.User;
import edu.uok.stu.repository.UserRepository;
import edu.uok.stu.services.AdminService;
import edu.uok.stu.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor

public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public Map<String, Object> getStats() {
        int patientsAmount = userRepository.countByRole(Role.PATIENT);
        int doctorsAmount = userRepository.countByRole(Role.DOCTOR);
        Map<String , Object> stats = new HashMap<>();
        stats.put("patients" ,  patientsAmount);
        stats.put("doctors" , doctorsAmount);
        return stats;
    }

    @Override
    public List<UserDto> getDoctors() {
        List<User> doctorsEntities = userRepository.findByRole(Role.DOCTOR);
        List<UserDto>  doctorDtos = new ArrayList<>();

        for(User u : doctorsEntities){
            var userDto = UserDto.builder()
                    .firstName(u.getFirstName())
                    .lastName(u.getLastName())
                    .email(u.getEmail())
                    .gender(u.getGender())
                    .dateOfBirth(u.getDateOfBirth())
                    .phoneNumber(u.getPhoneNumber())
                    .address(u.getAddress())
                    .role(u.getRole())
                    .departmentCode(u.getDepartmentCode())
                    .specialization(u.getSpecialization())
                    .availability(u.getAvailability())
                    .roomNumber(u.getRoomNumber())
                    .experience(u.getExperience())
                    .build();
            doctorDtos.add(userDto);

        }
        return doctorDtos;
    }

    @Override
    public boolean deleteUser(String email) {
        long deleteCount = userRepository.deleteByEmail(email);
        return deleteCount > 0;
    }

    @Override
    public List<UserDto> getPatients() {
        List<User> patientsEntities = userRepository.findByRole(Role.PATIENT);
        List<UserDto> patientDtos = new ArrayList<>();

        for(User u : patientsEntities){
            var userDto = UserDto.builder()
                    .firstName(u.getFirstName())
                    .lastName(u.getLastName())
                    .email(u.getEmail())
                    .gender(u.getGender())
                    .dateOfBirth(u.getDateOfBirth())
                    .phoneNumber(u.getPhoneNumber())
                    .address(u.getAddress())
                    .role(u.getRole())
                    .departmentCode(u.getDepartmentCode())
                    .specialization(u.getSpecialization())
                    .availability(u.getAvailability())
                    .roomNumber(u.getRoomNumber())
                    .experience(u.getExperience())
                    .build();
            patientDtos.add(userDto);

        }
        return patientDtos;
    }


}
