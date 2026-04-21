package org.example.utcctp.bookmark;

import org.example.utcctp.api.dto.BookmarkResponse;
import org.example.utcctp.model.Bookmark;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.BookmarkRepository;
import org.example.utcctp.repository.InternshipPositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookmarkService {
    
    private final BookmarkRepository bookmarkRepository;
    private final InternshipPositionRepository internshipPositionRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, InternshipPositionRepository internshipPositionRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.internshipPositionRepository = internshipPositionRepository;
    }

    public List<BookmarkResponse> listForUser(User user) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return bookmarks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookmarkResponse addBookmark(UUID internshipId, User user) {
        // Check if already bookmarked
        if (bookmarkRepository.existsByUserIdAndInternshipId(user.getId(), internshipId)) {
            throw new RuntimeException("Already bookmarked");
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setInternship(internshipPositionRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found")));
        
        return toResponse(bookmarkRepository.save(bookmark));
    }

    public void removeBookmark(UUID internshipId, User user) {
        Bookmark bookmark = bookmarkRepository.findByUserIdAndInternshipId(user.getId(), internshipId)
                .orElseThrow(() -> new RuntimeException("Bookmark not found"));
        bookmarkRepository.delete(bookmark);
    }

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
