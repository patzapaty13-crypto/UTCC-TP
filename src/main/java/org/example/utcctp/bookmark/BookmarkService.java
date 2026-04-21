package org.example.utcctp.bookmark;

import lombok.RequiredArgsConstructor;
import org.example.utcctp.model.Bookmark;
import org.example.utcctp.model.InternshipPosition;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.BookmarkRepository;
import org.example.utcctp.repository.InternshipRepository;
import org.example.utcctp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;

    @Transactional
    public Bookmark addBookmark(Long userId, Long internshipId) {
        // Check if already bookmarked
        if (bookmarkRepository.existsByUserIdAndInternshipId(userId, internshipId)) {
            throw new RuntimeException("Internship already bookmarked");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        InternshipPosition internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setInternship(internship);
        
        return bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(Long userId, Long internshipId) {
        bookmarkRepository.deleteByUserIdAndInternshipId(userId, internshipId);
    }

    public List<InternshipPosition> getUserBookmarkedInternships(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookmarks.stream()
                .map(Bookmark::getInternship)
                .collect(Collectors.toList());
    }

    public boolean isBookmarked(Long userId, Long internshipId) {
        return bookmarkRepository.existsByUserIdAndInternshipId(userId, internshipId);
    }

    public List<Bookmark> getUserBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
