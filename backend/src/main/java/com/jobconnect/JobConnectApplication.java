package com.jobconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.TimeZone;

@SpringBootApplication
public class JobConnectApplication {

    public static void main(String[] args) {

        // Force JVM timezone to UTC
        System.setProperty("user.timezone", "UTC");
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        SpringApplication.run(JobConnectApplication.class, args);
    }

    // 🔥 PASSWORD MATCH TEST — THIS IS IMPORTANT
    @Bean
    public CommandLineRunner testPassword(PasswordEncoder encoder) {
        return args -> {
            String raw = "password123";
            String stored = "$2a$10$IK5KWb.Sw57t12d8ay6jXucrlWoXe23XOCpoY7m35GXJr7M14xnG2";

            System.out.println("====================================");
            System.out.println("Testing BCrypt password match:");
            System.out.println("Raw password     : " + raw);
            System.out.println("Stored hash      : " + stored);
            System.out.println("Matches?         : " + encoder.matches(raw, stored));
            System.out.println("====================================");
        };
    }
}
