package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.entity.Registration.RequestStatus;
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
    @Autowired
    private NotificationProducer notificationProducer;

    /**
     * Check if user can create post in event
     * Used by frontend to show/hide create post button
     */
    @Transactional(readOnly = true)
    public boolean canUserCreatePost(Long eventId, String userEmail) {
        log.info("Checking post permission for user {} in event {}", userEmail, eventId);

        // 1. Verify event exists
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return false;
        }

        // 2. Check event status (cannot post in PENDING/REJECTED)
        if (event.getStatus() == Event.EventStatus.PENDING || 
            event.getStatus() == Event.EventStatus.REJECTED) {
            return false;
        }

        // 3. Check if user is organizer
        boolean isOrganizer = event.getOrganizer().getEmail().equals(userEmail);
        if (isOrganizer) {
            return true;
        }

        // 4. Check if user is approved member
        Registration registration = registrationRepository
                .findByEventIdAndUserEmail(eventId, userEmail)
                .orElse(null);
        
        return registration != null && 
               registration.getStatus() == Registration.RequestStatus.APPROVED;
    }

    /**
     * Get all posts for an event with pagination
     * GET /events/{eventId}/posts
     * Returns posts only from COMING, ONGOING, FINISHED events
     * Filters out posts from banned authors
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
     * Get single post detail
     * GET /posts/{id}
     * Verifies event is available (not PENDING/REJECTED)
     * Includes like/comment counts and latest comment
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
     * Create new post in event
     * POST /events/{eventId}/posts
     * Only approved volunteers and event organizer can post
     * Cannot post in PENDING or REJECTED events
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
            throw new ForbiddenException("Không thể đăng bài viết trong sự kiện này");
        }

        // 3. Verify authorization: organizer or approved member
        boolean isOrganizer = event.getOrganizer().getEmail().equals(authorEmail);
        
        if (!isOrganizer) {
            Registration registration = registrationRepository
                    .findByEventIdAndUserEmail(eventId, authorEmail)
                    .orElse(null);
            
            if (registration == null || registration.getStatus() != Registration.RequestStatus.APPROVED) {
                throw new ForbiddenException("Chỉ có thành viên được duyệt mới có thể đăng bài viết");
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
        String organizerEmail = event.getOrganizer().getEmail();
        String eventName = event.getTitle();
        try {
            String content = "Sự kiện " + eventName + " đã có thêm nội dung mới.";
            notificationProducer.send(
                organizerEmail,
                "EVENT_ORGANIZER",
                "Notification",
                content
            );
        } catch (Exception e) {
            throw new BadCredentialsAppException("Lỗi gửi thông báo");
        }
        log.info("Post {} created successfully", post.getId());

        return mapToPostDto(post, authorEmail);
    }

    /**
     * Update post content/attachment
     * PUT /posts/{id}
     * Only post author can update
     */
    @Transactional
    public PostDto updatePost(Long postId, UpdatePostRequest request, String userEmail) {
        log.info("Updating post {} by {}", postId, userEmail);

        // 1. Find post
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Verify author
        if (!post.getAuthor().getEmail().equals(userEmail)) {
            throw new ForbiddenException("Bạn chỉ có thể sửa bài viết của chính mình");
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
     * DELETE /posts/{id}
     * Post author OR event organizer can delete
     * Cascade deletes all likes and comments
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
            throw new ForbiddenException("Bạn chỉ có thể xóa bài viết của mình hoặc bài viết trong sự kiện của bạn");
        }

        // 3. Delete post (cascade delete likes and comments)
        postRepository.delete(post);
        log.info("Post {} deleted successfully", postId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã xóa bài viết thành công");
        response.put("postId", postId.toString());
        return response;
    }

    /**
     * Like a post
     * POST /posts/{id}/like
     * Prevents duplicate likes from same user
     */
    @Transactional
    public Map<String, Object> likePost(Long postId, String userEmail) {
        log.info("User {} liking post {}", userEmail, postId);

        // 1. Find post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Check if already liked
        if (postLikeRepository.existsByUserEmailAndPostId(userEmail, postId)) {
            throw new BadRequestException("Bạn đã thích bài viết này rồi");
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
        response.put("message", "Đã thích bài viết");
        response.put("likeCount", likeCount);
        return response;
    }

    /**
     * Remove like from post
     * DELETE /posts/{id}/like
     * Only removes if user previously liked the post
     */
    @Transactional
    public Map<String, Object> unlikePost(Long postId, String userEmail) {
        log.info("User {} unliking post {}", userEmail, postId);

        // 1. Find post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        // 2. Find like
        PostLike like = postLikeRepository.findByUserEmailAndPostId(userEmail, postId)
                .orElseThrow(() -> new BadRequestException("Bạn chưa thích bài viết này"));

        // 3. Delete like
        postLikeRepository.delete(like);

        // 4. Get updated like count
        Long likeCount = postLikeRepository.countByPostId(postId);
        log.info("Post {} unliked successfully. Total likes: {}", postId, likeCount);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã bỏ thích bài viết");
        response.put("likeCount", likeCount);
        return response;
    }

    /**
     * Get personalized post feed
     * GET /posts/for-you?sort=trending|recent
     * - trending: High engagement in last 3 days (posts, comments, likes)
     * - recent: Latest posts ordered by createdAt
     * Filters out posts from banned authors
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
                .eventId(post.getEvent().getId())
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
