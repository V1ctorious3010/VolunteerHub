package com.example.backend.service;

import com.example.backend.dto.Post.CommentDto;
import com.example.backend.dto.Post.CreateCommentRequest;
import com.example.backend.entity.*;
import com.example.backend.exception.*;
import com.example.backend.repo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    @Autowired
    private NotificationProducer notificationProducer;

    /**
     * Get all comments for a post with pagination
     * GET /posts/{postId}/comments
     * Returns comments only from available events (not PENDING/REJECTED)
     * Filters out comments from banned users
     * Sorted by createdAt DESC (newest first)
     */
    @Transactional(readOnly = true)
    public Page<CommentDto> getPostComments(Long postId, int page, int size) {
        log.info("Getting comments for post {}, page {}, size {}", postId, page, size);

        // 1. Verify post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Check event status
        if (post.getEvent().getStatus() == Event.EventStatus.PENDING || 
            post.getEvent().getStatus() == Event.EventStatus.REJECTED) {
            throw new ForbiddenException("Sự kiện không khả dụng");
        }

        // 3. Get comments with pagination
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentPage = commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);

        // 4. Map to CommentDto
        return commentPage.map(this::mapToCommentDto);
    }

    /**
     * Create new comment on post
     * POST /posts/{postId}/comments
     * Any authenticated user can comment
     * Cannot comment on posts in PENDING/REJECTED events
     */
    @Transactional
    public CommentDto createComment(Long postId, CreateCommentRequest request, String userEmail) {
        log.info("Creating comment for post {} by {}", postId, userEmail);

        // 1. Verify post exists
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Check event status
        if (post.getEvent().getStatus() == Event.EventStatus.PENDING || 
            post.getEvent().getStatus() == Event.EventStatus.REJECTED) {
            throw new ForbiddenException("Không thể bình luận bài viết trong sự kiện này");
        }

        // 3. Get user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException(userEmail));

        // 4. Create comment
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(request.getContent());
        comment.setAttachment(request.getAttachment());

        comment = commentRepository.save(comment);
        String author_email = post.getAuthor().getEmail();
        try {
            notificationProducer.send(
                author_email,
                user.getEmail(),
                "Notification",
                "Có comment mới trong post của bạn"
            );
        } catch (Exception e) {
            throw new BadCredentialsAppException("Lỗi gửi thông báo");
        }
        log.info("Comment {} created successfully", comment.getId());

        return mapToCommentDto(comment);
    }

    /**
     * Delete comment
     * DELETE /comments/{id}
     * Comment author OR event organizer can delete
     */
    @Transactional
    public Map<String, String> deleteComment(Long commentId, String userEmail) {
        log.info("Deleting comment {} by {}", commentId, userEmail);

        // 1. Find comment
        Comment comment = commentRepository.findByIdWithUser(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        // 2. Get post and event
        Post post = comment.getPost();
        Event event = post.getEvent();

        // 3. Verify authorization: author or organizer
        boolean isAuthor = comment.getUser().getEmail().equals(userEmail);
        boolean isOrganizer = event.getOrganizer().getEmail().equals(userEmail);

        if (!isAuthor && !isOrganizer) {
            throw new ForbiddenException("Bạn chỉ có thể xóa bình luận của mình hoặc bình luận trong sự kiện của bạn");
        }

        // 4. Delete comment
        commentRepository.delete(comment);
        log.info("Comment {} deleted successfully", commentId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã xóa bình luận thành công");
        response.put("commentId", commentId.toString());
        return response;
    }

    // Helper method to map Comment to CommentDto
    private CommentDto mapToCommentDto(Comment comment) {
        return CommentDto.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .attachment(comment.getAttachment())
                .createdAt(comment.getCreatedAt())
                .authorName(comment.getUser().getName())
                .authorEmail(comment.getUser().getEmail())
                .authorAvatar(comment.getUser().getAvatar())
                .build();
    }
}
