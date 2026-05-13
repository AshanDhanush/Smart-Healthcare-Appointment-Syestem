package edu.uok.stu.service.impl;

import edu.uok.stu.model.dto.CreateNotificationRequest;
import edu.uok.stu.model.entity.Notification;
import edu.uok.stu.repository.Repository;
import edu.uok.stu.service.SMTPEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j


public class SMTPEmailServiceImpl implements SMTPEmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    // Use manual constructor to allow @Value injection alongside the bean
    public SMTPEmailServiceImpl(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    @Autowired
    private Repository repository;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendEmailWithAttachment(String to, String subject, String body, String attachmentName, byte[] attachmentData) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false); // false = plain text, true = HTML

            // Add attachment if present
            if (attachmentData != null && attachmentData.length > 0 && attachmentName != null) {
                ByteArrayResource resource = new ByteArrayResource(attachmentData);
                helper.addAttachment(attachmentName, resource);
                log.info("Added attachment: {} ({} bytes)", attachmentName, attachmentData.length);
            }

            mailSender.send(mimeMessage);
            log.info("Email with attachment sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email with attachment to: {}", to, e);
            throw new RuntimeException("Failed to send email with attachment", e);
        }
    }

    @Override
    public boolean create(CreateNotificationRequest req) {
        try {
            Notification notification = Notification.builder()
                    .userId(req.getUserId())
                    .toUser(req.getToUser())
                    .subject(req.getSubject())
                    .body(req.getBody())
                    .idempotencyKey(req.getIdempotencyKey())
                    .attachmentName(req.getAttachmentName())
                    .attachmentData(req.getAttachmentData())
                    .status("SENT")
                    .build();

            repository.save(notification);
            return true;
        } catch (Exception e) {
            log.error("Failed to save notification record", e);
            return false;
        }
    }

}
