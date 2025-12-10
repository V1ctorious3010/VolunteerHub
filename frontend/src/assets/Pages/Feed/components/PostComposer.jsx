import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

const PostComposer = ({ events, onCreate, initialDescription = '', initialThumbnail = '', initialEventId = '', onCancel }) => {
  const [text, setText] = useState(initialDescription || '');
  const [filePreview, setFilePreview] = useState(initialThumbnail || null);
  const [file, setFile] = useState(null);
  const [eventId, setEventId] = useState(initialEventId || '');

  // update internal state when initial props change (useful for modal reuse)
  useEffect(() => {
    setText(initialDescription || '');
    setFilePreview(initialThumbnail || null);
    setFile(null);
    setEventId(initialEventId || '');
  }, [initialDescription, initialThumbnail, initialEventId]);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    if (!f) {
      setFilePreview(null);
      return;
    }
    const r = new FileReader();
    r.onload = () => setFilePreview(r.result);
    r.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) return toast.error('Please select an event to attach the post to.');
    let thumbnail = '';
    if (file) {
      const toData = (f) => new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
      try { thumbnail = await toData(file); } catch (err) { console.error(err); }
    }
    const ev = events.find(x => String(x.id) === String(eventId));
    const payload = {
      description: text,
      thumbnail,
      eventId: ev?.id,
      eventTitle: ev?.postTitle || ev?.title || 'Event',
    };
    onCreate(payload);
    setText('');
    setFile(null);
    setFilePreview(null);
    setEventId('');
    if (typeof onCancel === 'function') onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow mb-6">
      <h3 className="font-bold mb-2">Create a post</h3>
      <textarea placeholder="Share something..." value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-2 rounded mb-2" />
      <div className="flex gap-2 items-center mb-2">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="border p-2 rounded">
          <option value="">-- Select Event (required) --</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.postTitle || ev.title}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>
      {filePreview && <img src={filePreview} alt="preview" className="mb-2 h-32 object-cover rounded" />}
      <div className="flex justify-end">
        <div className="flex gap-2">
          {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>}
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Post</button>
        </div>
      </div>
    </form>
  );
};

PostComposer.propTypes = {
  events: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  initialDescription: PropTypes.string,
  initialThumbnail: PropTypes.string,
  initialEventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
};

export default PostComposer;
