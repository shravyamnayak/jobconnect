package com.jobconnect.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SeekerProfileDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String headline;
    private Integer experienceYears;
    private String location;
    private String skills;   // comma-separated string; client may parse
    private String resumeUrl;
}
