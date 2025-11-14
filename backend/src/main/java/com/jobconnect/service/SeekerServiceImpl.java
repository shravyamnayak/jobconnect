package com.jobconnect.service;

import com.jobconnect.dto.SeekerProfileDto;
import com.jobconnect.dto.UpdateSeekerProfileRequest;
import com.jobconnect.entity.User;
import com.jobconnect.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class SeekerServiceImpl implements SeekerService {

    private final UserRepository userRepository;

    public SeekerServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public SeekerProfileDto getMyProfile() {
        User user = getCurrentUser();
        return toDto(user);
    }

    @Override
    @Transactional
    public SeekerProfileDto updateMyProfile(UpdateSeekerProfileRequest req) {
        User user = getCurrentUser();

        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getHeadline() != null) user.setHeadline(req.getHeadline());
        if (req.getExperienceYears() != null) user.setExperienceYears(req.getExperienceYears());
        if (req.getLocation() != null) user.setLocation(req.getLocation());
        if (req.getSkills() != null) user.setSkills(req.getSkills());
        if (req.getResumeUrl() != null) user.setResumeUrl(req.getResumeUrl());

        return toDto(userRepository.save(user));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    private SeekerProfileDto toDto(User u) {
        return SeekerProfileDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phone(u.getPhone())
                .headline(u.getHeadline())
                .experienceYears(u.getExperienceYears())
                .location(u.getLocation())
                .skills(u.getSkills())
                .resumeUrl(u.getResumeUrl())
                .build();
    }
}
