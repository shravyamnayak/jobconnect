package com.jobconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobDto {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Company is required")
    private String company;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String salary;
    
    @NotBlank(message = "Job type is required")
    private String jobType;
    
    private String experienceLevel;
    private String skills;
    private Long postedById;
    private String postedByName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deadline;
}