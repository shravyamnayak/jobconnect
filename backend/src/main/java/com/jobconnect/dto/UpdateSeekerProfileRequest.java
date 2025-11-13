package com.jobconnect.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateSeekerProfileRequest {
    private String fullName;
    private String phone;
    private String headline;
    private Integer experienceYears;
    private String location;
    private String skills;   // comma-separated or JSON string as you prefer
    private String resumeUrl;
}
