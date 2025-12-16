package com.example.backend.controller;

import com.example.backend.dto.CommentDto;
import com.example.backend.dto.CreateCommentRequest;
import com.example.backend.service.CommentService;
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
@RequestMapping("")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    /**
     * Get all comments for a post
     * GET /posts/{postId}/comments
     * Auth: Public
     * Sort: createdAt DESC (newest first)
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<CommentDto>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("GET /posts/{}/comments (page={}, size={})", postId, page, size);

        Page<CommentDto> comments = commentService.getPostComments(postId, page, size);
        return ResponseEntity.ok(comments);
    }

    /**
     * Create new comment
     * POST /posts/{postId}/comments
     * Auth: Any authenticated user
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("POST /posts/{}/comments by {}", postId, userEmail);

        CommentDto comment = commentService.createComment(postId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    /**
     * Delete comment
     * DELETE /comments/{id}
     * Auth: Author OR Organizer of event
     */
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("DELETE /comments/{} by {}", id, userEmail);

        Map<String, String> response = commentService.deleteComment(id, userEmail);
        return ResponseEntity.ok(response);
    }
}
