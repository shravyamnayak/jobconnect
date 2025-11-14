package com.jobconnect.service;

import com.jobconnect.dto.SeekerProfileDto;
import com.jobconnect.dto.UpdateSeekerProfileRequest;

public interface SeekerService {
    SeekerProfileDto getMyProfile();
    SeekerProfileDto updateMyProfile(UpdateSeekerProfileRequest req);
}
