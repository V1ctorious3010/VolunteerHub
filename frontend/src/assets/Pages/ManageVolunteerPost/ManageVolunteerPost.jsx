import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAdminEvents, patchAdminEventStatus } from '../../../utils/postApi';
import { deleteEventByAdmin } from '../../../utils/adminApi';
import { truncateChars } from '../../../utils/textUtils';
import { useSelector } from 'react-redux';
import ROLE from '../../../constants/roles';
import { Spinner } from '@material-tailwind/react';
import Swal from 'sweetalert2';

const ManageVolunteerPost = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState(null);
    const user = useSelector(s => s.auth.user);
    const isAdmin = user?.role === ROLE.ADMIN || (Array.isArray(user?.roles) && user.roles.includes(ROLE.ADMIN));

    const STATUS_LABELS = {
        PENDING: 'Chờ duyệt',
        COMING: 'Sắp diễn ra',
        REJECTED: 'Từ chối',
        ONGOING: 'Đang diễn ra',
        FINISHED: 'Hoàn thành',
    };

    const loadEvents = async () => {
        setLoading(true);
        try {
            const params = { page };
            if (status) params.status = status;
            const resp = await getAdminEvents(params);
            let data = resp?.data;
            let items = [];
            if (data && Array.isArray(data.content)) {
                items = data.content;
                setTotalPages(data.totalPages || 1);
            } else if (data && Array.isArray(data.data)) {
                items = data.data;
                setTotalPages(1);
            } else if (Array.isArray(data)) {
                items = data;
                setTotalPages(1);
            } else if (data && typeof data === 'object') {
                // single object
                items = [data];
                setTotalPages(1);
            } else {
                items = [];
                setTotalPages(1);
            }
            setEvents(items);
        } catch (err) {
            console.error('Failed to load admin events', err);
            setEvents([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) loadEvents();
        else setLoading(false);
    }, [isAdmin, status, page]);

    const handleExport = async (format) => {
        try {
            if (!events || events.length === 0) {
                Swal.fire('Thông báo', 'Không có sự kiện để xuất', 'info');
                return;
            }

            if (format === 'json') {
                const content = JSON.stringify(events, null, 2);
                const blob = new Blob([content], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `events_export.json`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                Swal.fire('Thành công', 'Đã tải xuống danh sách sự kiện (JSON)', 'success');
                return;
            }

            // CSV export
            const toCSV = (arr) => {
                if (!arr || arr.length === 0) return '';
                const keys = Array.from(arr.reduce((set, obj) => {
                    if (!obj || typeof obj !== 'object') return set;
                    Object.keys(obj).forEach(k => set.add(k));
                    return set;
                }, new Set()));

                const escape = (val) => {
                    if (val === null || val === undefined) return '';
                    const s = typeof val === 'object' ? JSON.stringify(val) : String(val);
                    return '"' + s.replace(/"/g, '""') + '"';
                };

                const header = keys.map(k => escape(k)).join(',');
                const rows = arr.map(obj => keys.map(k => escape(obj[k])).join(','));
                return [header, ...rows].join('\r\n');
            };

            const csv = toCSV(events);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `events_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            Swal.fire('Thành công', 'Đã tải xuống danh sách sự kiện (CSV)', 'success');
        } catch (err) {
            console.error('Export failed', err);
            Swal.fire('Lỗi', 'Không thể tải danh sách sự kiện', 'error');
        }
    };

    const changeStatus = async (id, status) => {
        const confirm = await Swal.fire({
            title: `Bạn muốn ${status === "COMING" ? 'chấp nhận' : 'từ chối'} sự kiện này?`,
            showCancelButton: true,
            icon: 'question',
        });
        if (!confirm.isConfirmed) return;

        try {
            await patchAdminEventStatus(id, { status });
            setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev));
        } catch (err) {
            console.error('Failed to change status', err);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Bạn có chắc muốn xóa sự kiện này?',
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Xóa',
        });
        if (!confirm.isConfirmed) return;

        try {
            setDeletingId(id);
            await deleteEventByAdmin(id);
            setEvents(prev => prev.filter(ev => ev.id !== id));
            Swal.fire('Đã xóa', 'Sự kiện đã được xóa', 'success');
        } catch (err) {
            console.error('Delete failed', err);
            Swal.fire('Lỗi', 'Không thể xóa sự kiện', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDateOnly = (v) => {
        if (!v) return "";
        const s = String(v).trim();
        const datePart = s.split(" ")[0];
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) return datePart;
        const d = new Date(s);
        if (isNaN(d)) return datePart;
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }
    if (!isAdmin) return (
        <div className="p-8 text-center text-gray-600">Chỉ admin mới có thể truy cập trang này.</div>
    );

    return (
        <div className="font-qs md:p-6 mb-6">
            <Helmet><title>{title}</title></Helmet>

            <div className="md:w-4/5 mx-auto min-h-[calc(100vh-364px)] my-12">
                <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md">
                    <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize">
                        Duyệt sự kiện
                    </h2>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 px-4 gap-2">
                        <div className="flex items-center gap-2">
                            <label className="mr-2 font-medium">Trạng thái:</label>
                            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="border p-2 rounded-md">
                                <option value="">Tất cả</option>
                                {Object.keys(STATUS_LABELS).map((k) => (
                                    <option key={k} value={k}>{STATUS_LABELS[k]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end mb-0 md:mb-0 px-0 gap-2 flex-wrap">
                            <button
                                onClick={() => handleExport('json')}
                                disabled={loading || events.length === 0}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                            >
                                Xuất JSON
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                disabled={loading || events.length === 0}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
                            >
                                Xuất CSV
                            </button>
                            <button
                                onClick={loadEvents}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
                            >
                                {loading ? 'Đang tải...' : 'Tải lại'}
                            </button>
                        </div>
                    </div>

                    {/* Users table */}
                    {events.length === 0 ? (
                        <div className="text-gray-600 text-center">Không có sự kiện cần duyệt.</div>
                    ) : (
                        <div>
                            <div className="hidden md:block">
                                <div className="overflow-x-auto ">
                                    <table className="table border-collapse border border-gray-400 w-full text-center">
                                        <thead>
                                            <tr className="text-white raleway text-base bg-[#2986cc]">
                                                <th className="px-4 py-3"></th>
                                                <th className="px-4 py-3">Tiêu đề</th>
                                                <th className="px-4 py-3">Phân loại</th>
                                                <th className="px-4 py-3">Thời gian bắt đầu</th>
                                                <th className="px-4 py-3">Thời gian kết thúc</th>
                                                <th className="px-4 py-3">Địa điểm</th>
                                                <th className="px-4 py-3">Tổ chức</th>
                                                <th className="px-4 py-3">Trạng thái</th>
                                                <th className="px-4 py-3">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map((ev, idx) => (
                                                <tr className="border border-gray-300" key={ev.id}>
                                                    <th className="font-semibold px-4 py-3">{idx + 1}</th>
                                                    <td className="font-semibold px-4 py-3">
                                                        <Link
                                                            to={`/post-details/${ev.id}`}
                                                            className="hover:underline"
                                                        >
                                                            {truncateChars(ev.title, 15)}
                                                        </Link>
                                                    </td>
                                                    <td className="font-semibold px-4 py-3">{ev.category}</td>
                                                    <td className="font-semibold px-4 py-3">{formatDateOnly(ev.startTime)}</td>
                                                    <td className="font-semibold px-4 py-3">{formatDateOnly(ev.endTime)}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.location}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.orgName || ev.orgEmail}</td>
                                                    <td className="font-semibold px-4 py-3">{STATUS_LABELS[ev.status] || ev.status}</td>
                                                    <td className="px-4 py-3  justify-center">
                                                        {ev.status === 'PENDING' ? (
                                                            <div className="flex items-center gap-2 justify-center">
                                                                <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, 'COMING')}>Duyệt</button>
                                                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, 'REJECTED')}>Từ chối</button>
                                                            </div>
                                                        ) : null}
                                                        {ev.status !== 'PENDING' ? (
                                                            <div className="flex items-center justify-center mt-2">
                                                                <button
                                                                    className="px-3 py-1 bg-gray-500 text-white rounded"
                                                                    onClick={() => handleDelete(ev.id)}
                                                                    disabled={deletingId === ev.id}
                                                                >
                                                                    {deletingId === ev.id ? 'Đang xóa...' : 'Xóa'}
                                                                </button>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                            <div className="md:hidden">
                                <div className="overflow-x-auto ">
                                    <table className="table border-collapse border border-gray-400 w-full text-center">
                                        <thead>
                                            <tr className="text-white raleway text-base bg-[#2986cc]">
                                                <th className="px-4 py-3">Tiêu đề</th>
                                                <th className="px-4 py-3">Thời gian bắt đầu</th>
                                                <th className="px-4 py-3">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map((ev) => (
                                                <tr className="border border-gray-300" key={ev.id}>
                                                    <td className="px-4 py-3">
                                                        <Link
                                                            to={`/post-details/${ev.id}`}
                                                            className="hover:underline"
                                                        >
                                                            {truncateChars(ev.title, 15)}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3">{formatDateOnly(ev.startTime)}</td>
                                                    <td className="px-4 py-3">
                                                        {ev.status === 'PENDING' ? (
                                                            <div className="flex items-center gap-2  justify-center">
                                                                <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, "COMING")}>Duyệt</button>
                                                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, "REJECT")}>Từ chối</button>
                                                            </div>
                                                        ) : null}
                                                        {ev.status !== 'PENDING' ? (
                                                            <div className="flex items-center justify-center mt-2">
                                                                <button
                                                                    className="px-3 py-1 bg-gray-500 text-white rounded"
                                                                    onClick={() => handleDelete(ev.id)}
                                                                    disabled={deletingId === ev.id}
                                                                >
                                                                    {deletingId === ev.id ? 'Đang xóa...' : 'Xóa'}
                                                                </button>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 mb-4 mt-4">
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} className="px-3 py-2 bg-gray-200 rounded" disabled={page <= 0}>Trước </button>
                                <div className="px-3 py-2">Trang  {page + 1} / {totalPages}</div>
                                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} className="px-3 py-2 bg-gray-200 rounded" disabled={page + 1 >= totalPages}>Sau </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

ManageVolunteerPost.propTypes = {
    title: PropTypes.string.isRequired,
};

export default ManageVolunteerPost;
