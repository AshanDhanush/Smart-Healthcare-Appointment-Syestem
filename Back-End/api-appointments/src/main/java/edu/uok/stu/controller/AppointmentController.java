package edu.uok.stu.controller;

import edu.uok.stu.model.dto.AppointmentsDto;
import edu.uok.stu.model.dto.AppointmentsTrendDto;
import edu.uok.stu.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/check/availability")
    public ResponseEntity<String> checkAvailability(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @RequestParam("doctorEmail") String doctorEmail){
        return ResponseEntity.ok(appointmentService.checkAvailabilty(date,doctorEmail));

    }

    @GetMapping("/get/patient")
    public List<AppointmentsDto> getPatientAppointments(@RequestParam("patientEmail") String patientEmail){
        return appointmentService.getPatientAppointments(patientEmail);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?>  deleteAppointment(@RequestParam("appointmentNumber") int appointmentNumber , @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date){
        return ResponseEntity.ok(appointmentService.deleteAppointment(appointmentNumber,date));
    }

    @GetMapping("/get/appointment/amount")
    public int getAppointmentsAmount(){
        return appointmentService.getAppointmensAmmunt();
    }

    @GetMapping("/admin/analytics/trends")
    public ResponseEntity<List<AppointmentsTrendDto>> getVolumeTrends() {
        return ResponseEntity.ok(appointmentService.getAppointmentVolumeTrends());
    }



}
