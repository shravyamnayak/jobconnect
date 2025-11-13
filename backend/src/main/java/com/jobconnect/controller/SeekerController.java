package com.jobconnect.controller;

import com.jobconnect.dto.SeekerProfileDto;
import com.jobconnect.dto.UpdateSeekerProfileRequest;
import com.jobconnect.service.SeekerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seeker")
public class SeekerController {

    private final SeekerService seekerService;

    public SeekerController(SeekerService seekerService) {
        this.seekerService = seekerService;
    }

    /**
     * GET /api/seeker/profile
     * Requires authenticated job seeker (your security config already restricts /api/seeker/** to ROLE_JOB_SEEKER)
     */
    @GetMapping("/profile")
    public ResponseEntity<SeekerProfileDto> getProfile() {
        SeekerProfileDto dto = seekerService.getMyProfile();
        return ResponseEntity.ok(dto);
    }

    /**
     * PUT /api/seeker/profile
     * Body: UpdateSeekerProfileRequest
     */
    @PutMapping("/profile")
    public ResponseEntity<SeekerProfileDto> updateProfile(@Valid @RequestBody UpdateSeekerProfileRequest request) {
        SeekerProfileDto updated = seekerService.updateMyProfile(request);
        return ResponseEntity.ok(updated);
    }
}
