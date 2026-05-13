package edu.uok.stu.service;

import edu.uok.stu.model.dto.CreateNotificationRequest;

public interface SMTPEmailService {
    void sendEmail(String to, String subject, String body);
    void sendEmailWithAttachment(String to, String subject, String body, String attachmentName, byte[] attachmentData);

    boolean create(CreateNotificationRequest req);
}
