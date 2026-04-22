package org.example.utcctp.interview;

import org.example.utcctp.api.dto.InterviewRequest;
import org.example.utcctp.model.Application;
import org.example.utcctp.model.ApplicationStatus;
import org.example.utcctp.model.Interview;
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

    public InterviewService(InterviewRepository interviewRepository, ApplicationRepository applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<Interview> getStudentInterviews(UUID studentId) {
        return interviewRepository.findByStudentIdOrderByInterviewDateDesc(studentId);
    }

    public List<Interview> getCompanyInterviews(UUID companyId) {
        return interviewRepository.findByCompanyIdOrderByInterviewDateDesc(companyId);
    }

    public Interview getInterview(UUID id) {
        return interviewRepository.findById(id).orElse(null);
    }

    public Interview createInterview(InterviewRequest request) {
        // Get application to extract student, company, position IDs
        Application application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        
        Interview interview = new Interview();
        interview.setApplicationId(request.applicationId());
        interview.setStudentId(application.getStudent().getId());
        interview.setCompanyId(application.getInternshipPosition().getCompany().getId());
        interview.setPositionId(application.getInternshipPosition().getId());
        interview.setInterviewType(request.interviewType());
        interview.setInterviewDate(request.interviewDate());
        interview.setInterviewDuration(request.interviewDuration() != null ? request.interviewDuration() : 60);
        interview.setLocation(request.location());
        interview.setVideoLink(request.videoLink());
        interview.setMeetingId(request.meetingId());
        interview.setStatus(request.status() != null ? request.status() : "SCHEDULED");
        interview.setInterviewerName(request.interviewerName());
        interview.setInterviewerEmail(request.interviewerEmail());
        interview.setInterviewerPhone(request.interviewerPhone());
        interview.setInstructions(request.instructions());
        interview.setPreparationNotes(request.preparationNotes());
        interview.setFeedback(request.feedback());
        interview.setRating(request.rating());
        
        Interview saved = interviewRepository.save(interview);
        
        // Update application status to INTERVIEW_SCHEDULED
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);
        
        return saved;
    }

    public Interview updateInterview(UUID id, InterviewRequest updates) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found"));

        if (updates.interviewDate() != null) {
            interview.setInterviewDate(updates.interviewDate());
        }
        if (updates.interviewType() != null) {
            interview.setInterviewType(updates.interviewType());
        }
        if (updates.location() != null) {
            interview.setLocation(updates.location());
        }
        if (updates.videoLink() != null) {
            interview.setVideoLink(updates.videoLink());
        }
        if (updates.status() != null) {
            interview.setStatus(updates.status());
            
            // If interview is completed, update application status
            if ("COMPLETED".equalsIgnoreCase(updates.status())) {
                Application application = applicationRepository.findById(interview.getApplicationId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
                application.setStatus(ApplicationStatus.INTERVIEW_COMPLETED);
                applicationRepository.save(application);
            }
        }
        if (updates.instructions() != null) {
            interview.setInstructions(updates.instructions());
        }
        if (updates.interviewDuration() != null) {
            interview.setInterviewDuration(updates.interviewDuration());
        }
        if (updates.meetingId() != null) {
            interview.setMeetingId(updates.meetingId());
        }
        if (updates.interviewerName() != null) {
            interview.setInterviewerName(updates.interviewerName());
        }
        if (updates.interviewerEmail() != null) {
            interview.setInterviewerEmail(updates.interviewerEmail());
        }
        if (updates.interviewerPhone() != null) {
            interview.setInterviewerPhone(updates.interviewerPhone());
        }
        if (updates.preparationNotes() != null) {
            interview.setPreparationNotes(updates.preparationNotes());
        }
        if (updates.feedback() != null) {
            interview.setFeedback(updates.feedback());
        }
        if (updates.rating() != null) {
            interview.setRating(updates.rating());
        }

        return interviewRepository.save(interview);
    }

    public Interview confirmInterview(UUID id, boolean isStudent) {
        Interview interview = interviewRepository.findById(id).orElseThrow();

        if (isStudent) {
            interview.setStudentConfirmed(true);
        } else {
            interview.setCompanyConfirmed(true);
        }

        if (interview.getStudentConfirmed() && interview.getCompanyConfirmed()) {
            interview.setStatus("CONFIRMED");
        }

        return interviewRepository.save(interview);
    }

    public Interview rescheduleInterview(UUID id, String reason) {
        Interview interview = interviewRepository.findById(id).orElseThrow();
        interview.setStatus("RESCHEDULED");
        interview.setRescheduleReason(reason);
        interview.setRescheduleCount(interview.getRescheduleCount() + 1);
        interview.setStudentConfirmed(false);
        interview.setCompanyConfirmed(false);
        return interviewRepository.save(interview);
    }

    public void deleteInterview(UUID id) {
        interviewRepository.deleteById(id);
    }
}
