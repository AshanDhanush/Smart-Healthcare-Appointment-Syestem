package edu.uok.stu.controller;


import edu.uok.stu.model.dto.UpdateProfile;
import edu.uok.stu.model.dto.UserDto;
import edu.uok.stu.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/admin")

public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String,Object>> getStats(){
        Map<String, Object> stats = adminService.getStats();
        if (stats == null || stats.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/get/doctors")
    public ResponseEntity<List<UserDto>> getDoctors(){
        return ResponseEntity.ok(adminService.getDoctors());
    }

    @DeleteMapping("/delete/user/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email){
        boolean delete = adminService.deleteUser(email);
        if(delete){
            return ResponseEntity.ok("User with email " + email + " deleted successfully");
        }
        else {
            return  ResponseEntity.ok("User with email " + email + " deleted unsuccessfully");
        }

    }

    @GetMapping("/get/patients")
    public ResponseEntity<List<UserDto>> getPatients(){ return ResponseEntity.ok(adminService.getPatients());}








}
