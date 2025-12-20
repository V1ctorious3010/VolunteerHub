import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Spinner,
    Tabs,
    TabsHeader,
    Tab,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    getForYouPosts,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getPostComments,
    createComment,
    deleteComment,
} from "../../../utils/feedApi";
import handleUploadAnh from "../../../utils/handleUploadAnh";
import GeneralPostCard from "./components/GeneralPostCard";
import CommentDialog from "../EventFeed/components/CommentDialog";
import EditPostDialog from "../EventFeed/components/EditPostDialog";
import JoinedEventsSidebar from "./components/JoinedEventsSidebar";
import Swal from 'sweetalert2';

// centralize API error handling
const handleApiError = (context, error) => {
    const msg = error?.response?.data?.message || error?.message || "Có lỗi xảy ra";
    console.error(context, error, "responseMessage:", error?.response?.data?.message);
    try {
        toast.error(msg);
    } catch (e) {
        console.error("Toast failed", e);
    }
};

const Feed = () => {
    const user = useSelector((s) => s.auth.user);

    // Posts
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [sortType, setSortType] = useState("trending");

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

    // Fetch posts
    useEffect(() => {
        fetchPosts(0, sortType);
    }, [sortType]);

    const fetchPosts = async (page, sort) => {
        try {
            setLoadingPosts(true);
            const response = await getForYouPosts(page, 9, sort);
            if (page === 0) {
                setPosts(response.content);
            } else {
                setPosts((prev) => [...prev, ...response.content]);
            }
            setCurrentPage(response.number);
            setHasMore(!response.last);
        } catch (error) {
            handleApiError("Error loading posts", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !loadingPosts) {
            fetchPosts(currentPage + 1, sortType);
        }
    };

    const handleSortChange = (value) => {
        setSortType(value);
        setCurrentPage(0);
        setHasMore(true);
    };

    // Handle image upload
    const handleImageUpload = async (file) => {
        try {
            const url = await handleUploadAnh(file, { notifyUrl: null });
            return url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Không thể tải ảnh lên");
            return null;
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

            setPosts(posts.map((p) => (p.postId === updatedPost.postId ? updatedPost : p)));
            setShowEditDialog(false);
            setEditingPost(null);
            toast.success("Cập nhật bài viết thành công!");
        } catch (error) {
            handleApiError("Error updating post", error);
        } finally {
            setUpdatingPost(false);
        }
    };

    // Delete post (use SweetAlert2 confirmation)
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
            await Swal.fire('Thông báo', 'Xóa bài viết thành công!', 'success');
        } catch (error) {
            console.error('Error deleting post', error);
            const emsg = error?.response?.data?.message || error?.message || 'Lỗi khi xóa bài viết';
            Swal.fire('Error', emsg, 'error');
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
            handleApiError("Error toggling like", error);
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
            handleApiError("Error loading comments", error);
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
            handleApiError("Error creating comment", error);
        } finally {
            setUploadingComment(false);
        }
    };

    // Delete comment (use SweetAlert2 confirmation)
    const handleDeleteComment = async (commentId) => {

        try {
            await deleteComment(commentId);
            setComments((prev) => prev.filter((c) => c.commentId !== commentId));

            // Update post comment count
            setPosts(
                posts.map((p) =>
                    p.postId === selectedPost.postId
                        ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
                        : p
                )
            );

        } catch (error) {
            console.error('Error deleting comment', error);
            const emsg = error?.response?.data?.message || error?.message || 'Lỗi khi xóa bình luận';
            Swal.fire('Error', emsg, 'error');
            handleApiError("Error deleting comment", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Helmet>
                <title>Diễn đàn - VolunteerHub</title>
            </Helmet>

            {/* Left Sidebar - Joined Events */}
            {user && <JoinedEventsSidebar />}

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-white shadow-md mb-6">
                    <div className="container mx-auto px-4 py-6">
                        <Typography variant="h3" className="text-center mb-4">
                            Diễn đàn
                        </Typography>
                        <Typography variant="lead" className="text-gray-600 text-center">
                            Nơi cộng đồng chia sẻ thông tin minh bạch và tin cậy
                        </Typography>
                        <Typography variant="small" className="text-sm text-gray-500 text-center my-2 italic">
                            Hãy tham gia sự kiện để tạo bài viết.
                        </Typography>

                        {/* Sort Tabs */}
                        <div className="flex justify-center">
                            <Tabs value={sortType} className="w-full max-w-md">
                                <TabsHeader>
                                    <Tab value="trending" onClick={() => handleSortChange("trending")}>
                                        Nổi bật
                                    </Tab>
                                    <Tab value="recent" onClick={() => handleSortChange("recent")}>
                                        Mới nhất
                                    </Tab>
                                </TabsHeader>
                            </Tabs>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="container mx-auto px-4 max-w-3xl pb-8">
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
                                <GeneralPostCard
                                    key={post.postId}
                                    post={post}
                                    currentUserEmail={user?.email}
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
                                    {loadingPosts ? <Spinner className="h-4 w-4" /> : "Xem thêm"}
                                </Button>
                            </div>
                        )}
                    </div>
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
                eventOrgEmail={null}
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

export default Feed;
