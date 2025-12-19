import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardBody, Typography, Button, Spinner } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    getEventPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getPostComments,
    createComment,
    deleteComment,
    canCreatePost,
} from "../../../utils/feedApi";
import apiClient from "../../../utils/apiClient";
import handleUploadAnh from "../../../utils/handleUploadAnh";
import PostCard from "./components/PostCard";
import CreatePostForm from "./components/CreatePostForm";
import CommentDialog from "./components/CommentDialog";
import EditPostDialog from "./components/EditPostDialog";
import Swal from 'sweetalert2';

// centralize API error handling: toast and log response.data.message when available
const handleApiError = (context, error) => {
    const msg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
    console.error(context, error, 'responseMessage:', error?.response?.data?.message);
    try { toast.error(msg); } catch (e) { console.error('Toast failed', e); }
};

const EventFeed = () => {
    const { eventId } = useParams();
    const user = useSelector((s) => s.auth.user);

    // Event details
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    // Posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Post creation
    const [uploadingPost, setUploadingPost] = useState(false);
    const [canCreate, setCanCreate] = useState(false);

    // Comments
    const [showCommentsDialog, setShowCommentsDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [uploadingComment, setUploadingComment] = useState(false);

    // Edit post
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [updatingPost, setUpdatingPost] = useState(false);

    // Fetch event details
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoadingEvent(true);
                const response = await apiClient.get(`/events/${eventId}`);
                setEvent(response.data);
            } catch (error) {
                handleApiError('Error loading event', error);
            } finally {
                setLoadingEvent(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    // Check can-create permission
    useEffect(() => {
        const checkCanCreate = async () => {
            try {
                const resp = await canCreatePost(eventId);
                setCanCreate(Boolean(resp?.canCreate));
            } catch (e) {
                console.warn('Could not fetch can-create, defaulting to false', e);
                setCanCreate(false);
            }
        };
        if (eventId) checkCanCreate();
    }, [eventId]);

    // Fetch posts
    useEffect(() => {
        fetchPosts(0);
    }, [eventId]);

    const fetchPosts = async (page) => {
        try {
            setLoadingPosts(true);
            const response = await getEventPosts(eventId, page, 10);
            if (page === 0) {
                setPosts(response.content);
            } else {
                setPosts((prev) => [...prev, ...response.content]);
            }
            setCurrentPage(response.number);
            setHasMore(!response.last);
        } catch (error) {
            handleApiError('Error loading posts', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !loadingPosts) {
            fetchPosts(currentPage + 1);
        }
    };

    // Handle image upload
    const handleImageUpload = async (file) => {
        try {
            // prevent handleUploadAnh from notifying /user/avatar by default
            const url = await handleUploadAnh(file, { notifyUrl: null });
            return url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Không thể tải ảnh lên");
            return null;
        }
    };

    // Create new
    const handleCreatePost = async (content, attachment) => {
        if (!content.trim() && !attachment) {
            toast.error("Vui lòng nhập nội dung hoặc thêm ảnh");
            return;
        }
        try {
            setUploadingPost(true);
            let attachmentUrl = null;

            if (attachment) {
                attachmentUrl = await handleImageUpload(attachment);
                if (!attachmentUrl) return;
            }

            const newPost = await createPost(eventId, {
                content,
                attachment: attachmentUrl,
            });

            setPosts([newPost, ...posts]);
            toast.success("Đăng bài thành công!");
        } catch (error) {
            handleApiError('Error creating post', error);
        } finally {
            setUploadingPost(false);
        }
    };

    // Edit post
    const handleEditPost = async (content, attachment) => {
        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung");
            return;
        }

        try {
            setUpdatingPost(true);
            let attachmentUrl = editingPost.attachment;

            if (attachment) {
                attachmentUrl = await handleImageUpload(attachment);
                if (!attachmentUrl) return;
            }

            const updatedPost = await updatePost(editingPost.postId, {
                content,
                attachment: attachmentUrl,
            });

            setPosts(
                posts.map((p) => (p.postId === updatedPost.postId ? updatedPost : p))
            );
            setShowEditDialog(false);
            setEditingPost(null);
            toast.success("Cập nhật bài viết thành công!");
        } catch (error) {
            handleApiError('Error updating post', error);
        } finally {
            setUpdatingPost(false);
        }
    };

    // Delete post (use SweetAlert2 like MyVolunteerRequest)
    const handleDeletePost = async (postId) => {
        const result = await Swal.fire({
            title: "Bạn chắc chưa?",
            text: "Bạn sẽ không thể thay đổi lựa chọn này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Hãy xóa đi!",
            cancelButtonText: "Không",
        });

        if (!result.isConfirmed) return;

        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((p) => p.postId !== postId));
        } catch (error) {
            console.error('Error deleting post', error);
            const emsg = error?.response?.data?.message || error?.message || 'Lỗi khi xóa bài viết';
            handleApiError('Error deleting post', error);
        }
    };

    // Toggle like
    const handleToggleLike = async (post) => {
        try {
            if (post.isLikedByMe) {
                const response = await unlikePost(post.postId);
                setPosts(
                    posts.map((p) =>
                        p.postId === post.postId
                            ? { ...p, isLikedByMe: false, likeCount: response.likeCount }
                            : p
                    )
                );
            } else {
                const response = await likePost(post.postId);
                setPosts(
                    posts.map((p) =>
                        p.postId === post.postId
                            ? { ...p, isLikedByMe: true, likeCount: response.likeCount }
                            : p
                    )
                );
            }
        } catch (error) {
            handleApiError('Error toggling like', error);
        }
    };

    // Open comments dialog
    const handleOpenComments = async (post) => {
        setSelectedPost(post);
        setShowCommentsDialog(true);
        await fetchComments(post.postId);
    };

    const fetchComments = async (postId) => {
        try {
            setLoadingComments(true);
            const response = await getPostComments(postId, 0, 50);
            setComments(response.content);
        } catch (error) {
            handleApiError('Error loading comments', error);
        } finally {
            setLoadingComments(false);
        }
    };

    // Create comment
    const handleCreateComment = async (content, attachment) => {
        if (!content.trim() && !attachment) {
            toast.error("Vui lòng nhập nội dung hoặc thêm ảnh");
            return;
        }

        try {
            setUploadingComment(true);
            let attachmentUrl = null;

            if (attachment) {
                attachmentUrl = await handleImageUpload(attachment);
                if (!attachmentUrl) return;
            }

            const comment = await createComment(selectedPost.postId, {
                content,
                attachment: attachmentUrl,
            });

            setComments([comment, ...comments]);

            // Update post comment count
            setPosts(
                posts.map((p) =>
                    p.postId === selectedPost.postId
                        ? { ...p, commentCount: p.commentCount + 1, latestComment: comment }
                        : p
                )
            );

            toast.success("Bình luận thành công!");
        } catch (error) {
            handleApiError('Error creating comment', error);
        } finally {
            setUploadingComment(false);
        }
    };

    // Delete comment (use SweetAlert2 confirmation)
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            // compute new comments list for selected post
            const newComments = (comments || []).filter((c) => c.commentId !== commentId);
            setComments(newComments);

            // Update post comment count and latestComment based on remaining comments
            setPosts(
                posts.map((p) => {
                    if (p.postId !== selectedPost.postId) return p;
                    const newCount = Math.max(0, p.commentCount - 1);
                    const newLatest = newComments.length > 0 ? newComments[0] : null;
                    return { ...p, commentCount: newCount, latestComment: newLatest };
                })
            );

        } catch (error) {
            console.error('Error deleting comment', error);
            const emsg = error?.response?.data?.message || error?.message || 'Lỗi khi xóa bình luận';
            handleApiError('Error deleting comment', error);
        }
    };

    if (loadingEvent) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Typography variant="h4" color="red">
                    Không tìm thấy sự kiện
                </Typography>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>{event.title} - Trang sự kiện</title>
            </Helmet>

            {/* Event Header */}
            <div className="bg-white shadow-md mb-6">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-full max-w-4xl h-64 md:h-96 object-cover rounded-lg shadow-lg mb-4"
                        />
                        <Typography variant="h2" className="text-center mb-2">
                            {event.title}
                        </Typography>
                        <Typography variant="lead" className="text-gray-600 text-center">
                            {event.description}
                        </Typography>
                        <Typography variant="small" className="text-sm text-gray-500 text-center mt-2 italic">
                            Lưu ý: Chỉ người đăng ký đã được chấp nhận và chủ sự kiện mới có thể tạo bài viết.
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Create Post */}
                {user && (canCreate || user?.email === event?.orgEmail) && (
                    <CreatePostForm
                        user={user}
                        onSubmit={handleCreatePost}
                        uploading={uploadingPost}
                    />
                )}

                {/* Posts Feed */}
                <div className="space-y-4">
                    {loadingPosts && currentPage === 0 ? (
                        <div className="flex justify-center py-8">
                            <Spinner className="h-8 w-8" />
                        </div>
                    ) : posts.length === 0 ? (
                        <Card>
                            <CardBody>
                                <Typography className="text-center text-gray-600">
                                    Chưa có bài viết nào
                                </Typography>
                            </CardBody>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                currentUserEmail={user?.email}
                                eventOrgEmail={event?.orgEmail}
                                onToggleLike={handleToggleLike}
                                onOpenComments={handleOpenComments}
                                onEdit={(post) => {
                                    setEditingPost(post);
                                    setShowEditDialog(true);
                                }}
                                onDelete={handleDeletePost}
                            />
                        ))
                    )}

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center py-4">
                            <Button onClick={handleLoadMore} disabled={loadingPosts}>
                                {loadingPosts ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    "Xem thêm"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Dialog */}
            <CommentDialog
                open={showCommentsDialog}
                onClose={() => setShowCommentsDialog(false)}
                post={selectedPost}
                comments={comments}
                loading={loadingComments}
                user={user}
                eventOrgEmail={event?.orgEmail}
                onSubmitComment={handleCreateComment}
                onDeleteComment={handleDeleteComment}
                uploadingComment={uploadingComment}
            />

            {/* Edit Post Dialog */}
            <EditPostDialog
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                post={editingPost}
                onSubmit={handleEditPost}
                updating={updatingPost}
            />
        </div>
    );
};

export default EventFeed;
