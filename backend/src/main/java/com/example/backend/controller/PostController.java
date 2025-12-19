package com.example.backend.controller;

import com.example.backend.dto.CreatePostRequest;
import com.example.backend.dto.PostDto;
import com.example.backend.dto.UpdatePostRequest;
import com.example.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    /**
     * Check if user can create post in event
     * GET /events/{eventId}/posts/can-create
     * Auth: Required
     */
    @GetMapping("/events/{eventId}/posts/can-create")
    public ResponseEntity<Map<String, Boolean>> canCreatePost(
            @PathVariable Long eventId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("GET /events/{}/posts/can-create by user: {}", eventId, userEmail);

        boolean canCreate = postService.canUserCreatePost(eventId, userEmail);
        return ResponseEntity.ok(Map.of("canCreate", canCreate));
    }

    /**
     * Get all posts for an event
     * GET /events/{eventId}/posts?page=0&size=10
     * Auth: Public (any user can view)
     */
    @GetMapping("/events/{eventId}/posts")
    public ResponseEntity<Page<PostDto>> getEventPosts(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String userEmail = authentication != null ? authentication.getName() : null;
        log.info("GET /events/{}/posts by user: {}", eventId, userEmail);

        Page<PostDto> posts = postService.getEventPosts(eventId, userEmail, page, size);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get for you posts (trending or recent from all events)
     * GET /posts/for-you?sort=trending&page=0&size=9
     * Auth: Public
     */
    @GetMapping("/posts/for-you")
    public ResponseEntity<Page<PostDto>> getForYouPosts(
            @RequestParam(defaultValue = "trending") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            Authentication authentication) {

        String userEmail = authentication != null ? authentication.getName() : null;
        log.info("GET /posts/for-you (sort={}, page={}, size={}) by user: {}", sort, page, size, userEmail);

        Page<PostDto> posts = postService.getForYouPosts(sort, page, size, userEmail);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get post detail
     * GET /posts/{id}
     * Auth: Public
     */
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDto> getPostDetail(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication != null ? authentication.getName() : null;
        log.info("GET /posts/{} by user: {}", id, userEmail);

        PostDto post = postService.getPostDetail(id, userEmail);
        return ResponseEntity.ok(post);
    }

    /**
     * Create new post
     * POST /events/{eventId}/posts
     * Auth: Approved members + Organizer ONLY
     */
    @PostMapping("/events/{eventId}/posts")
    public ResponseEntity<PostDto> createPost(
            @PathVariable Long eventId,
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {

        String authorEmail = authentication.getName();
        log.info("POST /events/{}/posts by {}", eventId, authorEmail);

        PostDto post = postService.createPost(eventId, request, authorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    /**
     * Update post
     * PUT /posts/{id}
     * Auth: Author only
     */
    @PutMapping("/posts/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("PUT /posts/{} by {}", id, userEmail);

        PostDto post = postService.updatePost(id, request, userEmail);
        return ResponseEntity.ok(post);
    }

    /**
     * Delete post
     * DELETE /posts/{id}
     * Auth: Author OR Organizer
     */
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("DELETE /posts/{} by {}", id, userEmail);

        Map<String, String> response = postService.deletePost(id, userEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Like a post
     * POST /posts/{id}/like
     * Auth: Any authenticated user
     */
    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("POST /posts/{}/like by {}", id, userEmail);

        Map<String, Object> response = postService.likePost(id, userEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Unlike a post
     * DELETE /posts/{id}/like
     * Auth: Any authenticated user
     */
    @DeleteMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Object>> unlikePost(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("DELETE /posts/{}/like by {}", id, userEmail);

        Map<String, Object> response = postService.unlikePost(id, userEmail);
        return ResponseEntity.ok(response);
    }
}
