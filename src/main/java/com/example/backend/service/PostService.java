package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.exception.*;
import com.example.backend.repo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    /**
     * Get all posts for an event with pagination
     * GET /api/events/{eventId}/posts
     * Auth: Public (read-only)
     */
    @Transactional(readOnly = true)
    public Page<PostDto> getEventPosts(Long eventId, String currentUserEmail, int page, int size) {
        log.info("Getting posts for event {}, page {}, size {}", eventId, page, size);

        // 1. Verify event exists and is not PENDING/REJECTED
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        if (event.getStatus() == Event.EventStatus.PENDING || 
            event.getStatus() == Event.EventStatus.REJECTED) {
            throw new ForbiddenException("Event is not available for posts");
        }

        // 2. Get posts with pagination
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postPage = postRepository.findByEventIdOrderByCreatedAtDesc(eventId, pageable);

        // 3. Map to PostDto
        return postPage.map(post -> mapToPostDto(post, currentUserEmail));
    }

    /**
     * Get post detail by id
     * GET /api/posts/{id}
     * Auth: Public
     */
    @Transactional(readOnly = true)
    public PostDto getPostDetail(Long postId, String currentUserEmail) {
        log.info("Getting post detail {}", postId);

        // 1. Find post
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Check event status
        if (post.getEvent().getStatus() == Event.EventStatus.PENDING || 
            post.getEvent().getStatus() == Event.EventStatus.REJECTED) {
            throw new ForbiddenException("Event is not available");
        }

        // 3. Map to DTO
        return mapToPostDto(post, currentUserEmail);
    }

    /**
     * Create new post
     * POST /api/events/{eventId}/posts
     * Auth: Approved members + Organizer ONLY
     */
    @Transactional
    public PostDto createPost(Long eventId, CreatePostRequest request, String authorEmail) {
        log.info("Creating post for event {} by {}", eventId, authorEmail);

        // 1. Verify event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        // 2. Check event status
        if (event.getStatus() == Event.EventStatus.PENDING || 
            event.getStatus() == Event.EventStatus.REJECTED) {
            throw new ForbiddenException("Cannot post in this event");
        }

        // 3. Verify authorization: organizer or approved member
        boolean isOrganizer = event.getOrganizer().getEmail().equals(authorEmail);
        
        if (!isOrganizer) {
            Registration registration = registrationRepository
                    .findByEventIdAndUserEmail(eventId, authorEmail)
                    .orElse(null);
            
            if (registration == null || registration.getStatus() != Registration.RequestStatus.APPROVED) {
                throw new ForbiddenException("Only approved members can create posts");
            }
        }

        // 4. Get author
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new UserNotFoundException(authorEmail));

        // 5. Create post
        Post post = new Post();
        post.setContent(request.getContent());
        post.setAttachment(request.getAttachment());
        post.setAuthor(author);
        post.setEvent(event);

        post = postRepository.save(post);
        log.info("Post {} created successfully", post.getId());

        return mapToPostDto(post, authorEmail);
    }

    /**
     * Update post
     * PUT /api/posts/{id}
     * Auth: Author only
     */
    @Transactional
    public PostDto updatePost(Long postId, UpdatePostRequest request, String userEmail) {
        log.info("Updating post {} by {}", postId, userEmail);

        // 1. Find post
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Verify author
        if (!post.getAuthor().getEmail().equals(userEmail)) {
            throw new ForbiddenException("You can only update your own posts");
        }

        // 3. Update post
        post.setContent(request.getContent());
        post.setAttachment(request.getAttachment());

        post = postRepository.save(post);
        log.info("Post {} updated successfully", postId);

        return mapToPostDto(post, userEmail);
    }

    /**
     * Delete post
     * DELETE /api/posts/{id}
     * Auth: Author OR Organizer
     */
    @Transactional
    public Map<String, String> deletePost(Long postId, String userEmail) {
        log.info("Deleting post {} by {}", postId, userEmail);

        // 1. Find post
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Verify authorization: author or organizer
        boolean isAuthor = post.getAuthor().getEmail().equals(userEmail);
        boolean isOrganizer = post.getEvent().getOrganizer().getEmail().equals(userEmail);

        if (!isAuthor && !isOrganizer) {
            throw new ForbiddenException("You can only delete your own posts or posts in your events");
        }

        // 3. Delete post (cascade delete likes and comments)
        postRepository.delete(post);
        log.info("Post {} deleted successfully", postId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        response.put("postId", postId.toString());
        return response;
    }

    /**
     * Like a post
     * POST /api/posts/{id}/like
     * Auth: Any authenticated user
     */
    @Transactional
    public Map<String, Object> likePost(Long postId, String userEmail) {
        log.info("User {} liking post {}", userEmail, postId);

        // 1. Find post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Check if already liked
        if (postLikeRepository.existsByUserEmailAndPostId(userEmail, postId)) {
            throw new BadRequestException("You already liked this post");
        }

        // 3. Get user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException(userEmail));

        // 4. Create like
        PostLike like = new PostLike();
        like.setUser(user);
        like.setPost(post);
        postLikeRepository.save(like);

        // 5. Get updated like count
        Long likeCount = postLikeRepository.countByPostId(postId);
        log.info("Post {} liked successfully. Total likes: {}", postId, likeCount);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post liked successfully");
        response.put("likeCount", likeCount);
        return response;
    }

    /**
     * Unlike a post
     * DELETE /api/posts/{id}/like
     * Auth: Any authenticated user
     */
    @Transactional
    public Map<String, Object> unlikePost(Long postId, String userEmail) {
        log.info("User {} unliking post {}", userEmail, postId);

        // 1. Find post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Find like
        PostLike like = postLikeRepository.findByUserEmailAndPostId(userEmail, postId)
                .orElseThrow(() -> new BadRequestException("You haven't liked this post"));

        // 3. Delete like
        postLikeRepository.delete(like);

        // 4. Get updated like count
        Long likeCount = postLikeRepository.countByPostId(postId);
        log.info("Post {} unliked successfully. Total likes: {}", postId, likeCount);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post unliked successfully");
        response.put("likeCount", likeCount);
        return response;
    }

    /**
     * Get for you posts (trending or recent from all events)
     * GET /posts/for-you?sort=trending
     * Auth: Public
     */
    @Transactional(readOnly = true)
    public Page<PostDto> getForYouPosts(String sort, int page, int size, String currentUserEmail) {
        log.info("Getting for-you posts (sort={}, page={}, size={})", sort, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage;
        if ("trending".equalsIgnoreCase(sort)) {
            // Trending: high engagement in last 3 days
            LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
            postPage = postRepository.findTrendingPosts(threeDaysAgo, pageable);
        } else {
            // Recent: latest posts from all events
            postPage = postRepository.findRecentPosts(pageable);
        }

        return postPage.map(post -> mapToPostDto(post, currentUserEmail));
    }

    private PostDto mapToPostDto(Post post, String currentUserEmail) {
        // Get statistics
        Long likeCount = postLikeRepository.countByPostId(post.getId());
        Long commentCount = commentRepository.countByPostId(post.getId());
        Boolean isLikedByMe = currentUserEmail != null && 
                postLikeRepository.existsByUserEmailAndPostId(currentUserEmail, post.getId());

        // Get latest comment
        CommentDto latestComment = commentRepository.findLatestByPostId(post.getId())
                .map(this::mapToCommentDto)
                .orElse(null);

        return PostDto.builder()
                .postId(post.getId())
                .content(post.getContent())
                .attachment(post.getAttachment())
                .createdAt(post.getCreatedAt())
                .authorName(post.getAuthor().getName())
                .authorEmail(post.getAuthor().getEmail())
                .authorAvatar(post.getAuthor().getAvatar())
                .eventTitle(post.getEvent().getTitle())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .isLikedByMe(isLikedByMe)
                .latestComment(latestComment)
                .build();
    }

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
