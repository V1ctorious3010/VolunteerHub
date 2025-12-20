import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getRegistrations, deleteRegistration } from '../../../utils/postApi';
import { GiCancel } from "react-icons/gi";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PageError from "../ErrorPage/PageError";
import { Spinner } from "@material-tailwind/react";
import { Helmet } from "react-helmet";
import { truncateChars } from '../../../utils/textUtils';

const MyVolunteerRequest = ({ title }) => {
    const [showLoader, setShowLoader] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const user = useSelector(s => s.auth.user);
    const navigate = useNavigate();
    const [myVolunteerRequest, setMyVolunteerRequest] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const volunteers = async () => {
            setLoading(true);
            try {
                const params = { page, size };
                if (statusFilter) params.status = statusFilter;
                const resp = await getRegistrations(params);
                const content = resp?.data?.content || [];
                const tp = resp?.data?.totalPages ?? 0;
                setMyVolunteerRequest(content);
                setTotalPages(tp);
            } catch (err) {
                setMyVolunteerRequest([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };
        volunteers();
    }, [user?.email, user?.id, page, size, statusFilter]);

    const handleCancel = (id) => {
        Swal.fire({
            title: "Bạn chắc chưa?",
            text: "Bạn sẽ không thể thay đổi lựa chọn này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Hãy xóa đi!",
            cancelButtonText: "Không",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const resp = await deleteRegistration(id);
                    const msg = resp?.data?.message;
                    const remaining = myVolunteerRequest.filter((post) => post.registrationId !== id && post.id !== id);
                    setMyVolunteerRequest(remaining);
                    if (msg) Swal.fire('Thông báo', msg, 'success');
                    navigate(`/my-volunteer-requests`);
                } catch (err) {
                    const emsg = err?.response?.data?.message || 'Unable to cancel registration';
                    Swal.fire('Error', emsg, 'error');
                }
            }
        });
    };

    const getStatusFromPost = (post) => {
        return post?.status ?? post?.registrationStatus ?? post?.statusName ?? '';
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

    const renderStatus = (post) => {
        const s = getStatusFromPost(post);
        const map = {
            PENDING: 'Chờ duyệt',
            APPROVED: 'Chấp nhận',
            REJECTED: 'Từ chối',
            COMPLETED: 'Hoàn thành',
        };
        return map[s] || (s ? s : 'Chưa xác định');
    };

    const navigation = useNavigate();
    if (navigation.state === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="container font-qs mx-auto space-y-5 mt-16">
            <Helmet>
                <title>
                    {title}
                </title>
            </Helmet>
            <div className="flex items-center gap-4">
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="border p-3 input input-bordered rounded-md">
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Chấp nhận</option>
                    <option value="REJECTED">Từ chối</option>
                    <option value="COMPLETED">Hoàn thành</option>
                </select>
                <div className="ml-auto">
                    <span className="text-sm">Trang {page + 1} / {totalPages || 1}</span>
                    <button className="btn btn-sm ml-2" disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Trước </button>
                    <button className="btn btn-sm ml-2" disabled={page + 1 >= (totalPages || 1)} onClick={() => setPage(p => p + 1)}>Sau</button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : myVolunteerRequest.length > 0 ? (
                <div>
                    <h2 className="text-5xl my-6 font-bold text-center mt-6">
                        Lịch sử tham gia
                    </h2>
                    <div className="hidden md:block">
                        <div className="overflow-x-auto ">
                            <table className="table border-collapse border border-gray-400 text-center">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#2986cc]">
                                        <th></th>
                                        <th>Sự kiện</th>
                                        <th>Trạng thái</th>
                                        <th>Email tổ chức </th>
                                        <th>Thời gian bắt đầu </th>
                                        <th>Địa điểm</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myVolunteerRequest.map((post, idx) => (
                                        <tr className="border border-gray-300" key={post.registrationId}>
                                            <th className="font-semibold">{idx + 1}</th>
                                            <td className="font-semibold">{truncateChars(post.eventTitle, 15)}</td>
                                            <td className="font-semibold">{renderStatus(post)}</td>
                                            <td className="font-semibold">{post.organizerEmail}</td>
                                            <td className="font-semibold">{formatDateOnly(post.eventStartTime)}</td>
                                            <td className="font-semibold">{post.eventLocation}</td>

                                            <td>
                                                <div className="flex items-center gap-6 justify-center">
                                                    <GiCancel
                                                        title="Cancel Request"
                                                        onClick={() => handleCancel(post.registrationId)}
                                                        className="size-6 cursor-pointer"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className=" md:hidden">
                        <div className="overflow-x-auto ">
                            <table className="table border-collapse border border-gray-400 text-center">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#2986cc]">
                                        <th>Sự kiện </th>
                                        <th>Trạng thái</th>
                                        <th>Thời gian bắt đầu</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myVolunteerRequest.map((post) => (
                                        <tr className="border border-gray-300" key={post.registrationId}>
                                            <td>{truncateChars(post.eventTitle, 15)}</td>
                                            <td>{renderStatus(post)}</td>
                                            <td>{formatDateOnly(post.eventStartTime)}</td>
                                            <td>
                                                <div className="flex items-center gap-6 justify-center">
                                                    <GiCancel
                                                        title="Cancel Request"
                                                        onClick={() => handleCancel(post.registrationId)}
                                                        className="size-6 cursor-pointer"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : showLoader ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <PageError />
            )}
        </div>
    );
};
MyVolunteerRequest.propTypes = {
    title: PropTypes.object.isRequired,
};
export default MyVolunteerRequest;
