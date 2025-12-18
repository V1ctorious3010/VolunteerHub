import React, { useEffect, useState } from 'react';
import { Spinner } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { getEventRegistrations, patchRegistrationStatus } from '../../../utils/postApi';

const RegistrationsPanel = ({ selectedEvent, currentEventObj }) => {
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [regsPage, setRegsPage] = useState(0);
    const [regsSize] = useState(10);
    const [regsTotalPages, setRegsTotalPages] = useState(0);
    const [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
        if (!selectedEvent) return;
        let mounted = true;
        const loadRegs = async () => {
            setLoading(true);
            try {
                const rresp = await getEventRegistrations(selectedEvent, { page: regsPage, size: regsSize });
                const regsData = rresp?.data || { content: [], totalPages: 0 };
                if (!mounted) return;
                setRegistrations(regsData.content || []);
                setRegsTotalPages(rresp?.data?.totalPages ?? 0);
            } catch (err) {
                if (!mounted) return;
                setRegistrations([]);
                setRegsTotalPages(0);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadRegs();
        return () => { mounted = false };
    }, [selectedEvent, regsPage, regsSize, refreshCounter]);

    const handleAction = async (registrationId, status) => {
        try {
            const resp = await patchRegistrationStatus(registrationId, { status });
            const msg = resp?.data?.message;
            // update local state optimistically based on returned status
            setRegistrations(prev => prev.map(x => x.registrationId === registrationId ? { ...x, status } : x));
            setRefreshCounter(c => c + 1);
            if (msg) Swal.fire({ title: 'Thông báo', text: msg, icon: 'success' });
        } catch (err) {
            const emsg = err?.response?.data?.message || err.message || 'Lỗi';
            console.error('Registration action failed', err);
            Swal.fire({ title: 'Error', text: emsg, icon: 'error' });
        }
    };
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <Spinner className="h-8 w-8" />
                </div>
            ) : registrations && registrations.length > 0 ? (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Tổng đăng ký: {registrations.length}</h3>
                    <div className="overflow-x-auto">
                        <table className="table border-collapse border border-gray-400 w-full">
                            <thead>
                                <tr className="text-white raleway text-base bg-[#2986cc]">
                                    <th></th>
                                    <th>Tình nguyện viên</th>
                                    <th>Email</th>
                                    <th>Thời gian đăng ký</th>
                                    <th>Địa điểm</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((r, idx) => (
                                    <tr className="border border-gray-300" key={r.registrationId ?? r.id ?? idx}>
                                        <th className="font-semibold">{idx + 1}</th>
                                        <td className="font-semibold">{r.userName || r.userFullName || r.name}</td>
                                        <td className="font-semibold">{r.userEmail || r.email}</td>
                                        <td className="font-semibold">{r.registeredAt || r.eventStartTime}</td>
                                        <td className="font-semibold">{r.eventLocation || currentEventObj?.location || ''}</td>
                                        <td className="font-semibold">{r.status}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {r.status === 'PENDING' && (
                                                    <button className="btn btn-sm bg-green-500" onClick={() => handleAction(r.registrationId ?? r.id, 'APPROVED')}>Đồng ý</button>
                                                )}
                                                {r.status === 'PENDING' && (
                                                    <button className="btn btn-sm bg-red-500" onClick={() => handleAction(r.registrationId ?? r.id, 'REJECTED')}>Từ chối</button>
                                                )}
                                                {r.status === 'APPROVED' && (
                                                    <button className="btn btn-sm bg-indigo-300" onClick={() => handleAction(r.registrationId ?? r.id, 'COMPLETED')}>Hoàn thành</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-4">
                        <button className="btn" disabled={regsPage <= 0} onClick={() => setRegsPage(p => Math.max(0, p - 1))}>Prev</button>
                        <span>Page {regsPage + 1} / {regsTotalPages || 1}</span>
                        <button className="btn" disabled={regsPage + 1 >= (regsTotalPages || 1)} onClick={() => setRegsPage(p => p + 1)}>Next</button>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600">Không có đăng ký cho sự kiện này.</div>
            )}
        </>
    );
};

export default RegistrationsPanel;
