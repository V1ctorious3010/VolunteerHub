import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { getAdminEvents, patchAdminEventStatus, exportAdminEvents } from '../../../utils/postApi';
import { useSelector } from 'react-redux';
import ROLE from '../../../constants/roles';
import { Spinner } from '@material-tailwind/react';
import Swal from 'sweetalert2';

const ManageVolunteerPost = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const user = useSelector(s => s.auth.user);
    const isAdmin = user?.role === ROLE.ADMIN || (Array.isArray(user?.roles) && user.roles.includes(ROLE.ADMIN));

    const loadEvents = async () => {
        setLoading(true);
        try {
            const resp = await getAdminEvents();
            let data = resp?.data;
            if (!Array.isArray(data)) {
                if (data?.content && Array.isArray(data.content)) data = data.content;
                else if (data?.data && Array.isArray(data.data)) data = data.data;
                else if (Array.isArray(data)) data = data;
                else data = [];
            }
            setEvents(data);
        } catch (err) {
            console.error('Failed to load admin events', err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) loadEvents();
        else setLoading(false);
    }, [isAdmin]);

    const handleExport = async (format) => {
        try {
            const resp = await exportAdminEvents(format);
            const blob = resp.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const ext = format === 'json' ? 'json' : 'csv';
            link.setAttribute('download', `events_export.${ext}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            Swal.fire('Thành công', 'Đã tải xuống danh sách sự kiện', 'success');
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
            Swal.fire('Cập nhật', 'trạng thái sự kiện', 'thành công');
            setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev));
        } catch (err) {
            console.error('Failed to change status', err);
            Swal.fire('Error', 'Failed to change status', 'error');
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

                    <div className="flex justify-end mb-4 px-4 gap-2 flex-wrap">
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
                                                    <td className="font-semibold px-4 py-3">{ev.title}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.category}</td>
                                                    <td className="font-semibold px-4 py-3">{formatDateOnly(ev.startTime)}</td>
                                                    <td className="font-semibold px-4 py-3">{formatDateOnly(ev.endTime)}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.location}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.orgName || ev.orgEmail}</td>
                                                    <td className="font-semibold px-4 py-3">{ev.status}</td>
                                                    <td className="px-4 py-3">
                                                        {ev.status === 'PENDING' ? (
                                                            <div className="flex items-center gap-2 justify-center">
                                                                <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, 'COMING')}>Duyệt</button>
                                                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, 'REJECTED')}>Từ chối</button>
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
                                                    <td className="px-4 py-3">{ev.title}</td>
                                                    <td className="px-4 py-3">{formatDateOnly(ev.startTime)}</td>
                                                    <td className="px-4 py-3">
                                                        {ev.status === 'PENDING' ? (
                                                            <div className="flex items-center gap-2">
                                                                <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, "COMING")}>Duyệt</button>
                                                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, "REJECT")}>Từ chối</button>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
