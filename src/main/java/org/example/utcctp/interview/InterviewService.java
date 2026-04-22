package org.example.utcctp.interview;

import org.example.utcctp.model.Interview;
import org.example.utcctp.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class InterviewService {
    private final InterviewRepository interviewRepository;

    public InterviewService(InterviewRepository interviewRepository) {
        this.interviewRepository = interviewRepository;
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

    public Interview createInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public Interview updateInterview(UUID id, Interview updates) {
        Interview interview = interviewRepository.findById(id).orElseThrow();
        
        if (updates.getInterviewDate() != null) {
            interview.setInterviewDate(updates.getInterviewDate());
        }
        if (updates.getInterviewType() != null) {
            interview.setInterviewType(updates.getInterviewType());
        }
        if (updates.getLocation() != null) {
            interview.setLocation(updates.getLocation());
        }
        if (updates.getVideoLink() != null) {
            interview.setVideoLink(updates.getVideoLink());
        }
        if (updates.getStatus() != null) {
            interview.setStatus(updates.getStatus());
        }
        if (updates.getInstructions() != null) {
            interview.setInstructions(updates.getInstructions());
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
        
        // If both confirmed, update status
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
