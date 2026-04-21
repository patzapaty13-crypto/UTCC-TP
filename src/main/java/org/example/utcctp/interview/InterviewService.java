package org.example.utcctp.interview;

import org.example.utcctp.api.dto.InterviewRequest;
import org.example.utcctp.api.dto.InterviewResponse;
import org.example.utcctp.model.Application;
import org.example.utcctp.model.Interview;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InterviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public InterviewService(InterviewRepository interviewRepository, ApplicationRepository applicationRepository, NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    public List<InterviewResponse> listByApplication(UUID applicationId) {
        return interviewRepository.findByApplicationIdOrderByStartsAtDesc(applicationId).stream().map(this::map).toList();
    }

    public InterviewResponse create(InterviewRequest request, User actor) {
        Application application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setScheduledBy(actor);
        interview.setInterviewType(request.interviewType());
        interview.setMeetingUrl(request.meetingUrl());
        interview.setLocation(request.location());
        interview.setStartsAt(parseInstant(request.startsAt()));
        interview.setEndsAt(request.endsAt() == null || request.endsAt().isBlank() ? null : parseInstant(request.endsAt()));
        if (request.status() != null && !request.status().isBlank()) {
            interview.setStatus(request.status());
        }
        interview.setNote(request.note());
        Interview saved = interviewRepository.save(interview);
        // TODO: Implement notification system
        // notificationService.notifyUser(application.getStudent(), "Interview scheduled", "Your interview has been scheduled.", NotificationType.APPLICATION);
        return map(saved);
    }

    public InterviewResponse update(UUID id, InterviewRequest request, User actor) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found"));
        if (request.interviewType() != null) interview.setInterviewType(request.interviewType());
        if (request.meetingUrl() != null) interview.setMeetingUrl(request.meetingUrl());
        if (request.location() != null) interview.setLocation(request.location());
        if (request.startsAt() != null) interview.setStartsAt(parseInstant(request.startsAt()));
        if (request.endsAt() != null && !request.endsAt().isBlank()) interview.setEndsAt(parseInstant(request.endsAt()));
        if (request.status() != null && !request.status().isBlank()) interview.setStatus(request.status());
        if (request.note() != null) interview.setNote(request.note());
        interview.setScheduledBy(actor);
        return map(interviewRepository.save(interview));
    }

    private Instant parseInstant(String value) {
        try {
            return Instant.parse(value);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid datetime format");
        }
    }

    private InterviewResponse map(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getApplication().getId(),
                interview.getInterviewType(),
                interview.getMeetingUrl(),
                interview.getLocation(),
                interview.getStartsAt(),
                interview.getEndsAt(),
                interview.getStatus(),
                interview.getNote(),
                interview.getCreatedAt()
        );
    }
}
