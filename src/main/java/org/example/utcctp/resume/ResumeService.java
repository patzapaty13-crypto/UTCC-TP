package org.example.utcctp.resume;

import org.example.utcctp.api.dto.ResumeResponse;
import org.example.utcctp.model.Resume;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ResumeRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public ResumeResponse getResumeByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        Resume resume = resumeRepository.findByUser(user)
                .orElseGet(() -> {
                    Resume r = new Resume();
                    r.setUser(user);
                    return r;
                });
        
        return mapToResponse(resume);
    }

    public ResumeResponse updateResume(UUID userId, Map<String, String> data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        Resume resume = resumeRepository.findByUser(user)
                .orElseGet(() -> {
                    Resume r = new Resume();
                    r.setUser(user);
                    return r;
                });

        if (data.containsKey("summary")) resume.setSummary(data.get("summary"));
        if (data.containsKey("skills")) resume.setSkills(data.get("skills"));
        if (data.containsKey("education")) resume.setEducation(data.get("education"));
        if (data.containsKey("experience")) resume.setExperience(data.get("experience"));
        if (data.containsKey("portfolioUrl")) resume.setPortfolioUrl(data.get("portfolioUrl"));

        resumeRepository.save(resume);
        return mapToResponse(resume);
    }

    private ResumeResponse mapToResponse(Resume r) {
        return new ResumeResponse(
            r.getId(),
            r.getUser().getDisplayName(),
            r.getUser().getEmail(),
            r.getSummary(),
            r.getSkills(),
            r.getEducation(),
            r.getExperience(),
            r.getPortfolioUrl()
        );
    }
}
