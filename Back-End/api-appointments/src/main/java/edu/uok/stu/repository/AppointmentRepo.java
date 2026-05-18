package edu.uok.stu.repository;

import edu.uok.stu.model.dto.AppointmentsTrendDto;
import edu.uok.stu.model.entity.Appointments;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepo extends MongoRepository<Appointments,String> {

    List<Appointments> findByDoctorEmail(String email);

    List<Appointments> findByDoctorEmailAndDate(String email, LocalDate date);

    List<Appointments> findByPatientEmail(String patientEmail);

    long deleteByAppointmentNumberAndDate(int appointmentNumber, LocalDate date);

    @Aggregation(pipeline = {
            "{ '$group': { '_id': '$date', 'totalCount': { '$sum': 1 } } }",
            "{ '$project': { 'date': '$_id', 'totalCount': 1, '_id': 0 } }",
            "{ '$sort': { 'date': 1 } }" // Keeps dates in chronological order
    })
    List<AppointmentsTrendDto> getAppointmentVolumeTrends();
}
