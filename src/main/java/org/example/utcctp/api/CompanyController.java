package org.example.utcctp.api;

import org.example.utcctp.api.dto.CompanyRequest;
import org.example.utcctp.api.dto.CompanyResponse;
import org.example.utcctp.internship.CompanyService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public List<CompanyResponse> listCompanies() {
        return companyService.listCompanies();
    }

    @GetMapping("/{id}")
    public CompanyResponse getCompany(@PathVariable UUID id) {
        return companyService.getCompany(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public CompanyResponse createCompany(@RequestBody CompanyRequest request) {
        return companyService.createCompany(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public CompanyResponse updateCompany(@PathVariable UUID id, @RequestBody CompanyRequest request) {
        return companyService.updateCompany(id, request);
    }
}
