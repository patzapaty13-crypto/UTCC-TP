package org.example.utcctp.config;

import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            // Create Demo Users
            createUser(userRepository, passwordEncoder, "student1", "pass123", "Demo Student", RoleType.STUDENT, "Information Technology", 3);
            createUser(userRepository, passwordEncoder, "advisor1", "pass123", "Dr. Advisor", RoleType.ADVISOR, "Computer Science", null);
            createUser(userRepository, passwordEncoder, "staff1", "pass123", "Faculty Staff", RoleType.STAFF, "Academic Affairs", null);
            createUser(userRepository, passwordEncoder, "admin1", "pass123", "System Admin", RoleType.ADMIN, "IT Support", null);
        };
    }

    private void createUser(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                           String username, String password, String displayName, 
                           RoleType role, String major, Integer year) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setEmail(username + "@utcc.ac.th");
        user.setMajor(major);
        user.setAcademicYear(year);
        user.setActive(true);
        user.setRoles(Set.of(role));
        userRepository.save(user);
    }
}
