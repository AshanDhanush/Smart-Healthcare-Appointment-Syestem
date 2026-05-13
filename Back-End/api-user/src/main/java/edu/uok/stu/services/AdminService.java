package edu.uok.stu.services;

import edu.uok.stu.model.dto.UserDto;

import java.util.List;
import java.util.Map;

import java.util.Optional;

public interface AdminService {
    Map<String, Object> getStats();

    List<UserDto> getDoctors();

    boolean deleteDoctor(String email);
}
