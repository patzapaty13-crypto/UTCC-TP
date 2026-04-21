package org.example.utcctp.api;

import lombok.RequiredArgsConstructor;
import org.example.utcctp.bookmark.BookmarkService;
import org.example.utcctp.model.Bookmark;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.User;
import org.example.utcctp.security.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    
    private final BookmarkService bookmarkService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Bookmark> addBookmark(
            @CurrentUser User user,
            @RequestBody Map<String, Long> request) {
        
        Long internshipId = request.get("internshipId");
        Bookmark bookmark = bookmarkService.addBookmark(user.getId(), internshipId);
        return ResponseEntity.ok(bookmark);
    }

    @DeleteMapping("/{internshipId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> removeBookmark(
            @CurrentUser User user,
            @PathVariable Long internshipId) {
        
        bookmarkService.removeBookmark(user.getId(), internshipId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Bookmark>> getBookmarks(@CurrentUser User user) {
        List<Bookmark> bookmarks = bookmarkService.getUserBookmarks(user.getId());
        return ResponseEntity.ok(bookmarks);
    }

    @GetMapping("/internships")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InternshipPosition>> getBookmarkedInternships(@CurrentUser User user) {
        List<InternshipPosition> internships = bookmarkService.getUserBookmarkedInternships(user.getId());
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/check/{internshipId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> checkBookmark(
            @CurrentUser User user,
            @PathVariable Long internshipId) {
        
        boolean isBookmarked = bookmarkService.isBookmarked(user.getId(), internshipId);
        return ResponseEntity.ok(Map.of("isBookmarked", isBookmarked));
    }
}
