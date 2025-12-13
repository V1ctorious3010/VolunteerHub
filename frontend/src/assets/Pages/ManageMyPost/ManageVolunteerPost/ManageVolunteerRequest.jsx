import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getMyEvents, getEventRegistrations, patchRegistrationStatus } from '../../../../utils/postApi';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PageError from "../../ErrorPage/PageError";
import Loader from "../../../Components/Loader/Loader";
import LoadingGif from "../../../Components/Loader/LoadingGif";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

const ManageVolunteerRequest = ({ title }) => {
    const user = useSelector(s => s.auth.user);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const resp = await getMyEvents();
                const content = resp?.data?.content || [];
                setEvents(content);
                if (content.length > 0) setSelectedEvent(content[0].id);
            } catch (err) {
                setEvents([]);
            }
        };
        loadEvents();
    }, [user?.id]);

    useEffect(() => {
        const loadRegs = async () => {
            if (!selectedEvent) {
                setRegistrations([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const resp = await getEventRegistrations(selectedEvent, { page, size });
                const content = resp?.data?.content || [];
                setRegistrations(content);
                setTotalPages(resp?.data?.totalPages ?? 0);
            } catch (err) {
                setRegistrations([]);
            } finally {
                setLoading(false);
            }
        };
        loadRegs();
    }, [selectedEvent, page]);

    const handleStatusChange = (registrationId, status) => {
        const actionText = status === 'APPROVED' ? 'Approve' : status === 'REJECTED' ? 'Reject' : 'Mark Complete';
        Swal.fire({
            title: `${actionText} this registration?`,
            showCancelButton: true,
            confirmButtonText: actionText,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await patchRegistrationStatus(registrationId, { status });
                    const updated = registrations.map(r => (r.registrationId === registrationId || r.id === registrationId) ? { ...r, status } : r);
                    setRegistrations(updated);
                    Swal.fire('Success', 'Status updated', 'success');
                } catch (err) {
                    Swal.fire('Error', 'Unable to update status', 'error');
                }
            }
        });
    };

    if (navigate.state === "loading") return <Loader />;

    return (
        <div className="container font-qs mx-auto space-y-5">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className="flex items-center gap-4">
                <label className="font-semibold">Select Event:</label>
                <select
                    value={selectedEvent ?? ''}
                    onChange={(e) => { setSelectedEvent(Number(e.target.value)); setPage(0); }}
                    className="border rounded p-2"
                >
                    <option value="">-- Select --</option>
                    {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title || ev.eventTitle || `Event ${ev.id}`}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <LoadingGif />
            ) : registrations && registrations.length > 0 ? (
                <div>
                    <h2 className="text-3xl my-4">Total Requests: {registrations.length}</h2>
                    <div className="overflow-x-auto">
                        <table className="table border-collapse border border-gray-400">
                            <thead>
                                <tr className="text-white raleway text-base bg-[#2986cc]">
                                    <th></th>
                                    <th>Volunteer</th>
                                    <th>Email</th>
                                    <th>Start Time</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((r, idx) => (
                                    <tr className="border border-gray-300" key={r.registrationId ?? r.id ?? idx}>
                                        <th className="font-semibold">{idx + 1}</th>
                                        <td className="font-semibold">{r.userName || r.userFullName || r.userName}</td>
                                        <td className="font-semibold">{r.userEmail}</td>
                                        <td className="font-semibold">{r.eventStartTime}</td>
                                        <td className="font-semibold">{r.eventLocation}</td>
                                        <td className="font-semibold">{r.status}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {r.status === 'PENDING' && (
                                                    <button className="btn btn-sm bg-green-500" onClick={() => handleStatusChange(r.registrationId ?? r.id, 'APPROVED')}>Approve</button>
                                                )}
                                                {r.status === 'PENDING' && (
                                                    <button className="btn btn-sm bg-red-500" onClick={() => handleStatusChange(r.registrationId ?? r.id, 'REJECTED')}>Reject</button>
                                                )}
                                                {r.status === 'APPROVED' && (
                                                    <button className="btn btn-sm bg-indigo-600" onClick={() => handleStatusChange(r.registrationId ?? r.id, 'COMPLETE')}>Mark Complete</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-2 justify-center mt-4">
                        <button className="btn" disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</button>
                        <span>Page {page + 1} / {totalPages || 1}</span>
                        <button className="btn" disabled={page + 1 >= (totalPages || 1)} onClick={() => setPage(p => p + 1)}>Next</button>
                    </div>
                </div>
            ) : (
                <PageError />
            )}
        </div>
    );
};

ManageVolunteerRequest.propTypes = {
    title: PropTypes.object.isRequired,
};

export default ManageVolunteerRequest;
