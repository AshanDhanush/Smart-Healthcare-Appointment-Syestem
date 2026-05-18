package edu.uok.stu.model.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AppointmentsTrendDto {
    private String date; // Formatted as "YYYY-MM-DD" or day name for the chart axis
    private long totalCount;
}
