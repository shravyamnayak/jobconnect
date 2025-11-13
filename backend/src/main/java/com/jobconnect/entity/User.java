package com.jobconnect.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false)
    private String password;

    private String fullName;

    private Instant createdAt = Instant.now();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name="user_id"),
        inverseJoinColumns = @JoinColumn(name="role_id"))
    private Set<Role> roles = new HashSet<>();

    /* ---------------- Seeker profile fields ---------------- */
    // optional profile fields for job seeker
    @Column(name = "phone")
    private String phone;

    @Column(name = "headline")
    private String headline; // e.g. "Frontend dev | React"

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "location")
    private String location;

    @Column(name = "skills", columnDefinition = "text")
    private String skills; // comma-separated list (simple storage)

    @Column(name = "resume_url")
    private String resumeUrl;
    /* ------------------------------------------------------ */
}
