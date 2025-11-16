package com.jobconnect.service;

import com.jobconnect.dto.UserDto;
import com.jobconnect.entity.User;
import java.util.List;

public interface UserService {
    UserDto registerUser(UserDto userDto);
    UserDto getUserById(Long id);
    UserDto getUserByEmail(String email);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    List<UserDto> getAllUsers();
    User getCurrentUser();
}