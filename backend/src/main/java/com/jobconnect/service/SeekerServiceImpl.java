package com.jobconnect.service;

import com.jobconnect.dto.SeekerProfileDto;
import com.jobconnect.dto.UpdateSeekerProfileRequest;
import com.jobconnect.entity.User;
import com.jobconnect.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class SeekerServiceImpl implements SeekerService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public SeekerServiceImpl(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public SeekerProfileDto getSeekerProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return modelMapper.map(user, SeekerProfileDto.class);
    }

    @Override
    public SeekerProfileDto updateSeekerProfile(String email, UpdateSeekerProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update allowed fields
        user.setPhone(request.getPhone());
        user.setHeadline(request.getHeadline());
        user.setExperienceYears(request.getExperienceYears());
        user.setLocation(request.getLocation());
        user.setSkills(request.getSkills());
        user.setResumeUrl(request.getResumeUrl());

        userRepository.save(user);

        return modelMapper.map(user, SeekerProfileDto.class);
    }
}
