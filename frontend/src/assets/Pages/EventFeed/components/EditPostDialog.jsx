import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Textarea,
    Spinner,
} from "@material-tailwind/react";
import { PhotoIcon } from "@heroicons/react/24/outline";

const EditPostDialog = ({ open, onClose, post, onSubmit, updating }) => {
    const [editContent, setEditContent] = useState("");
    const [editAttachment, setEditAttachment] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (post) {
            setEditContent(post.content || "");
            setEditAttachment(null);
        }
    }, [post]);

    const handleSubmit = async () => {
        await onSubmit(editContent, editAttachment);
        setEditContent("");
        setEditAttachment(null);
    };

    const handleClose = () => {
        setEditContent("");
        setEditAttachment(null);
        onClose();
    };

    return (
        <Dialog open={open} handler={handleClose} size="md">
            <DialogHeader>Chỉnh sửa bài viết</DialogHeader>
            <DialogBody divider>
                <Textarea
                    label="Nội dung"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                />
                {(post?.attachment || editAttachment) && (
                    <div className="mt-3">
                        <img
                            src={
                                editAttachment
                                    ? URL.createObjectURL(editAttachment)
                                    : post?.attachment
                            }
                            alt="Preview"
                            className="h-32 rounded-lg"
                        />
                    </div>
                )}
                <div className="mt-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setEditAttachment(e.target.files[0])}
                    />
                    <Button
                        size="sm"
                        variant="outlined"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Thay đổi ảnh
                    </Button>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" onClick={handleClose} className="mr-2">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} disabled={updating}>
                    {updating ? <Spinner className="h-4 w-4" /> : "Lưu"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

EditPostDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    post: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    updating: PropTypes.bool.isRequired,
};

export default EditPostDialog;
