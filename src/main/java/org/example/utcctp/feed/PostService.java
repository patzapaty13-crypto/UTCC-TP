package org.example.utcctp.feed;

import org.example.utcctp.api.dto.PostResponse;
import org.example.utcctp.model.Post;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PostService {
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listAll() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PostResponse create(User author, Map<String, String> data) {
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(data.get("content"));
        post.setImageUrl(data.get("imageUrl"));
        postRepository.save(post);
        log.info("Created post {} by user {}", post.getId(), author.getId());
        return mapToResponse(post);
    }

    public void delete(UUID id, User user) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (!post.getAuthor().getId().equals(user.getId())) {
            log.warn("Unauthorized delete attempt: User {} tried to delete post {} owned by {}", 
                user.getId(), id, post.getAuthor().getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this post");
        }
        postRepository.delete(post);
        log.info("Deleted post {} by user {}", id, user.getId());
    }

    private PostResponse mapToResponse(Post p) {
        return new PostResponse(
                p.getId(),
                p.getAuthor().getDisplayName(),
                p.getAuthor().getProfilePictureUrl(),
                p.getAuthor().getMajor(),
                p.getContent(),
                p.getImageUrl(),
                p.getCreatedAt()
        );
    }
}
