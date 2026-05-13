package edu.uok.stu.controller;

import edu.uok.stu.model.dto.CreateNotificationRequest;
import edu.uok.stu.service.SMTPEmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private SMTPEmailService smtpEmailService;

    @PostMapping("send/email")
    public ResponseEntity<?> sendEmail(@RequestBody CreateNotificationRequest createNotificationRequest){
          return ResponseEntity.ok(smtpEmailService.create(createNotificationRequest));

    }
}
