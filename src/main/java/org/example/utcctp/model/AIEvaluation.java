package org.example.utcctp.model;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_evaluations")
public class AIEvaluation {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "match_score", nullable = false)
    private Integer matchScore;

    @Column(name = "screening_summary", columnDefinition = "text")
    private String screeningSummary;

    @Column(name = "skills_detected", columnDefinition = "text")
    private String skillsDetected;

    @Column(name = "evaluation_date", nullable = false)
    private Instant evaluationDate = Instant.now();

    public UUID getId() { return id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }
    public String getScreeningSummary() { return screeningSummary; }
    public void setScreeningSummary(String screeningSummary) { this.screeningSummary = screeningSummary; }
    public String getSkillsDetected() { return skillsDetected; }
    public void setSkillsDetected(String skillsDetected) { this.skillsDetected = skillsDetected; }
    public Instant getEvaluationDate() { return evaluationDate; }
}
