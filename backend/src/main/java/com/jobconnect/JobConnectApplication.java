package com.jobconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class JobConnectApplication {

    public static void main(String[] args) {

        // 🔥 Master override — JVM will NEVER use Asia/Calcutta again
        System.setProperty("user.timezone", "UTC");
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        SpringApplication.run(JobConnectApplication.class, args);
    }
}
