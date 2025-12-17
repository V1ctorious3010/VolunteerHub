package com.example.backend.repo;

import com.example.backend.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Find all posts by event with eager loading (filter locked authors)
    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author a
        LEFT JOIN FETCH p.event
        WHERE p.event.id = :eventId
        AND a.isLocked = false
        ORDER BY p.createdAt DESC
    """)
    Page<Post> findByEventIdOrderByCreatedAtDesc(@Param("eventId") Long eventId, Pageable pageable);

    // Find post by id with author and event (filter locked authors)
    @Query("""
        SELECT p FROM Post p
        LEFT JOIN FETCH p.author a
        LEFT JOIN FETCH p.event
        WHERE p.id = :postId
        AND a.isLocked = false
    """)
    Optional<Post> findByIdWithDetails(@Param("postId") Long postId);

    // Count likes for a post
    @Query("SELECT COUNT(l) FROM PostLike l WHERE l.post.id = :postId")
    Long countLikesByPostId(@Param("postId") Long postId);

    // Count comments for a post
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    Long countCommentsByPostId(@Param("postId") Long postId);

    // Count posts by event status (for statistics)
    @Query("SELECT COUNT(p) FROM Post p WHERE p.event.status IN :statuses")
    Long countByEventStatusIn(@Param("statuses") com.example.backend.entity.Event.EventStatus... statuses);

    // Find trending posts (high engagement in last 3 days, from all events)
    @Query("""
        SELECT p
        FROM Post p
        WHERE p.event.status IN ('COMING', 'ONGOING', 'FINISHED')
        AND p.author.isLocked = false
        ORDER BY (
            (SELECT COUNT(l) FROM PostLike l 
             WHERE l.post.id = p.id 
             AND l.createdAt >= :threeDaysAgo 
             AND l.user.isLocked = false) +
            (SELECT COUNT(c) FROM Comment c 
             WHERE c.post.id = p.id 
             AND c.createdAt >= :threeDaysAgo 
             AND c.user.isLocked = false)
        ) DESC, p.createdAt DESC
    """)
    Page<Post> findTrendingPosts(@Param("threeDaysAgo") java.time.LocalDateTime threeDaysAgo, Pageable pageable);

    // Find recent posts from all events
    @Query("""
        SELECT p FROM Post p
        WHERE p.event.status IN ('COMING', 'ONGOING', 'FINISHED')
        AND p.author.isLocked = false
        ORDER BY p.createdAt DESC
    """)
    Page<Post> findRecentPosts(Pageable pageable);
}
