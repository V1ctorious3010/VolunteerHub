package com.example.backend.exception;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(Long commentId) {
        super("Không tìm thấy bình luận với ID: " + commentId);
    }
}
