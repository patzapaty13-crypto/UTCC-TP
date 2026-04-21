package org.example.utcctp.api;

import org.example.utcctp.api.dto.BookmarkResponse;
import org.example.utcctp.bookmark.BookmarkService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;
    private final CurrentUserService currentUserService;

    public BookmarkController(BookmarkService bookmarkService, CurrentUserService currentUserService) {
        this.bookmarkService = bookmarkService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<BookmarkResponse> listBookmarks() {
        return bookmarkService.listForUser(currentUserService.requireUser());
    }

    @PostMapping("/{internshipId}")
    public BookmarkResponse addBookmark(@PathVariable UUID internshipId) {
        return bookmarkService.addBookmark(internshipId, currentUserService.requireUser());
    }

    @DeleteMapping("/{internshipId}")
    public void removeBookmark(@PathVariable UUID internshipId) {
        bookmarkService.removeBookmark(internshipId, currentUserService.requireUser());
    }

    @GetMapping("/check/{internshipId}")
    public boolean isBookmarked(@PathVariable UUID internshipId) {
        return bookmarkService.isBookmarked(internshipId, currentUserService.requireUser());
    }
}
