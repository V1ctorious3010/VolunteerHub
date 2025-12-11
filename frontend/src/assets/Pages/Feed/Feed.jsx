import { useEffect, useState } from "react";
import { getPosts } from "../../../utils/localApi";
import { getFeedPosts, addLocalFeedPost, updateLocalFeedPost } from "../../../utils/localApi";
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import PostComposer from "./components/PostComposer";
import FeedCard from "./components/FeedCard";
import CommentModal from "./components/CommentModal";
import LoadingGif from "../../Components/Loader/LoadingGif";
import { useSelector } from 'react-redux';

const Feed = ({ title }) => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentModal, setCommentModal] = useState({ open: false, postId: null });
  const [showLoader, setShowLoader] = useState(true);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    const load = async () => {
      // load base events and seed feed if empty
      const base = await getPosts();
      setEvents(base.map(b => ({ id: b.id, title: b.postTitle || b.title })));
      const feed = await getFeedPosts();
      // normalize for UI (no postTitle)
      const mapped = feed.map(p => ({
        id: p.id,
        thumbnail: p.thumbnail,
        description: p.description,
        authorName: p.authorName || p.orgName || '',
        authorEmail: p.authorEmail || p.orgEmail || '',
        eventId: p.eventId,
        eventTitle: p.eventTitle,
        likesBy: p.likesBy || [],
        comments: p.comments || [],
        date: p.date || '',
      }));
      setPosts(mapped.reverse());
    };
    load();
    // show loader briefly to match NeedVolunteer UX
    const t = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleCreate = async (payload) => {
    const id = Date.now();
    const newFeedPost = {
      id,
      description: payload.description,
      thumbnail: payload.thumbnail,
      authorName: user?.displayName || user?.name || '',
      authorEmail: user?.email || '',
      date: new Date().toLocaleDateString(),
      eventId: payload.eventId,
      eventTitle: payload.eventTitle,
      likesBy: [],
      comments: [],
    };
    try {
      addLocalFeedPost(newFeedPost);
      setPosts(prev => [{ ...newFeedPost }, ...prev]);
    } catch (err) {
      console.error(err);
      toast.error('Không lưu được bài viết');
    }
  };

  const toggleLike = async (id) => {
    if (!user?.email) return toast.error('Vui lòng đăng nhập để thích');
    // find post
    const p = posts.find(x => String(x.id) === String(id));
    if (!p) return;
    const liked = (p.likesBy || []).includes(user.email);
    const newLikes = liked ? p.likesBy.filter(x => x !== user.email) : [...(p.likesBy || []), user.email];
    try {
      const updated = updateLocalFeedPost(id, { likesBy: newLikes });
      setPosts(prev => prev.map(item => item.id === id ? { ...item, likesBy: updated.likesBy } : item));
    } catch (err) { console.error(err); }
  };

  const addComment = async (id, commentObj) => {
    if (!commentObj || !commentObj.text) return;
    const p = posts.find(x => String(x.id) === String(id));
    if (!p) return;
    const newComments = [...(p.comments || []), { ...commentObj, date: new Date().toLocaleString() }];
    try {
      const updated = updateLocalFeedPost(id, { comments: newComments });
      setPosts(prev => prev.map(item => item.id === id ? { ...item, comments: updated.comments } : item));
    } catch (err) { console.error(err); }
  };

  const handleShare = async (post) => {
    // open modal composer prefilled with this post's event (description left empty)
    setShareModal({
      open: true,
      initial: {
        initialDescription: '',
        initialThumbnail: '',
        initialEventId: post.eventId || '',
        originalPostId: post.id,
      }
    });
  };

  // share modal state
  const [shareModal, setShareModal] = useState({ open: false, initial: {} });

  const closeShareModal = () => setShareModal({ open: false, initial: {} });

  const handleShareCreate = async (payload) => {
    // reuse handleCreate logic but close modal after create
    await handleCreate(payload);
    // increment shares counter on the original post (if present)
    try {
      const origId = shareModal.initial?.originalPostId;
      if (origId) {
        const current = posts.find(p => String(p.id) === String(origId));
        const newShares = (current?.shares || 0) + 1;
        const updated = updateLocalFeedPost(origId, { shares: newShares });
        setPosts(prev => prev.map(item => item.id === origId ? { ...item, shares: updated.shares } : item));
      }
    } catch (err) {
      console.error('Failed to increment share count', err);
    }
    closeShareModal();
  };

  // events list for composer: use base events loaded earlier
  // map events state to expected shape
  const composerEvents = events.map(e => ({ id: e.id, postTitle: e.title, title: e.title }));

  return (
    <div className="py-16 font-qs">
      <div className="container mx-auto mb-6" data-aos="fade-left" data-aos-anchor-placement="top-bottom" data-aos-easing="linear" data-aos-duration="1500">
        <h2 className="text-2xl md:text-5xl font-bold text-center">Diễn đàn: Nơi chia sẻ cảm nhận và câu chuyện</h2>
        <p className="w-2/3 mx-auto md:text-lg mt-4 text-center leading-relaxed">Luôn kết nối — hãy chia sẻ những điểm nổi bật của sự kiện, các bản cập nhật và những câu chuyện tình nguyện từ cộng đồng của chúng ta.</p>
      </div>

      {posts.length === 0 && showLoader ? (
        <LoadingGif />
      ) : (
        <div className="container mx-auto">
          <PostComposer events={composerEvents} onCreate={handleCreate} />
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <div key={post.id} className="w-full">
                <FeedCard
                  post={post}
                  liked={!!likes[post.id]}
                  onToggleLike={toggleLike}
                  onOpenComments={(id) => setCommentModal({ open: true, postId: id })}
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>

          {commentModal.open && (
            <CommentModal
              open={true}
              post={posts.find(p => String(p.id) === String(commentModal.postId))}
              onClose={() => setCommentModal({ open: false, postId: null })}
              onAddComment={addComment}
              currentUser={user}
            />
          )}

          {shareModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" onClick={closeShareModal}></div>
              <div className="relative z-10 w-full max-w-3xl p-4">
                <div className="bg-white rounded-md shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Diễn đàn</h3>
                  <PostComposer
                    events={composerEvents}
                    onCreate={handleShareCreate}
                    initialDescription={shareModal.initial.initialDescription}
                    initialThumbnail={shareModal.initial.initialThumbnail}
                    initialEventId={shareModal.initial.initialEventId}
                    onCancel={closeShareModal}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Feed.propTypes = { title: PropTypes.string };

export default Feed;
