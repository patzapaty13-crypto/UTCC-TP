package org.example.utcctp.auth;

import org.example.utcctp.model.User;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;

public record UserProfile(
        UUID id,
        String username,
        String displayName,
        String email,
        String major,
        Integer academicYear,
        String profilePictureUrl,
        List<String> roles,
        Object skills,
        Object experiences,
        String linkedin,
        String github,
        String portfolio,
        String website
) {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static UserProfile from(User user) {
        List<String> roles = user.getRoles().stream().map(Enum::name).toList();
        Object skillsObj = null;
        Object expObj = null;
        try {
            if (user.getSkills() != null) skillsObj = mapper.readValue(user.getSkills(), Object.class);
            if (user.getExperiences() != null) expObj = mapper.readValue(user.getExperiences(), Object.class);
        } catch (Exception ignored) {}

        return new UserProfile(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getMajor(),
                user.getAcademicYear(),
                user.getProfilePictureUrl(),
                roles,
                skillsObj,
                expObj,
                user.getLinkedin(),
                user.getGithub(),
                user.getPortfolio(),
                user.getWebsite()
        );
    }
}
