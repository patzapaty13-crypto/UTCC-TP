package org.example.utcctp.api;

import org.example.utcctp.api.dto.PostResponse;
import org.example.utcctp.feed.PostService;
import org.example.utcctp.user.CurrentUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {
    private final PostService postService;
    private final CurrentUserService currentUserService;

    public PostController(PostService postService, CurrentUserService currentUserService) {
        this.postService = postService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<PostResponse> list() {
        return postService.listAll();
    }

    @PostMapping
    public PostResponse create(@RequestBody Map<String, String> data) {
        return postService.create(currentUserService.requireUser(), data);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        postService.delete(id, currentUserService.requireUser());
    }
}
