import apiClient from "./apiClient";

// ========== POST APIs ==========

/**
 * Get list of posts for a specific event
 * @param {number} eventId - The event ID
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 * @returns {Promise} - Response with paginated posts
 */
export const getEventPosts = async (eventId, page = 0, size = 10) => {
    try {
        const response = await apiClient.get(`/events/${eventId}/posts`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching event posts:", error);
        throw error;
    }
};

/**
 * Get details of a specific post
 * @param {number} postId - The post ID
 * @returns {Promise} - Response with post details
 */
export const getPostDetail = async (postId) => {
    try {
        const response = await apiClient.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post detail:", error);
        throw error;
    }
};

/**
 * Create a new post for an event
 * @param {number} eventId - The event ID
 * @param {Object} postData - Post data {content, attachment}
 * @returns {Promise} - Response with created post
 */
export const createPost = async (eventId, postData) => {
    try {
        const response = await apiClient.post(`/events/${eventId}/posts`, postData);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

/**
 * Update an existing post
 * @param {number} postId - The post ID
 * @param {Object} postData - Updated post data {content, attachment}
 * @returns {Promise} - Response with updated post
 */
export const updatePost = async (postId, postData) => {
    try {
        const response = await apiClient.put(`/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};

/**
 * Delete a post
 * @param {number} postId - The post ID
 * @returns {Promise} - Response with deletion confirmation
 */
export const deletePost = async (postId) => {
    try {
        const response = await apiClient.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};


/**
 * Like a post
 * @param {number} postId - The post ID
 * @returns {Promise} - Response with like confirmation and count
 */
export const likePost = async (postId) => {
    try {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }
};

/**
 * Unlike a post
 * @param {number} postId - The post ID
 * @returns {Promise} - Response with unlike confirmation and count
 */
export const unlikePost = async (postId) => {
    try {
        const response = await apiClient.delete(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error("Error unliking post:", error);
        throw error;
    }
};


/**
 * Get list of comments for a specific post
 * @param {number} postId - The post ID
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 10)
 * @returns {Promise} - Response with paginated comments
 */
export const getPostComments = async (postId, page = 0, size = 10) => {
    try {
        const response = await apiClient.get(`/posts/${postId}/comments`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching post comments:", error);
        throw error;
    }
};

/**
 * Create a new comment on a post
 * @param {number} postId - The post ID
 * @param {Object} commentData - Comment data {content, attachment}
 * @returns {Promise} - Response with created comment
 */
export const createComment = async (postId, commentData) => {
    try {
        const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

/**
 * Delete a comment
 * @param {number} commentId - The comment ID
 * @returns {Promise} - Response with deletion confirmation
 */
export const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

/**
 * Check if current user can create posts for an event
 * @param {number} eventId
 * @returns {Promise<{canCreate: boolean}>}
 */
export const canCreatePost = async (eventId) => {
    try {
        const response = await apiClient.get(`/events/${eventId}/posts/can-create`);
        return response.data;
    } catch (error) {
        console.error('Error checking can-create:', error);
        throw error;
    }
};

/**
 * Get posts for the general feed
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 9)
 * @param {string} sort - Sort type: 'trending' or 'recent'
 * @returns {Promise} - Response with paginated posts
 */
export const getForYouPosts = async (page = 0, size = 9, sort = 'trending') => {
    try {
        const response = await apiClient.get('/posts/for-you', {
            params: { page, size, sort }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching for-you posts:', error);
        throw error;
    }
};
