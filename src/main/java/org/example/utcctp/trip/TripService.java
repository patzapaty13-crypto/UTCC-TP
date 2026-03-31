package org.example.utcctp.trip;

import org.example.utcctp.api.dto.TripBudgetRequest;
import org.example.utcctp.api.dto.TripBudgetResponse;
import org.example.utcctp.api.dto.TripDetailResponse;
import org.example.utcctp.api.dto.TripDocumentRequest;
import org.example.utcctp.api.dto.TripDocumentResponse;
import org.example.utcctp.api.dto.TripRequest;
import org.example.utcctp.api.dto.TripResponse;
import org.example.utcctp.api.dto.TripScheduleRequest;
import org.example.utcctp.api.dto.TripScheduleResponse;
import org.example.utcctp.model.FileAsset;
import org.example.utcctp.model.NotificationType;
import org.example.utcctp.model.RoleType;
import org.example.utcctp.model.Trip;
import org.example.utcctp.model.TripBudget;
import org.example.utcctp.model.TripDocument;
import org.example.utcctp.model.TripSchedule;
import org.example.utcctp.model.TripStatus;
import org.example.utcctp.model.User;
import org.example.utcctp.notification.NotificationService;
import org.example.utcctp.repository.FileAssetRepository;
import org.example.utcctp.repository.TripBudgetRepository;
import org.example.utcctp.repository.TripDocumentRepository;
import org.example.utcctp.repository.TripRepository;
import org.example.utcctp.repository.TripScheduleRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TripService {
    private final TripRepository tripRepository;
    private final TripScheduleRepository scheduleRepository;
    private final TripBudgetRepository budgetRepository;
    private final TripDocumentRepository documentRepository;
    private final FileAssetRepository fileAssetRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public TripService(
            TripRepository tripRepository,
            TripScheduleRepository scheduleRepository,
            TripBudgetRepository budgetRepository,
            TripDocumentRepository documentRepository,
            FileAssetRepository fileAssetRepository,
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.tripRepository = tripRepository;
        this.scheduleRepository = scheduleRepository;
        this.budgetRepository = budgetRepository;
        this.documentRepository = documentRepository;
        this.fileAssetRepository = fileAssetRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public List<TripResponse> listTrips() {
        return tripRepository.findAll().stream().map(this::mapTrip).toList();
    }

    public TripDetailResponse getTrip(UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        List<TripScheduleResponse> schedules = trip.getSchedules().stream()
                .map(schedule -> new TripScheduleResponse(
                        schedule.getId(),
                        schedule.getStartTime(),
                        schedule.getEndTime(),
                        schedule.getActivity()
                ))
                .toList();
        List<TripBudgetResponse> budgets = trip.getBudgets().stream()
                .map(budget -> new TripBudgetResponse(budget.getId(), budget.getCategory(), budget.getAmount()))
                .toList();
        List<TripDocumentResponse> documents = trip.getDocuments().stream()
                .map(document -> new TripDocumentResponse(
                        document.getId(),
                        document.getDocType(),
                        document.getFile() == null ? null : document.getFile().getId(),
                        document.getFile() == null ? null : document.getFile().getOriginalName()
                ))
                .toList();
        return new TripDetailResponse(mapTrip(trip), schedules, budgets, documents);
    }

    public TripResponse createTrip(TripRequest request, User creator) {
        Trip trip = new Trip();
        applyTripRequest(trip, request);
        trip.setStatus(TripStatus.DRAFT);
        trip.setCreatedBy(creator);
        tripRepository.save(trip);
        return mapTrip(trip);
    }

    public TripResponse updateTrip(UUID id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        applyTripRequest(trip, request);
        tripRepository.save(trip);
        return mapTrip(trip);
    }

    public TripResponse publishTrip(UUID id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        trip.setStatus(TripStatus.PUBLISHED);
        tripRepository.save(trip);

        // Notify all students about the new trip
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRoles().contains(RoleType.STUDENT))
                .toList();
        for (User student : students) {
            notificationService.notifyUser(
                    student,
                    "New Trip: " + trip.getTitle(),
                    "A new trip \"" + trip.getTitle() + "\" has been published. Apply now!",
                    NotificationType.TRIP
            );
        }

        return mapTrip(trip);
    }

    public TripScheduleResponse addSchedule(UUID tripId, TripScheduleRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        TripSchedule schedule = new TripSchedule();
        schedule.setTrip(trip);
        schedule.setStartTime(request.startTime());
        schedule.setEndTime(request.endTime());
        schedule.setActivity(request.activity());
        scheduleRepository.save(schedule);
        return new TripScheduleResponse(schedule.getId(), schedule.getStartTime(), schedule.getEndTime(), schedule.getActivity());
    }

    public TripBudgetResponse addBudget(UUID tripId, TripBudgetRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        TripBudget budget = new TripBudget();
        budget.setTrip(trip);
        budget.setCategory(request.category());
        budget.setAmount(request.amount());
        budgetRepository.save(budget);
        return new TripBudgetResponse(budget.getId(), budget.getCategory(), budget.getAmount());
    }

    public TripDocumentResponse addDocument(UUID tripId, TripDocumentRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        FileAsset file = null;
        if (request.fileId() != null) {
            file = fileAssetRepository.findById(request.fileId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
        }
        TripDocument document = new TripDocument();
        document.setTrip(trip);
        document.setDocType(request.docType());
        document.setFile(file);
        documentRepository.save(document);
        return new TripDocumentResponse(
                document.getId(),
                document.getDocType(),
                file == null ? null : file.getId(),
                file == null ? null : file.getOriginalName()
        );
    }

    private void applyTripRequest(Trip trip, TripRequest request) {
        trip.setTitle(request.title());
        trip.setObjective(request.objective());
        trip.setLocation(request.location());
        trip.setStartDate(request.startDate());
        trip.setEndDate(request.endDate());
        trip.setCapacity(request.capacity());
        trip.setBudgetTotal(request.budgetTotal());
        trip.setMapUrl(request.mapUrl());
    }

    private TripResponse mapTrip(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getObjective(),
                trip.getLocation(),
                trip.getStatus().name(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getCapacity(),
                trip.getBudgetTotal(),
                trip.getMapUrl()
        );
    }
}
