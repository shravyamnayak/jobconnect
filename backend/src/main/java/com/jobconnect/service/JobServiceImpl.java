package com.jobconnect.service;

import com.jobconnect.dto.JobDto;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.User;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {
    
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional
    public JobDto createJob(JobDto jobDto) {
        User currentUser = userService.getCurrentUser();
        
        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setCompany(jobDto.getCompany());
        job.setLocation(jobDto.getLocation());
        job.setSalary(jobDto.getSalary());
        job.setJobType(jobDto.getJobType());
        job.setExperienceLevel(jobDto.getExperienceLevel());
        job.setSkills(jobDto.getSkills());
        job.setPostedBy(currentUser);
        job.setStatus(jobDto.getStatus() != null ? jobDto.getStatus() : "ACTIVE");
        job.setDeadline(jobDto.getDeadline());
        
        Job savedJob = jobRepository.save(job);
        return convertToDto(savedJob);
    }
    
    @Override
    @Transactional
    public JobDto updateJob(Long id, JobDto jobDto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!job.getPostedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own job postings");
        }
        
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setCompany(jobDto.getCompany());
        job.setLocation(jobDto.getLocation());
        job.setSalary(jobDto.getSalary());
        job.setJobType(jobDto.getJobType());
        job.setExperienceLevel(jobDto.getExperienceLevel());
        job.setSkills(jobDto.getSkills());
        job.setStatus(jobDto.getStatus());
        job.setDeadline(jobDto.getDeadline());
        
        Job updatedJob = jobRepository.save(job);
        return convertToDto(updatedJob);
    }
    
    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!job.getPostedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own job postings");
        }
        
        jobRepository.deleteById(id);
    }
    
    @Override
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return convertToDto(job);
    }
    
    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<JobDto> getJobsByRecruiter(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByPostedBy(recruiter).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<JobDto> searchJobs(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getActiveJobs();
        }
        return jobRepository.searchJobs(keyword).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<JobDto> getActiveJobs() {
        return jobRepository.findActiveJobsOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private JobDto convertToDto(Job job) {
        JobDto dto = modelMapper.map(job, JobDto.class);
        dto.setPostedById(job.getPostedBy().getId());
        dto.setPostedByName(job.getPostedBy().getFullName());
        return dto;
    }

     @Override
    public List<JobDto> getJobsByRecruiterEmail(String email) {
        User recruiter = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return jobRepository.findByPostedByIdOrderByCreatedAtDesc(recruiter.getId()).stream()
            .map(job -> modelMapper.map(job, JobDto.class))
            .collect(Collectors.toList());
    }
}