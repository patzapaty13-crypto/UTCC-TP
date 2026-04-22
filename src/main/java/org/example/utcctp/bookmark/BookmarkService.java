package org.example.utcctp.bookmark;

import org.example.utcctp.api.dto.BookmarkResponse;
import org.example.utcctp.model.Bookmark;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.BookmarkRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookmarkService {
    private static final Logger log = LoggerFactory.getLogger(BookmarkService.class);
    private final BookmarkRepository bookmarkRepository;
    private final InternshipPositionRepository internshipPositionRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, InternshipPositionRepository internshipPositionRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.internshipPositionRepository = internshipPositionRepository;
    }

    @Transactional(readOnly = true)
    public List<BookmarkResponse> listForUser(User user) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return bookmarks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookmarkResponse addBookmark(UUID internshipId, User user) {
        // Check if already bookmarked
        if (bookmarkRepository.existsByUserIdAndInternshipId(user.getId(), internshipId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already bookmarked");
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setInternship(internshipPositionRepository.findById(internshipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Internship not found")));
        
        bookmarkRepository.save(bookmark);
        log.info("User {} bookmarked internship {}", user.getId(), internshipId);
        return toResponse(bookmark);
    }

    public void removeBookmark(UUID internshipId, User user) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndInternshipId(user.getId(), internshipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found"));
        bookmarkRepository.delete(bookmark);
        log.info("User {} removed bookmark for internship {}", user.getId(), internshipId);
    }

    @Transactional(readOnly = true)
    public boolean isBookmarked(UUID internshipId, User user) {
        return bookmarkRepository.existsByUserIdAndInternshipId(user.getId(), internshipId);
    }

    private BookmarkResponse toResponse(Bookmark bookmark) {
        BookmarkResponse response = new BookmarkResponse();
        response.setId(bookmark.getId());
        response.setInternshipId(bookmark.getInternship().getId());
        response.setInternshipTitle(bookmark.getInternship().getTitle());
        response.setCompanyName(bookmark.getInternship().getCompany() != null ? 
                bookmark.getInternship().getCompany().getName() : null);
        response.setCreatedAt(bookmark.getCreatedAt());
        return response;
    }
}
