// Upload helper: fetch signature from backend, upload to cloud (Cloudinary), then notify backend with avatarUrl
import api from './apiClient';

export default async function handleUploadAnh(file) {
    if (!file) throw new Error('No file provided');

    // 1) get signature from backend
    const sigResp = await api.get('/user/signature');
    if (!sigResp || !sigResp.data) throw new Error('Failed to get signature');
    const sig = sigResp.data;
    // expected fields: folder, signature, api_key, cloud_name, timestamp

    const cloudName = sig.cloud_name;
    if (!cloudName) throw new Error('Cloud name missing from signature');

    // 2) prepare form data for cloud upload
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sig.api_key);
    fd.append('timestamp', String(sig.timestamp));
    fd.append('signature', sig.signature);
    if (sig.folder) fd.append('folder', sig.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudRes = await fetch(uploadUrl, { method: 'POST', body: fd });
    if (!cloudRes.ok) {
        const txt = await cloudRes.text().catch(() => 'upload failed');
        throw new Error('Cloud upload failed: ' + txt);
    }
    const cloudJson = await cloudRes.json();
    const avatarUrl = cloudJson.secure_url || cloudJson.url;
    if (!avatarUrl) throw new Error('No URL returned from cloud upload');

    // 3) notify backend with avatarUrl
    const notifyResp = await api.post('/user/avatar', { avatarUrl });
    if (!notifyResp || notifyResp.status >= 400) throw new Error('Failed to save avatar on server');

    return avatarUrl;
}
