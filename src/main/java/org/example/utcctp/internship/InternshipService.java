package org.example.utcctp.internship;

import org.example.utcctp.api.dto.InternshipRequest;
import org.example.utcctp.api.dto.InternshipResponse;
import org.example.utcctp.model.Company;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.InternshipStatus;
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

    public InternshipResponse getPosition(UUID id) {
        InternshipPosition position = internshipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
        return mapPosition(position);
    }

    public InternshipResponse createPosition(InternshipRequest request) {
        if (request.companyId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "companyId is required");
        }
        Company company = companyRepository.findById(request.companyId())
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

    private void applyPosition(InternshipPosition position, InternshipRequest request) {
        position.setTitle(request.title());
        position.setDescription(request.description());
        position.setRequirements(request.requirements());
        position.setLocation(request.location());
        position.setMode(request.mode());
        position.setSlots(request.slots());
        if (request.status() != null && !request.status().isBlank()) {
            position.setStatus(InternshipStatus.valueOf(request.status()));
        }
        
        // Phase 1 Enhancement Fields
        if (request.internshipType() != null && !request.internshipType().isBlank()) {
            position.setInternshipType(request.internshipType());
        }
        
        if (request.allowanceAmount() != null && !request.allowanceAmount().isBlank()) {
            try {
                String[] parts = request.allowanceAmount().split("-");
                if (parts.length == 2) {
                    position.setSalaryMin(new BigDecimal(parts[0].trim()));
                    position.setSalaryMax(new BigDecimal(parts[1].trim()));
                } else {
                    position.setSalaryMin(new BigDecimal(request.allowanceAmount().trim()));
                }
            } catch (NumberFormatException e) {
                // Ignore invalid format
            }
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
