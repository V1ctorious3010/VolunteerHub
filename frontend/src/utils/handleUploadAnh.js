// Upload helper: fetch signature from backend, upload to cloud (Cloudinary), then optionally notify backend with the uploaded URL
import api from './apiClient';

/**
 * Upload a file to Cloudinary using a server-signed signature and return the uploaded URL.
 * options:
 *  - signatureUrl: backend endpoint to request upload signature (default: '/user/signature')
 *  - notifyUrl: backend endpoint to POST the resulting URL to (default: '/user/avatar').
 *               Set to null/false to skip notifying the backend.
 */
export default async function handleUploadAnh(file, options = {}) {
    if (!file) throw new Error('No file provided');

    const signatureUrl = options.signatureUrl || '/user/signature';
    const notifyUrl = options.hasOwnProperty('notifyUrl') ? options.notifyUrl : '/user/avatar';

    // 1) get signature from backend
    const sigResp = await api.get(signatureUrl);
    if (!sigResp || !sigResp.data) throw new Error('Failed to get signature');
    const sig = sigResp.data;
    // expected fields: folder, signature, api_key, cloud_name, timestamp

    const cloudName = sig.cloud_name || sig.cloudName;
    if (!cloudName) throw new Error('Cloud name missing from signature');

    // 2) prepare form data for cloud upload
    const fd = new FormData();
    fd.append('file', file);
    if (sig.api_key) fd.append('api_key', sig.api_key);
    if (sig.timestamp) fd.append('timestamp', String(sig.timestamp));
    if (sig.signature) fd.append('signature', sig.signature);
    if (sig.folder) fd.append('folder', sig.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudRes = await fetch(uploadUrl, { method: 'POST', body: fd });
    if (!cloudRes.ok) {
        const txt = await cloudRes.text().catch(() => 'upload failed');
        throw new Error('Cloud upload failed: ' + txt);
    }
    const cloudJson = await cloudRes.json();
    const uploadedUrl = cloudJson.secure_url || cloudJson.url;
    if (!uploadedUrl) throw new Error('No URL returned from cloud upload');

    // 3) optionally notify backend with uploaded URL
    if (notifyUrl) {
        try {
            await api.post(notifyUrl, { avatarUrl: uploadedUrl });
        } catch (e) {
            console.warn('Failed to notify backend about uploaded file', e);
        }
    }

    return uploadedUrl;
}
