package edu.uok.stu.repository;

import edu.uok.stu.model.entity.User;
import edu.uok.stu.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);

    int countByRole(Role role);

    List<User> findByRole(Role role);

    long deleteByEmail(String email);
}
