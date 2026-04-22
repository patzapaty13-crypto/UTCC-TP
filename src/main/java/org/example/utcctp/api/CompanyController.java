package org.example.utcctp.api;

import jakarta.validation.Valid;
import org.example.utcctp.api.dto.CompanyRequest;
import org.example.utcctp.api.dto.CompanyResponse;
import org.example.utcctp.auth.JwtPrincipal;
import org.example.utcctp.auth.JwtService;
import org.example.utcctp.internship.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {
    private final CompanyService companyService;
    private final JwtService jwtService;

    public CompanyController(CompanyService companyService, JwtService jwtService) {
        this.companyService = companyService;
        this.jwtService = jwtService;
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
    public CompanyResponse createCompany(@Valid @RequestBody CompanyRequest request) {
        return companyService.createCompany(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public CompanyResponse updateCompany(@PathVariable UUID id, @Valid @RequestBody CompanyRequest request) {
        return companyService.updateCompany(id, request);
    }

    @PutMapping("/my-profile")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyResponse> updateMyProfile(
            @Valid @RequestBody CompanyRequest request,
            @RequestHeader("Authorization") String token
    ) {
        String jwt = token.substring(7);
        JwtPrincipal principal = jwtService.parseToken(jwt);
        if (principal == null || principal.companyId() == null) {
            return ResponseEntity.badRequest().build();
        }
        CompanyResponse updated = companyService.updateCompany(principal.companyId(), request);
        return ResponseEntity.ok(updated);
    }
}
