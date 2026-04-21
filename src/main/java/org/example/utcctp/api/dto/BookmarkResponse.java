package org.example.utcctp.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BookmarkResponse {
    private UUID id;
    private UUID internshipId;
    private String internshipTitle;
    private String companyName;
    private LocalDateTime createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getInternshipId() { return internshipId; }
    public void setInternshipId(UUID internshipId) { this.internshipId = internshipId; }

    public String getInternshipTitle() { return internshipTitle; }
    public void setInternshipTitle(String internshipTitle) { this.internshipTitle = internshipTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
