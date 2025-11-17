package com.jobconnect.controller;

import com.jobconnect.dto.JobDto;
import com.jobconnect.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    
    private final JobService jobService;
    
    @PostMapping
    @PreAuthorize("hasAnyAuthority('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> createJob(@Valid @RequestBody JobDto jobDto, Authentication authentication) {
        try {
            System.out.println("=== Creating Job ===");
            System.out.println("Job DTO: " + jobDto);
            System.out.println("User: " + authentication.getName());
            
            JobDto createdJob = jobService.createJob(jobDto);
            
            System.out.println("Job created successfully with ID: " + createdJob.getId());
            return ResponseEntity.ok(createdJob);
        } catch (Exception e) {
            System.err.println("Error creating job: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @Valid @RequestBody JobDto jobDto) {
        try {
            JobDto updatedJob = jobService.updateJob(id, jobDto);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            JobDto job = jobService.getJobById(id);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<JobDto>> getActiveJobs() {
        System.out.println("=== Fetching Active Jobs ===");
        List<JobDto> jobs = jobService.getActiveJobs();
        System.out.println("Found " + jobs.size() + " active jobs");
        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<JobDto>> searchJobs(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }
    
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobDto>> getJobsByRecruiter(@PathVariable Long recruiterId) {
        System.out.println("=== Fetching Jobs for Recruiter ID: " + recruiterId + " ===");
        List<JobDto> jobs = jobService.getJobsByRecruiter(recruiterId);
        System.out.println("Found " + jobs.size() + " jobs for this recruiter");
        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/my-jobs")
    @PreAuthorize("hasAnyAuthority('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> getMyJobs(Authentication authentication) {
        try {
            String email = authentication.getName();
            System.out.println("=== Fetching Jobs for User: " + email + " ===");
            List<JobDto> jobs = jobService.getJobsByRecruiterEmail(email);
            System.out.println("Found " + jobs.size() + " jobs");
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            System.err.println("Error fetching my jobs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}