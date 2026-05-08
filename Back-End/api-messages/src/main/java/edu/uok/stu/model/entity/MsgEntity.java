package edu.uok.stu.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "PatientMessages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class MsgEntity {
    private String id;
    private String name;
    private String email;
    private String message;
}
