import React, { useEffect, useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { getEventReport, patchRegistrationStatus } from '../../../utils/postApi';

const ParticipantsPanel = ({ selectedEvent, currentEventObj }) => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [partPage, setPartPage] = useState(0);
    const [partSize] = useState(20);
    const [partTotalPages, setPartTotalPages] = useState(0);
    const [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
        if (!selectedEvent) return;
        let mounted = true;
        const loadReport = async () => {
            setLoading(true);
            try {
                // Fetch APPROVED and COMPLETED participants
                const resp = await getEventReport(selectedEvent, {
                    page: partPage,
                    size: partSize,
                    status: 'APPROVED,COMPLETED'
                });
                if (!mounted) return;
                const rep = resp?.data || null;
                setReport(rep);
                setPartTotalPages(rep?.volunteers?.totalPages ?? 0);
            } catch (err) {
                if (!mounted) return;
                setReport(null);
                setPartTotalPages(0);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadReport();
        return () => { mounted = false };
    }, [selectedEvent, partPage, partSize, refreshCounter]);
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

    const handleComplete = async (userEmail) => {
        try {
            // Find the registration for this user
            const volunteer = report?.volunteers?.content?.find(v => v.email === userEmail || v.userEmail === userEmail);
            if (!volunteer) {
                Swal.fire({ title: 'Lỗi', text: 'Không tìm thấy tình nguyện viên', icon: 'error' });
                return;
            }

            // Get registration ID from the volunteer data or find it via API
            // For now, we'll need to pass registrationId from backend in VolunteerReportDto
            // Assuming we add registrationId to the DTO response
            const resp = await patchRegistrationStatus(volunteer.registrationId, { status: 'COMPLETED' });
            const msg = resp?.data?.message;

            // Refresh the list
            setRefreshCounter(c => c + 1);

            if (msg) {
                Swal.fire({ title: 'Thông báo', text: msg, icon: 'success' });
            }
        } catch (err) {
            const emsg = err?.response?.data?.message || err.message || 'Lỗi';
            console.error('Complete action failed', err);
            Swal.fire({ title: 'Lỗi', text: emsg, icon: 'error' });
        }
    };

    const mapStatus = (s) => {
        if (!s) return '';
        const key = String(s).toUpperCase();
        switch (key) {
            case 'APPROVED': return 'Chấp nhận';
            case 'REJECTED': return 'Từ chối';
            case 'COMPLETED': return 'Hoàn thành';
            case 'PENDING': return 'Chờ duyệt';
            default: return s;
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <Spinner className="h-8 w-8" />
                </div>
            ) : report && report.volunteers.content.length > 0 ? (
                <div>
                    <div className="overflow-x-auto">
                        <table className="table border-collapse border border-gray-400 w-full text-center">
                            <thead>
                                <tr className="text-white raleway text-base bg-[#2986cc]">
                                    <th></th>
                                    <th>Tình nguyện viên</th>
                                    <th>Email</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Địa điểm</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.volunteers?.content?.map((v, idx) => (
                                    <tr className="border border-gray-300" key={v.userEmail ?? `${idx}`}>
                                        <th className="font-semibold">{(report.volunteers?.number || 0) * (report.volunteers?.size || 0) + idx + 1}</th>
                                        <td className="font-semibold">{v.name || v.userEmail}</td>
                                        <td className="font-semibold">{v.email || v.userEmail}</td>
                                        <td className="font-semibold">{formatDateOnly(currentEventObj?.startTime || v.registeredAt)}</td>
                                        <td className="font-semibold">{currentEventObj?.location || ''}</td>
                                        <td className="font-semibold">{mapStatus(v.status)}</td>
                                        <td>
                                            {v.status === 'APPROVED' ? (
                                                <button
                                                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                                                    onClick={() => handleComplete(v.email || v.userEmail)}
                                                >
                                                    Hoàn thành
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-4">
                        <button className="btn" disabled={partPage <= 0} onClick={() => setPartPage(p => Math.max(0, p - 1))}>Trước</button>
                        <span>Trang {(report.volunteers?.number || 0) + 1} / {report.volunteers?.totalPages || 1}</span>
                        <button className="btn" disabled={partPage + 1 >= (partTotalPages || 1)} onClick={() => setPartPage(p => p + 1)}>Sau</button>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600 text-center">Không có dữ liệu báo cáo cho sự kiện này.</div>
            )}
        </>
    );
};

export default ParticipantsPanel;
