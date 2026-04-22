package org.example.utcctp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interviews")
public class Interview {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "company_id")
    private UUID companyId;

    @Column(name = "position_id")
    private UUID positionId;

    @Column(name = "interview_type", nullable = false, length = 50)
    private String interviewType = "IN_PERSON";

    @Column(name = "interview_date")
    private Instant interviewDate;

    @Column(name = "interview_duration")
    private Integer interviewDuration = 60;

    @Column(columnDefinition = "TEXT")
    private String location;

    @Column(name = "video_link", columnDefinition = "TEXT")
    private String videoLink;

    @Column(name = "meeting_id", length = 255)
    private String meetingId;

    @Column(nullable = false, length = 50)
    private String status = "SCHEDULED";

    @Column(name = "interviewer_name", length = 255)
    private String interviewerName;

    @Column(name = "interviewer_email", length = 255)
    private String interviewerEmail;

    @Column(name = "interviewer_phone", length = 50)
    private String interviewerPhone;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "preparation_notes", columnDefinition = "TEXT")
    private String preparationNotes;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer rating;

    @Column(name = "student_confirmed")
    private Boolean studentConfirmed = false;

    @Column(name = "student_confirmed_at")
    private Instant studentConfirmedAt;

    @Column(name = "company_confirmed")
    private Boolean companyConfirmed = false;

    @Column(name = "company_confirmed_at")
    private Instant companyConfirmedAt;

    @Column(name = "reschedule_reason", columnDefinition = "TEXT")
    private String rescheduleReason;

    @Column(name = "reschedule_count")
    private Integer rescheduleCount = 0;

    @Column(name = "result", length = 20)
    private String result; // PASSED, FAILED, PENDING

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public UUID getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(UUID applicationId) {
        this.applicationId = applicationId;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public UUID getPositionId() {
        return positionId;
    }

    public void setPositionId(UUID positionId) {
        this.positionId = positionId;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public Instant getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(Instant interviewDate) {
        this.interviewDate = interviewDate;
    }

    public Integer getInterviewDuration() {
        return interviewDuration;
    }

    public void setInterviewDuration(Integer interviewDuration) {
        this.interviewDuration = interviewDuration;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public void setInterviewerName(String interviewerName) {
        this.interviewerName = interviewerName;
    }

    public String getInterviewerEmail() {
        return interviewerEmail;
    }

    public void setInterviewerEmail(String interviewerEmail) {
        this.interviewerEmail = interviewerEmail;
    }

    public String getInterviewerPhone() {
        return interviewerPhone;
    }

    public void setInterviewerPhone(String interviewerPhone) {
        this.interviewerPhone = interviewerPhone;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getPreparationNotes() {
        return preparationNotes;
    }

    public void setPreparationNotes(String preparationNotes) {
        this.preparationNotes = preparationNotes;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Boolean getStudentConfirmed() {
        return studentConfirmed;
    }

    public void setStudentConfirmed(Boolean studentConfirmed) {
        this.studentConfirmed = studentConfirmed;
        if (studentConfirmed) {
            this.studentConfirmedAt = Instant.now();
        }
    }

    public Instant getStudentConfirmedAt() {
        return studentConfirmedAt;
    }

    public Boolean getCompanyConfirmed() {
        return companyConfirmed;
    }

    public void setCompanyConfirmed(Boolean companyConfirmed) {
        this.companyConfirmed = companyConfirmed;
        if (companyConfirmed) {
            this.companyConfirmedAt = Instant.now();
        }
    }

    public Instant getCompanyConfirmedAt() {
        return companyConfirmedAt;
    }

    public String getRescheduleReason() {
        return rescheduleReason;
    }

    public void setRescheduleReason(String rescheduleReason) {
        this.rescheduleReason = rescheduleReason;
    }

    public Integer getRescheduleCount() {
        return rescheduleCount;
    }

    public void setRescheduleCount(Integer rescheduleCount) {
        this.rescheduleCount = rescheduleCount;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
