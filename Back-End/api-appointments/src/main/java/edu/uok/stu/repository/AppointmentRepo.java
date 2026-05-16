package edu.uok.stu.repository;

import edu.uok.stu.model.entity.Appointments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepo extends MongoRepository<Appointments,String> {

    List<Appointments> findByDoctorEmail(String email);

    List<Appointments> findByDoctorEmailAndDate(String email, LocalDate date);
}
