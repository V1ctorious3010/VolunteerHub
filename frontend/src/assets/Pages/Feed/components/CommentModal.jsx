import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const COMMENTS_PER_PAGE = 5;

const CommentModal = ({ post, open, onClose, onAddComment, currentUser }) => {
    const [page, setPage] = useState(1);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (open) {
            setPage(1);
            setInput('');
        }
    }, [open, post?.id]);

    if (!open || !post) return null;

    const comments = post.comments || [];
    const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE) || 1;
    const start = 0;
    const end = page * COMMENTS_PER_PAGE; // show `page` pages worth (load more semantics)
    const visible = comments.slice(0, end);

    const handleAdd = () => {
        const text = input && input.trim();
        if (!text) return;
        const name = currentUser?.displayName || currentUser?.name || currentUser?.email || 'Anonymous';
        onAddComment(post.id, { name, text });
        setInput('');
        // After adding, move to show the latest comments (ensure it's visible)
        setPage(Math.max(1, Math.ceil((comments.length + 1) / COMMENTS_PER_PAGE)));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl h-[80vh] bg-white rounded-md shadow-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                    <div className="text-lg font-semibold">{post.eventTitle}</div>
                    <div className="text-sm text-gray-600">by {post.authorName || post.orgName || 'Unknown'}</div>
                </div>

                <div className="p-4 border-b">
                    <p className="text-sm text-gray-700">{post.description}</p>
                    {post.thumbnail && <img src={post.thumbnail} alt={post.eventTitle} className="mt-3 w-full object-cover rounded" />}
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {visible.length === 0 && <div className="text-sm text-gray-500">Không bình luận. Bạn hãy là người đầu tiên bình luận</div>}
                    <ul className="space-y-3">
                        {visible.map((c, idx) => (
                            <li key={idx} className="p-3 bg-gray-50 rounded">
                                <div className="text-sm font-medium">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.date}</div>
                                <div className="mt-1 text-sm text-gray-700">{c.text}</div>
                            </li>
                        ))}
                    </ul>

                    {end < comments.length && (
                        <div className="mt-4 text-center">
                            <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setPage(p => p + 1)}>Xem thêm</button>
                        </div>
                    )}
                </div>

                {/* fixed add comment bar */}
                <div className="p-3 border-t bg-white">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            placeholder="Write a comment..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAdd}>Gửi</button>
                        <button className="px-3 py-2 bg-gray-200 rounded" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CommentModal.propTypes = {
    post: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
};

export default CommentModal;
