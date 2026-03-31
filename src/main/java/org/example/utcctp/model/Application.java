package org.example.utcctp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "internship_position_id")
    private InternshipPosition internshipPosition;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(columnDefinition = "TEXT")
    private String reason;

    // Snapshot fields to freeze status at application time
    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "applicant_student_id")
    private String applicantStudentId;

    @Column(name = "applicant_faculty")
    private String applicantFaculty;

    @Column(name = "applicant_major")
    private String applicantMajor;

    @OneToMany(mappedBy = "application")
    private List<ApprovalHistory> approvals = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public ApplicationType getType() {
        return type;
    }

    public void setType(ApplicationType type) {
        this.type = type;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public InternshipPosition getInternshipPosition() {
        return internshipPosition;
    }

    public void setInternshipPosition(InternshipPosition internshipPosition) {
        this.internshipPosition = internshipPosition;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantStudentId() {
        return applicantStudentId;
    }

    public void setApplicantStudentId(String applicantStudentId) {
        this.applicantStudentId = applicantStudentId;
    }

    public String getApplicantFaculty() {
        return applicantFaculty;
    }

    public void setApplicantFaculty(String applicantFaculty) {
        this.applicantFaculty = applicantFaculty;
    }

    public String getApplicantMajor() {
        return applicantMajor;
    }

    public void setApplicantMajor(String applicantMajor) {
        this.applicantMajor = applicantMajor;
    }

    public List<ApprovalHistory> getApprovals() {
        return approvals;
    }
}
