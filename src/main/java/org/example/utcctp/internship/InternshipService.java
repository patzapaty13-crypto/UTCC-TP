package org.example.utcctp.internship;

import org.example.utcctp.api.dto.InternshipRequest;
import org.example.utcctp.api.dto.InternshipResponse;
import org.example.utcctp.model.Company;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.InternshipStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.CompanyRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InternshipService {
    private final InternshipPositionRepository internshipRepository;
    private final CompanyRepository companyRepository;

    public InternshipService(InternshipPositionRepository internshipRepository, CompanyRepository companyRepository) {
        this.internshipRepository = internshipRepository;
        this.companyRepository = companyRepository;
    }

    public List<InternshipResponse> listPositions() {
        return internshipRepository.findAll().stream().map(this::mapPosition).toList();
    }

    public List<InternshipResponse> listPositionsByCompany(UUID companyId) {
        return internshipRepository.findByCompanyIdOrderByCreatedAtDesc(companyId).stream().map(this::mapPosition).toList();
    }

    public InternshipResponse getPosition(UUID id) {
        InternshipPosition position = internshipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
        return mapPosition(position);
    }

    public InternshipResponse createPosition(InternshipRequest request, User currentUser) {
        UUID companyId = request.companyId();
        
        // Auto-detect companyId for company users
        if (companyId == null && currentUser.getCompanyId() != null) {
            companyId = currentUser.getCompanyId();
        }
        
        if (companyId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "companyId is required");
        }
        
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        
        InternshipPosition position = new InternshipPosition();
        position.setCompany(company);
        if (position.getStatus() == null) {
            position.setStatus(InternshipStatus.OPEN);
        }
        applyPosition(position, request);
        internshipRepository.save(position);
        return mapPosition(position);
    }

    public InternshipResponse updatePosition(UUID id, InternshipRequest request) {
        InternshipPosition position = internshipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
        if (request.companyId() != null) {
            Company company = companyRepository.findById(request.companyId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
            position.setCompany(company);
        }
        applyPosition(position, request);
        internshipRepository.save(position);
        return mapPosition(position);
    }

    public void deletePosition(UUID id) {
        InternshipPosition position = internshipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
        internshipRepository.delete(position);
    }

    private void applyPosition(InternshipPosition position, InternshipRequest request) {
        // Only update non-null fields
        if (request.title() != null && !request.title().isBlank()) {
            position.setTitle(request.title());
        }
        if (request.description() != null) {
            position.setDescription(request.description());
        }
        if (request.requirements() != null) {
            position.setRequirements(request.requirements());
        }
        if (request.location() != null) {
            position.setLocation(request.location());
        }
        if (request.mode() != null) {
            position.setMode(request.mode());
        }
        // slots is primitive int, always has a value
        if (request.slots() > 0) {
            position.setSlots(request.slots());
        }
        if (request.status() != null && !request.status().isBlank()) {
            position.setStatus(InternshipStatus.valueOf(request.status()));
        }
        
        // Phase 1 Enhancement Fields
        if (request.internshipType() != null && !request.internshipType().isBlank()) {
            position.setInternshipType(request.internshipType());
        }
        
        if (request.salaryMin() != null && !request.salaryMin().isBlank()) {
            try {
                position.setSalaryMin(new BigDecimal(request.salaryMin().trim()));
            } catch (NumberFormatException e) {
                // Ignore invalid format
            }
        }
        
        if (request.salaryMax() != null && !request.salaryMax().isBlank()) {
            try {
                position.setSalaryMax(new BigDecimal(request.salaryMax().trim()));
            } catch (NumberFormatException e) {
                // Ignore invalid format
            }
        }
        
        if (request.benefits() != null) {
            position.setBenefits(request.benefits());
        }
        
        if (request.applicationDeadline() != null && !request.applicationDeadline().isBlank()) {
            try {
                position.setApplicationDeadline(LocalDate.parse(request.applicationDeadline()));
            } catch (Exception e) {
                // Ignore invalid date
            }
        }
        
        if (request.startDate() != null && !request.startDate().isBlank()) {
            try {
                position.setStartDate(LocalDate.parse(request.startDate()));
            } catch (Exception e) {
                // Ignore invalid date
            }
        }
        
        if (request.endDate() != null && !request.endDate().isBlank()) {
            try {
                position.setEndDate(LocalDate.parse(request.endDate()));
            } catch (Exception e) {
                // Ignore invalid date
            }
        }
        
        if (request.contactEmail() != null && !request.contactEmail().isBlank()) {
            position.setContactEmail(request.contactEmail());
        }
        
        if (request.contactPhone() != null && !request.contactPhone().isBlank()) {
            position.setContactPhone(request.contactPhone());
        }
        
        if (request.contactLine() != null && !request.contactLine().isBlank()) {
            position.setContactLine(request.contactLine());
        }
    }

    private InternshipResponse mapPosition(InternshipPosition position) {
        return new InternshipResponse(
                position.getId(),
                position.getCompany().getName(),
                position.getTitle(),
                position.getDescription(),
                position.getRequirements(),
                position.getLocation(),
                position.getMode(),
                position.getSlots(),
                position.getStatus().name(),
                position.getCompany().getLogoUrl(),
                position.getCompany().getIndustry(),
                // Phase 1 Enhancement Fields
                position.getSalaryMin(),
                position.getSalaryMax(),
                position.getStartDate(),
                position.getEndDate(),
                position.getApplicationDeadline(),
                position.getBenefits(),
                position.getInternshipType(),
                position.getContactEmail(),
                position.getContactPhone(),
                position.getContactLine(),
                position.getCreatedAt()
        );
    }
}
