package com.example.backend.repo;

import com.example.backend.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    // Find like by user and post
    @Query("SELECT l FROM PostLike l WHERE l.user.email = :userEmail AND l.post.id = :postId")
    Optional<PostLike> findByUserEmailAndPostId(
        @Param("userEmail") String userEmail,
        @Param("postId") Long postId
    );

    // Check if user liked post
    @Query("SELECT COUNT(l) > 0 FROM PostLike l WHERE l.user.email = :userEmail AND l.post.id = :postId")
    boolean existsByUserEmailAndPostId(
        @Param("userEmail") String userEmail,
        @Param("postId") Long postId
    );

    // Count likes for post
    long countByPostId(Long postId);
}
