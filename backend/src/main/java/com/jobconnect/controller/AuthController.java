package com.jobconnect.controller;

import com.jobconnect.config.JwtTokenProvider;
import com.jobconnect.dto.AuthRequest;
import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.entity.User;
import com.jobconnect.service.UserService;
import com.jobconnect.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthController(
            UserService userService,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User createdUser = userService.register(request);
            return ResponseEntity.ok("User registered with id: " + createdUser.getId());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Authenticate username + password
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
            authenticationManager.authenticate(authToken);

            // Find user
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Extract roles
            List<String> roles = user.getRoles()
                    .stream()
                    .map(r -> r.getName())
                    .toList();

            // Generate JWT
            String token = tokenProvider.generateToken(user.getEmail(), roles);

            // Return combined response
            AuthResponse response = new AuthResponse(token, user.getEmail(), roles);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
