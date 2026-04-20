package org.example.utcctp.api;

import org.example.utcctp.api.dto.PostResponse;
import org.example.utcctp.feed.PostService;
import org.example.utcctp.security.AuthUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<PostResponse> list() {
        return postService.listAll();
    }

    @PostMapping
    public PostResponse create(@AuthenticationPrincipal AuthUser user, @RequestBody Map<String, String> data) {
        return postService.create(user.getUser(), data);
    }

    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal AuthUser user, @PathVariable UUID id) {
        postService.delete(id, user.getUser());
    }
}
