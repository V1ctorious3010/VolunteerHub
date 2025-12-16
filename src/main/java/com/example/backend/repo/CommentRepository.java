package com.example.backend.repo;

import com.example.backend.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Find all comments by post with user info (filter locked users)
    @Query("""
        SELECT c FROM Comment c
        LEFT JOIN FETCH c.user u
        WHERE c.post.id = :postId
        AND u.isLocked = false
        ORDER BY c.createdAt DESC
    """)
    Page<Comment> findByPostIdOrderByCreatedAtDesc(@Param("postId") Long postId, Pageable pageable);

    // Find latest comment for a post (filter locked users)
    @Query("""
        SELECT c FROM Comment c
        LEFT JOIN FETCH c.user u
        WHERE c.post.id = :postId
        AND u.isLocked = false
        ORDER BY c.createdAt DESC
        LIMIT 1
    """)
    Optional<Comment> findLatestByPostId(@Param("postId") Long postId);

    // Find comment with user info
    @Query("""
        SELECT c FROM Comment c
        LEFT JOIN FETCH c.user
        WHERE c.id = :commentId
    """)
    Optional<Comment> findByIdWithUser(@Param("commentId") Long commentId);

    // Count comments for post (filter locked users)
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.user.isLocked = false")
    long countByPostId(@Param("postId") Long postId);
}
