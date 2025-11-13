package com.jobconnect.service;

import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.entity.User;

public interface UserService {
    User register(RegisterRequest request);
}
