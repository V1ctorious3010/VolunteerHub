package com.example.backend.dto.Post;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long postId;
    private String content;
    private String attachment;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime createdAt;
    
    // Author info
    private String authorName;
    private String authorEmail;
    private String authorAvatar;
    
    // Event info
    private Long eventId;
    private String eventTitle;
    
    // Statistics
    private Long likeCount;
    private Long commentCount;
    private Boolean isLikedByMe;
    
    // Latest comment
    private CommentDto latestComment;
}
