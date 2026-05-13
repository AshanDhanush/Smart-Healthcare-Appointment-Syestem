package edu.uok.stu.repository;

import edu.uok.stu.model.entity.Appointments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepo extends MongoRepository<Appointments,String> {

}
