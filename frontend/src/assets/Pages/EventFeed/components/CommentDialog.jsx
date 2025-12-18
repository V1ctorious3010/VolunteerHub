import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Avatar,
    Textarea,
    IconButton,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import toast from 'react-hot-toast';
import { PhotoIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

const CommentDialog = ({
    open,
    onClose,
    post,
    comments,
    loading,
    user,
    eventOrgEmail,
    onSubmitComment,
    onDeleteComment,
    uploadingComment,
}) => {
    const [newComment, setNewComment] = useState("");
    const [commentAttachment, setCommentAttachment] = useState(null);
    const commentFileRef = useRef(null);

    const handleSubmit = async () => {
        if (!newComment || !newComment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        await onSubmitComment(newComment, commentAttachment);
        setNewComment("");
        setCommentAttachment(null);
    };

    return (
        <Dialog
            open={open}
            handler={onClose}
            size="md"
            className="max-h-[90vh] overflow-y-auto"
        >
            <DialogHeader>Bình luận</DialogHeader>
            <DialogBody divider className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Spinner className="h-6 w-6" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.commentId} className="flex gap-2">
                                <Avatar
                                    src={comment.authorAvatar || ""}
                                    //alt={ }
                                    size="sm"
                                />
                                <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                                        <div className="flex justify-between items-start">
                                            <Typography variant="small" className="font-semibold">
                                                {comment.authorName}
                                            </Typography>
                                            {(user?.email === comment.authorEmail || user?.email === eventOrgEmail || user?.email === post?.authorEmail) && (
                                                <IconButton
                                                    size="sm"
                                                    variant="text"
                                                    color="red"
                                                    onClick={() => onDeleteComment(comment.commentId)}
                                                >
                                                    <TrashIcon className="h-3 w-3" />
                                                </IconButton>
                                            )}
                                        </div>
                                        <Typography variant="small">{comment.content}</Typography>
                                        {comment.attachment && (
                                            <img
                                                src={comment.attachment}
                                                alt="Comment"
                                                className="mt-2 rounded max-h-32"
                                            />
                                        )}
                                    </div>
                                    <Typography className="text-xs text-gray-600 mt-1 ml-3">
                                        {comment.createdAt}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogBody>
            <DialogFooter className="flex-col gap-2">
                <div className="w-full flex gap-2">
                    <Avatar
                        src={user?.avatar || ""}
                        alt={user?.name}
                        size="sm"
                    />
                    <div className="flex-1">
                        <Textarea
                            placeholder="Viết bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                        />
                        {commentAttachment && (
                            <div className="mt-2 relative inline-block">
                                <img
                                    src={URL.createObjectURL(commentAttachment)}
                                    alt="Preview"
                                    className="h-20 rounded"
                                />
                                <IconButton
                                    size="sm"
                                    color="red"
                                    className="!absolute top-1 right-1"
                                    onClick={() => setCommentAttachment(null)}
                                >
                                    <XMarkIcon className="h-3 w-3" />
                                </IconButton>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div>
                        <input
                            ref={commentFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setCommentAttachment(e.target.files[0])}
                        />
                        <Button
                            size="sm"
                            variant="text"
                            onClick={() => commentFileRef.current && commentFileRef.current.click()}
                        >
                            <PhotoIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={uploadingComment || !newComment.trim()}
                    >
                        {uploadingComment ? <Spinner className="h-4 w-4" /> : "Gửi"}
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
};

CommentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    post: PropTypes.object,
    comments: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
    eventOrgEmail: PropTypes.string,
    onSubmitComment: PropTypes.func.isRequired,
    onDeleteComment: PropTypes.func.isRequired,
    uploadingComment: PropTypes.bool.isRequired,
};

export default CommentDialog;
