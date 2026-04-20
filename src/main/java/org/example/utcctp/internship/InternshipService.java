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
        Company company = companyRepository.findById(request.companyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        InternshipPosition position = new InternshipPosition();
        position.setCompany(company);
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
        if (request.status() != null) {
            position.setStatus(InternshipStatus.valueOf(request.status()));
        }
    }

    private InternshipResponse mapPosition(InternshipPosition position) {
        return new InternshipResponse(
                position.getId(),
                position.getCompany().getName(),
                position.getTitle(),
                position.getLocation(),
                position.getMode(),
                position.getSlots(),
                position.getStatus().name()
        );
    }
}
