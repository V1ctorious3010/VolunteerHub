import React, { useEffect, useState } from 'react';
import Loader from '../../Components/Loader/Loader';
import { getEventReport } from '../../../utils/postApi';

const ParticipantsPanel = ({ selectedEvent, currentEventObj }) => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [partPage, setPartPage] = useState(0);
    const [partSize] = useState(20);
    const [partTotalPages, setPartTotalPages] = useState(0);

    useEffect(() => {
        if (!selectedEvent) return;
        let mounted = true;
        const loadReport = async () => {
            setLoading(true);
            try {
                const resp = await getEventReport(selectedEvent, { page: partPage, size: partSize });
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
    }, [selectedEvent, partPage, partSize]);
    console.log(report);
    return (
        <>
            {loading ? (
                <Loader />
            ) : report && report.length > 0 ? (
                <div>
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
                                        <th className="font-semibold">{(report.volunteers?.number || 0) * (report.volunteers?.size || 0) + idx + 1}</th>
                                        <td className="font-semibold">{v.name || v.userEmail}</td>
                                        <td className="font-semibold">{v.email || v.userEmail}</td>
                                        <td className="font-semibold">{currentEventObj?.startTime || v.registeredAt}</td>
                                        <td className="font-semibold">{currentEventObj?.location || ''}</td>
                                        <td className="font-semibold">{v.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-4">
                        <button className="btn" disabled={partPage <= 0} onClick={() => setPartPage(p => Math.max(0, p - 1))}>Prev</button>
                        <span>Page {(report.volunteers?.number || 0) + 1} / {report.volunteers?.totalPages || 1}</span>
                        <button className="btn" disabled={partPage + 1 >= (partTotalPages || 1)} onClick={() => setPartPage(p => p + 1)}>Next</button>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600">Không có dữ liệu báo cáo cho sự kiện này.</div>
            )}
        </>
    );
};

export default ParticipantsPanel;
