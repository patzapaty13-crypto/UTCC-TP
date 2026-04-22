package org.example.utcctp.offer;

import org.example.utcctp.api.dto.OfferRequest;
import org.example.utcctp.api.dto.OfferResponse;
import org.example.utcctp.model.Application;
import org.example.utcctp.model.Intern;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.Offer;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.ApplicationRepository;
import org.example.utcctp.repository.InternRepository;
import org.example.utcctp.repository.OfferRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OfferService {
    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    private final InternRepository internRepository;

    public OfferService(OfferRepository offerRepository, ApplicationRepository applicationRepository, NotificationService notificationService, InternRepository internRepository) {
        this.offerRepository = offerRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
        this.internRepository = internRepository;
    }

    public List<OfferResponse> listByApplication(UUID applicationId) {
        return offerRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId).stream().map(this::map).toList();
    }

    public OfferResponse create(OfferRequest request, User actor) {
        Application application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        Offer offer = new Offer();
        offer.setApplication(application);
        offer.setOfferedBy(actor);
        offer.setTitle(request.title());
        offer.setAllowanceAmount(request.allowanceAmount());
        offer.setAllowanceCurrency(request.allowanceCurrency() == null || request.allowanceCurrency().isBlank() ? "THB" : request.allowanceCurrency());
        offer.setStartsOn(parseDate(request.startsOn()));
        offer.setEndsOn(parseDate(request.endsOn()));
        offer.setTermsText(request.termsText());
        offer.setResponseDeadline(parseInstant(request.responseDeadline()));
        if (request.status() != null && !request.status().isBlank()) {
            offer.setStatus(request.status());
        }
        Offer saved = offerRepository.save(offer);
        
        // Update application status to OFFER_EXTENDED
        application.setStatus(org.example.utcctp.model.ApplicationStatus.OFFER_EXTENDED);
        applicationRepository.save(application);
        
        // TODO: Implement notification system
        // notificationService.notifyUser(application.getStudent(), "Offer received", "You have received a new internship offer.", NotificationType.APPLICATION);
        return map(saved);
    }

    public OfferResponse update(UUID id, OfferRequest request, User actor) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));
        if (request.title() != null) offer.setTitle(request.title());
        if (request.allowanceAmount() != null) offer.setAllowanceAmount(request.allowanceAmount());
        if (request.allowanceCurrency() != null && !request.allowanceCurrency().isBlank()) offer.setAllowanceCurrency(request.allowanceCurrency());
        if (request.startsOn() != null && !request.startsOn().isBlank()) offer.setStartsOn(parseDate(request.startsOn()));
        if (request.endsOn() != null && !request.endsOn().isBlank()) offer.setEndsOn(parseDate(request.endsOn()));
        if (request.termsText() != null) offer.setTermsText(request.termsText());
        if (request.responseDeadline() != null && !request.responseDeadline().isBlank()) offer.setResponseDeadline(parseInstant(request.responseDeadline()));
        if (request.status() != null && !request.status().isBlank()) offer.setStatus(request.status());
        offer.setOfferedBy(actor);
        return map(offerRepository.save(offer));
    }

    public OfferResponse respond(UUID id, String status, User actor) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));
        offer.setStatus(status);
        offer.setRespondedAt(Instant.now());
        
        // Update application status based on offer response
        Application application = offer.getApplication();
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            application.setStatus(org.example.utcctp.model.ApplicationStatus.ACCEPTED);
            // If offer is accepted, automatically create an Intern record
            createInternFromOffer(offer);
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            application.setStatus(org.example.utcctp.model.ApplicationStatus.REJECTED);
        }
        applicationRepository.save(application);
        
        // TODO: Implement notification system
        // notificationService.notifyUser(offer.getApplication().getStudent(), "Offer updated", "Your offer status has been updated.", NotificationType.APPLICATION);
        return map(offerRepository.save(offer));
    }
    
    private void createInternFromOffer(Offer offer) {
        Application application = offer.getApplication();
        
        // Check if intern record already exists for this application
        if (internRepository.findByApplicationId(application.getId()).isPresent()) {
            return; // Already created
        }
        
        Intern intern = new Intern();
        intern.setApplicationId(application.getId());
        intern.setStudentId(application.getStudent().getId());
        intern.setCompanyId(application.getInternshipPosition().getCompany().getId());
        intern.setInternshipId(application.getInternshipPosition().getId());
        intern.setStartDate(offer.getStartsOn());
        intern.setEndDate(offer.getEndsOn());
        intern.setStatus(Intern.InternStatus.ACTIVE);
        
        // Calculate total days
        long days = ChronoUnit.DAYS.between(offer.getStartsOn(), offer.getEndsOn());
        intern.setTotalDays((int) days);
        intern.setWorkingDays(0);
        
        // Set supervisor info if available from company
        // This can be updated later by the company
        intern.setSupervisorName(null);
        intern.setSupervisorEmail(null);
        
        internRepository.save(intern);
    }

    private Instant parseInstant(String value) {
        try { return Instant.parse(value); } catch (Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid datetime format"); }
    }

    private LocalDate parseDate(String value) {
        try { return LocalDate.parse(value); } catch (Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format"); }
    }

    private OfferResponse map(Offer offer) {
        return new OfferResponse(
                offer.getId(),
                offer.getApplication().getId(),
                offer.getTitle(),
                offer.getAllowanceAmount(),
                offer.getAllowanceCurrency(),
                offer.getStartsOn(),
                offer.getEndsOn(),
                offer.getTermsText(),
                offer.getResponseDeadline(),
                offer.getStatus(),
                offer.getRespondedAt(),
                offer.getCreatedAt()
        );
    }
}
