import PropTypes from 'prop-types';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) return null;
  return (
    <div className="mt-3">
      {comments.map((c, i) => (
        <div key={i} className="mb-2">
          <div className="text-sm font-bold">{c.name}</div>
          <div className="text-sm text-gray-700">{c.text}</div>
        </div>
      ))}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array,
};

export default CommentList;
