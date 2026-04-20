package org.example.utcctp.feed;

import org.example.utcctp.api.dto.PostResponse;
import org.example.utcctp.model.Post;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

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
        return mapToResponse(post);
    }

    public void delete(UUID id, User user) {
        Post post = postRepository.findById(id).orElseThrow();
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        postRepository.delete(post);
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
