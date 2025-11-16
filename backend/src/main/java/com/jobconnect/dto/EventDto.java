package com.jobconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Event type is required")
    private String eventType;
    
    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;
    
    private String location;
    private String link;
    private Long userId;
    private Long jobId;
    private String jobTitle;
    private Boolean reminderSent;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}