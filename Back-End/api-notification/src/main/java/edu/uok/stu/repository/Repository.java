package edu.uok.stu.repository;

import edu.uok.stu.model.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface Repository extends MongoRepository<Notification,String> {
    Optional<Notification> findByIdempotencyKey(String key);
}
