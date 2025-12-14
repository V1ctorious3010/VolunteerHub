import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Loader from '../../../Components/Loader/Loader';
import { getMyEvents, getEventReport } from '../../../../utils/postApi';

const EventList = ({ title }) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [report, setReport] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const currentEvent = events.find(e => e.id === (typeof selectedEvent === 'number' ? selectedEvent : Number(selectedEvent)));

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const resp = await getMyEvents();
                let data = resp?.data;
                if (!Array.isArray(data)) {
                    if (data?.content && Array.isArray(data.content)) data = data.content;
                    else if (data?.data && Array.isArray(data.data)) data = data.data;
                    else if (Array.isArray(data)) data = data;
                    else data = [];
                }
                setEvents(data);
                if (data.length > 0) setSelectedEvent(data[0].id);
            } catch (err) {
                console.error('Failed to load events', err);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!selectedEvent) return;
        const loadReport = async () => {
            setLoading(true);
            try {
                const resp = await getEventReport(selectedEvent, { page, size });
                setReport(resp?.data || null);
            } catch (err) {
                console.error('Failed to load report', err);
                setReport(null);
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    }, [selectedEvent, page, size]);

    if (loading) return <Loader />;

    return (
        <div className="container font-qs mx-auto space-y-5 p-6">
            <Helmet><title>{title}</title></Helmet>
            <h2 className="text-xl font-semibold mb-4 text-center">Danh sách tình nguyện viên theo sự kiện</h2>

            <div className="flex items-center gap-4 mb-4">
                <label className="font-semibold">Chọn sự kiện:</label>
                <select
                    value={selectedEvent ?? ''}
                    onChange={e => { setSelectedEvent(Number(e.target.value)); setPage(0); }}
                    className="border rounded p-2"
                >
                    {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                </select>
            </div>

            {report ? (
                <div>
                    <div className="mb-4">
                        <span className="mr-4">Tổng đăng ký: <strong>{report.totalRegistrations}</strong></span>
                        <span className="mr-4">Đã chấp nhận: <strong>{report.approvedCount}</strong></span>
                        <span className="mr-4">Hoàn thành: <strong>{report.completedCount}</strong></span>
                        <span className="mr-4">Chờ duyệt: <strong>{report.pendingCount}</strong></span>
                        <span className="mr-4">Từ chối: <strong>{report.rejectedCount}</strong></span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table border-collapse border border-gray-400 w-full">
                            <thead>
                                <tr className="text-white raleway text-base bg-[#2986cc]">
                                    <th></th>
                                    <th>Tình nguyện viên</th>
                                    <th>Email</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Địa điểm</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.volunteers?.content?.map((v, idx) => (
                                    <tr className="border border-gray-300" key={v.userEmail ?? `${idx}`}>
                                        <th className="font-semibold">{report.volunteers.number * report.volunteers.size + idx + 1}</th>
                                        <td className="font-semibold">{v.name || v.userEmail}</td>
                                        <td className="font-semibold">{v.email || v.userEmail}</td>
                                        <td className="font-semibold">{currentEvent?.startTime || v.registeredAt}</td>
                                        <td className="font-semibold">{currentEvent?.location || ''}</td>
                                        <td className="font-semibold">{v.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-4">
                        <button className="btn" disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</button>
                        <span>Page {(report.volunteers?.number || 0) + 1} / {report.volunteers?.totalPages || 1}</span>
                        <button className="btn" disabled={page + 1 >= (report.volunteers?.totalPages || 1)} onClick={() => setPage(p => p + 1)}>Next</button>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600">Không có dữ liệu báo cáo cho sự kiện này.</div>
            )}
        </div>
    );
};

EventList.propTypes = {
    title: PropTypes.object.isRequired,
};

export default EventList;
