import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FeedCard = ({ post, liked, onToggleLike, onOpenComments, onShare }) => {
  const targetId = post.eventId || post.id;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-150 p-4 group">
      <div className="mb-2">
        <h4 className="text-xl font-bold text-gray-800">
          <Link to={`/post-details/${targetId}`} className="hover:underline hover:text-gray-900 transition-colors">
            {post.eventTitle}
          </Link>
        </h4>
      </div>
      <div className="mb-4 text-sm text-gray-500">bởi <span className="font-medium">{post.authorName || post.orgName || 'Unknown'}</span></div>

      <p className="text-sm text-gray-600 mb-4">{post.description}</p>

      {post.thumbnail && (
        <div className="mb-4">
          <img src={post.thumbnail} alt={post.eventTitle || 'feed image'} className="w-full object-cover rounded-lg" />
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div>{(post.likesBy || []).length} Thích</div>
        <div>{(post.comments || []).length} Bình luận</div>
        <div>{post.shares || 0} Chia sẻ</div>
      </div>

      <div className="flex border-t pt-2">
        <button
          className={`flex-1 py-2 text-center ${liked ? 'text-red-600 font-semibold' : 'text-gray-700'} transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 cursor-pointer`}
          onClick={() => onToggleLike(post.id)}
        >
          {liked ? 'Đã thích' : 'Thích'}
        </button>
        <button
          className="flex-1 py-2 text-center text-gray-700 border-l border-r transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          onClick={() => onOpenComments(post.id)}
        >
          Bình luận
        </button>
        <button
          className="flex-1 py-2 text-center text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          onClick={() => onShare(post)}
        >
          Chia sẻ
        </button>
      </div>
    </div>
  );
};

FeedCard.propTypes = {
  post: PropTypes.object.isRequired,
  liked: PropTypes.bool,
  onToggleLike: PropTypes.func.isRequired,
  onOpenComments: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default FeedCard;
