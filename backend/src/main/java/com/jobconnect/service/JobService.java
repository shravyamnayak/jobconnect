package com.jobconnect.service;

import com.jobconnect.dto.JobDto;
import java.util.List;

public interface JobService {
    JobDto createJob(JobDto jobDto);
    JobDto updateJob(Long id, JobDto jobDto);
    void deleteJob(Long id);
    JobDto getJobById(Long id);
    List<JobDto> getAllJobs();
    List<JobDto> getJobsByRecruiter(Long recruiterId);
    List<JobDto> searchJobs(String keyword);
    List<JobDto> getActiveJobs();
    List<JobDto> getJobsByRecruiterEmail(String email);
}