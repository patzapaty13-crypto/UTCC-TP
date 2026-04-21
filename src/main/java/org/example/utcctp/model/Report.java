package org.example.utcctp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "internship_id")
    private InternshipPosition internship;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type; // WEEKLY, MONTHLY, FINAL

    @Column(name = "week_number")
    private Integer weekNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status; // DRAFT, SUBMITTED, UNDER_REVIEW, GRADED, NEEDS_REVISION

    private Integer score; // 0-100

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    @Column(columnDefinition = "TEXT")
    private String challenges;

    @Column(columnDefinition = "TEXT")
    private String learnings;

    @Column(name = "next_week_plan", columnDefinition = "TEXT")
    private String nextWeekPlan;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @ManyToOne
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ReportStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ReportType {
        WEEKLY, MONTHLY, FINAL
    }

    public enum ReportStatus {
        DRAFT, SUBMITTED, UNDER_REVIEW, GRADED, NEEDS_REVISION
    }
}
