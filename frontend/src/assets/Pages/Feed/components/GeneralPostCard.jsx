import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Avatar,
    IconButton,
} from "@material-tailwind/react";
import {
    HeartIcon,
    ChatBubbleLeftIcon,
    TrashIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const GeneralPostCard = ({
    post,
    currentUserEmail,
    onToggleLike,
    onOpenComments,
    onEdit,
    onDelete,
}) => {
    const navigate = useNavigate();

    const handleEventClick = () => {
        if (post.eventId) {
            navigate(`/event-feed/${post.eventId}`);
        } else {
            console.warn('eventId not available for post', post.postId);
        }
    };

    return (
        <Card>
            <CardBody>
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                        <Avatar
                            src={post.authorAvatar || ""}
                            // alt={post.authorName}
                            size="sm"
                        />
                        <div>
                            {/* Event Title - Clickable */}
                            {post.eventTitle && (
                                <Typography
                                    variant="small"
                                    className="text-blue-600 hover:underline cursor-pointer font-medium"
                                    onClick={handleEventClick}
                                >
                                    {post.eventTitle}
                                </Typography>
                            )}
                            {/* Author Name */}
                            <Typography variant="h6" className="text-sm">
                                {post.authorName}
                            </Typography>
                            <Typography className="text-xs text-gray-600">
                                {post.createdAt}
                            </Typography>
                        </div>
                    </div>
                    {currentUserEmail === post.authorEmail && (
                        <div className="flex gap-2">
                            <IconButton
                                size="sm"
                                variant="text"
                                onClick={() => onEdit(post)}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                                size="sm"
                                variant="text"
                                color="red"
                                onClick={() => onDelete(post.postId)}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <Typography className="mb-3">{post.content}</Typography>

                {/* Post Image */}
                {post.attachment && (
                    <img
                        src={post.attachment}
                        alt="Post"
                        className="w-full rounded-lg mb-3"
                    />
                )}

                {/* Like and Comment Counts */}
                <div className="flex justify-between text-sm text-gray-600 mb-3 pb-3 border-b">
                    <span>{post.likeCount} lượt thích</span>
                    <span>{post.commentCount} bình luận</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="text"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => onToggleLike(post)}
                        color={post.isLikedByMe ? "red" : "gray"}
                    >
                        {post.isLikedByMe ? (
                            <HeartIconSolid className="h-5 w-5" />
                        ) : (
                            <HeartIcon className="h-5 w-5" />
                        )}
                        Thích
                    </Button>
                    <Button
                        size="sm"
                        variant="text"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => onOpenComments(post)}
                    >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        Bình luận
                    </Button>
                </div>

                {/* Latest Comment Preview */}
                {post.latestComment && (
                    <div className="mt-3 pt-3 border-t">
                        <div className="flex gap-2">
                            <Avatar
                                src={post.latestComment.authorAvatar || ""}
                                // alt={post.latestComment.authorName}
                                size="xs"
                            />
                            <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                                <Typography variant="small" className="font-semibold">
                                    {post.latestComment.authorName}
                                </Typography>
                                <Typography variant="small">
                                    {post.latestComment.content}
                                </Typography>
                                {post.latestComment.attachment && (
                                    <img
                                        src={post.latestComment.attachment}
                                        alt="Comment"
                                        className="mt-2 rounded max-h-32"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

GeneralPostCard.propTypes = {
    post: PropTypes.shape({
        postId: PropTypes.number.isRequired,
        eventId: PropTypes.number,
        eventTitle: PropTypes.string,
        content: PropTypes.string.isRequired,
        attachment: PropTypes.string,
        authorName: PropTypes.string.isRequired,
        authorEmail: PropTypes.string.isRequired,
        authorAvatar: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
        likeCount: PropTypes.number.isRequired,
        commentCount: PropTypes.number.isRequired,
        isLikedByMe: PropTypes.bool.isRequired,
        latestComment: PropTypes.object,
    }).isRequired,
    currentUserEmail: PropTypes.string,
    onToggleLike: PropTypes.func.isRequired,
    onOpenComments: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default GeneralPostCard;
