package com.security.scanner.config;

import com.security.scanner.entity.User;
import com.security.scanner.entity.enums.Role;
import com.security.scanner.repository.NotificationRepository;
import com.security.scanner.repository.ScanRepository;
import com.security.scanner.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Initializes the default system user for database relational integrity.
 * Hardcoded mock scans have been removed so all data and risk scores remain 100% natural,
 * live, and generated dynamically from real target scans.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ScanRepository scanRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ScanRepository scanRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.scanRepository = scanRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Connecting to database and initializing default security operator account...");

            // Single unified system role: Security Auditor / Analyst
            User operator = new User(
                    "analyst",
                    "analyst@cybershield.local",
                    passwordEncoder.encode("password123"),
                    Role.ROLE_USER
            );
            userRepository.save(operator);

            log.info("Database initialized successfully with default unified operator profile. No mock scans loaded.");
        }
    }
}
