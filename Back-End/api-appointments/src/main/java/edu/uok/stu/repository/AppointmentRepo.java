package edu.uok.stu.repository;

import edu.uok.stu.model.dto.AppointmentsTrendDto;
import edu.uok.stu.model.entity.Appointments;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface AppointmentRepo extends MongoRepository<Appointments,String> {


    List<Appointments> findByDoctorEmailAndDate(String email, LocalDate date);

    List<Appointments> findByPatientEmail(String patientEmail);


    @Aggregation(pipeline = {
            "{ '$group': { '_id': '$date', 'totalCount': { '$sum': 1 } } }",
            "{ '$project': { 'date': '$_id', 'totalCount': 1, '_id': 0 } }",
            "{ '$sort': { 'date': 1 } }" // Keeps dates in chronological order
    })
    List<AppointmentsTrendDto> getAppointmentVolumeTrends();


    Optional<Appointments> findByAppointmentNumberAndDateAndPatientEmailAndDoctorEmail(
            int appointmentNumber,
            LocalDate date,
            String patientEmail,
            String doctorEmail
    );

    Optional<Appointments> findByAppointmentNumberAndDateAndDoctorEmail(
            int appointmentNumber,
            LocalDate date,
            String doctorEmail
    );
}

   
