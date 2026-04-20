package org.example.utcctp.internship;

import org.example.utcctp.api.dto.CompanyRequest;
import org.example.utcctp.api.dto.CompanyResponse;
import org.example.utcctp.model.Company;
import org.example.utcctp.repository.CompanyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<CompanyResponse> listCompanies() {
        return companyRepository.findAll().stream().map(this::mapCompany).toList();
    }

    public CompanyResponse getCompany(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        return mapCompany(company);
    }

    public CompanyResponse createCompany(CompanyRequest request) {
        Company company = new Company();
        if (company.getStatus() == null) {
            company.setStatus("ACTIVE");
        }
        applyCompany(company, request);
        companyRepository.save(company);
        return mapCompany(company);
    }

    public CompanyResponse updateCompany(UUID id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Company not found"));
        applyCompany(company, request);
        companyRepository.save(company);
        return mapCompany(company);
    }

    private void applyCompany(Company company, CompanyRequest request) {
        company.setName(request.name());
        company.setIndustry(request.industry());
        company.setLocation(request.location());
        company.setContactName(request.contactName());
        company.setContactEmail(request.contactEmail());
        if (company.getStatus() == null || company.getStatus().isBlank()) {
            company.setStatus("ACTIVE");
        }
    }

    private CompanyResponse mapCompany(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getIndustry(),
                company.getLocation(),
                company.getStatus(),
                company.getContactName(),
                company.getContactEmail()
        );
    }
}
