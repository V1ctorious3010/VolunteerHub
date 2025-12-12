// Upload helper: fetch signature from backend, upload to cloud (Cloudinary), then notify backend with avatarUrl
export default async function handleUploadAnh(file) {
    if (!file) throw new Error('No file provided');

    // 1) get signature from backend
    const sigRes = await fetch('http://localhost:5000/user/signature', { credentials: 'include' });
    if (!sigRes.ok) throw new Error('Failed to get signature');
    const sig = await sigRes.json();
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
    const notify = await fetch('http://localhost:5000/user/avatar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl })
    });
    if (!notify.ok) {
        const txt = await notify.text().catch(() => 'notify failed');
        throw new Error('Failed to save avatar on server: ' + txt);
    }

    return avatarUrl;
}
