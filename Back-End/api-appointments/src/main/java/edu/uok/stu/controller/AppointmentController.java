package edu.uok.stu.controller;

import edu.uok.stu.model.dto.AppointmentsDto;
import edu.uok.stu.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor

public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/get/all")
    public List<AppointmentsDto> getAllAppointments(){
        return appointmentService.getAllAppointments();
    }

    @PostMapping("add")
        public ResponseEntity<?> addAppointments(@RequestBody AppointmentsDto appointmentsDto){
            return ResponseEntity.ok(appointmentService.addAppointments(appointmentsDto));
        }



}
