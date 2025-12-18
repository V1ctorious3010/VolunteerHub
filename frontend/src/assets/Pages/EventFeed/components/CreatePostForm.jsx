import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    CardFooter,
    Button,
    Avatar,
    Textarea,
    IconButton,
    Spinner,
} from "@material-tailwind/react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CreatePostForm = ({ user, onSubmit, uploading }) => {
    const [content, setContent] = useState("");
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async () => {
        await onSubmit(content, attachment);
        setContent("");
        setAttachment(null);
    };

    return (
        <Card className="mb-6">
            <CardBody>
                <div className="flex gap-3">
                    <Avatar
                        src={user.avatar || ""}
                        alt={user.name}
                        size="sm"
                    />
                    <div className="flex-1">
                        <Textarea
                            placeholder="Chia sẻ suy nghĩ của bạn..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                        />
                        {attachment && (
                            <div className="mt-2 relative inline-block">
                                <img
                                    src={URL.createObjectURL(attachment)}
                                    alt="Preview"
                                    className="h-32 rounded-lg"
                                />
                                <IconButton
                                    size="sm"
                                    color="red"
                                    className="!absolute top-1 right-1"
                                    onClick={() => setAttachment(null)}
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </IconButton>
                            </div>
                        )}
                    </div>
                </div>
            </CardBody>
            <CardFooter className="pt-0 flex justify-between">
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setAttachment(e.target.files[0])}
                    />
                    <Button
                        size="sm"
                        variant="text"
                        className="flex items-center gap-2"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        aria-label="Chọn ảnh"
                    >
                        <PhotoIcon className="h-5 w-5" />
                        Ảnh
                    </Button>
                </div>
                <Button size="sm" onClick={handleSubmit} disabled={uploading}>
                    {uploading ? <Spinner className="h-4 w-4" /> : "Đăng"}
                </Button>
            </CardFooter>
        </Card>
    );
};

CreatePostForm.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    uploading: PropTypes.bool.isRequired,
};

export default CreatePostForm;
