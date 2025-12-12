import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

const UserInfo = ({ title }) => {
    const user = useSelector(s => s.auth.user) || {};
    const [preview, setPreview] = useState(user?.avatarUrl || user?.avatar || null);

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFile = (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        setSelectedFile(f);
        const r = new FileReader();
        r.onload = () => setPreview(r.result);
        r.readAsDataURL(f);
    };

    const handleSave = async () => {
        if (!selectedFile) return alert('Chọn ảnh trước khi lưu');
        try {
            const { default: upload } = await import('../../../utils/handleUploadAnh');
            const url = await upload(selectedFile);
            // update local storage user copy so UI reflects new avatar
            try {
                const raw = localStorage.getItem('vh_auth_user');
                const obj = raw ? JSON.parse(raw) : {};
                obj.avatar = url;
                obj.avatarUrl = url;
                localStorage.setItem('vh_auth_user', JSON.stringify(obj));
            } catch (_) { }
            // reload to ensure navbar and other components read updated avatar
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Upload thất bại: ' + (err.message || ''));
        }
    };

    const initials = (user?.name || user?.email || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

    return (
        <div className="py-16 font-qs">
            <Helmet><title>{title}</title></Helmet>
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-6">Thông tin người dùng</h2>
                <div className="flex items-center gap-8">
                    <div className="relative w-36 h-36">
                        {preview ? (
                            <img src={preview} alt="avatar" className="w-36 h-36 rounded-full object-cover" />
                        ) : (
                            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">{initials}</div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 rounded-full cursor-pointer transition-opacity">
                            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                            <span className="text-white px-3 py-1 rounded bg-black/60">Chọn ảnh</span>
                        </label>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">{user?.name || '—'}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <div className="mt-4 flex gap-3">
                            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md">Lưu thay đổi</button>
                            <button onClick={() => { setSelectedFile(null); setPreview(user?.avatar || null); }} className="px-4 py-2 bg-gray-200 rounded-md">Hủy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
