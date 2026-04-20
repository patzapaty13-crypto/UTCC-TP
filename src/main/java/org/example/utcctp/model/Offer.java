package org.example.utcctp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "offers")
public class Offer {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne
    @JoinColumn(name = "offered_by")
    private User offeredBy;

    @Column(length = 200)
    private String title;

    @Column(name = "allowance_amount")
    private Double allowanceAmount;

    @Column(name = "allowance_currency", length = 10)
    private String allowanceCurrency = "THB";

    @Column(name = "starts_on")
    private LocalDate startsOn;

    @Column(name = "ends_on")
    private LocalDate endsOn;

    @Column(name = "terms_text", columnDefinition = "TEXT")
    private String termsText;

    @Column(name = "response_deadline")
    private Instant responseDeadline;

    @Column(length = 30)
    private String status = "PENDING";

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public UUID getId() { return id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public User getOfferedBy() { return offeredBy; }
    public void setOfferedBy(User offeredBy) { this.offeredBy = offeredBy; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Double getAllowanceAmount() { return allowanceAmount; }
    public void setAllowanceAmount(Double allowanceAmount) { this.allowanceAmount = allowanceAmount; }
    public String getAllowanceCurrency() { return allowanceCurrency; }
    public void setAllowanceCurrency(String allowanceCurrency) { this.allowanceCurrency = allowanceCurrency; }
    public LocalDate getStartsOn() { return startsOn; }
    public void setStartsOn(LocalDate startsOn) { this.startsOn = startsOn; }
    public LocalDate getEndsOn() { return endsOn; }
    public void setEndsOn(LocalDate endsOn) { this.endsOn = endsOn; }
    public String getTermsText() { return termsText; }
    public void setTermsText(String termsText) { this.termsText = termsText; }
    public Instant getResponseDeadline() { return responseDeadline; }
    public void setResponseDeadline(Instant responseDeadline) { this.responseDeadline = responseDeadline; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getRespondedAt() { return respondedAt; }
    public void setRespondedAt(Instant respondedAt) { this.respondedAt = respondedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
