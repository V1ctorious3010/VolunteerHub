import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { getAdminEvents, patchAdminEventStatus } from '../../../../utils/postApi';
import { useSelector } from 'react-redux';
import ROLE from '../../../../constants/roles';
import Loader from '../../../Components/Loader/Loader';
import Swal from 'sweetalert2';

const ManageVolunteerPost = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const user = useSelector(s => s.auth.user);
    const isAdmin = user?.role === ROLE.ADMIN || (Array.isArray(user?.roles) && user.roles.includes(ROLE.ADMIN));

    useEffect(() => {
        const load = async () => {
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
        if (isAdmin) load();
        else setLoading(false);
    }, [isAdmin]);

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
            // console.log(status);
            setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev));
        } catch (err) {
            console.error('Failed to change status', err);
            Swal.fire('Error', 'Failed to change status', 'error');
        }
    };

    if (loading) return <Loader />;
    if (!isAdmin) return (
        <div className="p-8 text-center text-gray-600">Chỉ admin mới có thể truy cập trang này.</div>
    );

    return (
        <div className="container mx-auto p-6">
            <Helmet><title>{title}</title></Helmet>
            <h1 className="text-2xl font-bold mb-4 text-center">Duyệt sự kiện</h1>
            {events.length === 0 ? (
                <div className="text-gray-600 text-center">Không có sự kiện cần duyệt.</div>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <div className="overflow-x-auto ">
                            <table className="table border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#2986cc]">
                                        <th></th>
                                        <th>Tiêu đề</th>
                                        <th>Phân loại</th>
                                        <th>Thời gian bắt đầu</th>
                                        <th>Thời gian kết thúc</th>
                                        <th>Địa điểm</th>
                                        <th>Tổ chức</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((ev, idx) => (
                                        <tr className="border border-gray-300" key={ev.id}>
                                            <th className="font-semibold">{idx + 1}</th>
                                            <td className="font-semibold">{ev.title}</td>
                                            <td className="font-semibold">{ev.category}</td>
                                            <td className="font-semibold">{ev.startTime}</td>
                                            <td className="font-semibold">{ev.endTime}</td>
                                            <td className="font-semibold">{ev.location}</td>
                                            <td className="font-semibold">{ev.orgName || ev.orgEmail}</td>
                                            <td className="font-semibold">{ev.status}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, 'COMING')}>Duyệt</button>
                                                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, 'REJECTED')}>Từ chối</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <div className="overflow-x-auto ">
                            <table className="table border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#DE00DF]">
                                        <th>Tiêu đề</th>
                                        <th>Thời gian bắt đầu</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((ev) => (
                                        <tr className="border border-gray-300" key={ev.id}>
                                            <td>{ev.title}</td>
                                            <td>{ev.startTime}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => changeStatus(ev.id, "COMING")}>Duyệt</button>
                                                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => changeStatus(ev.id, "REJECT")}>Từ chối</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ManageVolunteerPost.propTypes = {
    title: PropTypes.object.isRequired,
};

export default ManageVolunteerPost;
