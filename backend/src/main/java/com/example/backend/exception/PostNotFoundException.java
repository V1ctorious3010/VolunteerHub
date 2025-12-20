package com.example.backend.exception;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Long postId) {
        super("Không tìm thấy bài viết với ID: " + postId);
    }
}
