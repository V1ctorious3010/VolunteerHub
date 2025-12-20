import { useEffect, useState } from "react";
import { Link, useNavigate, useNavigation, useLocation } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import PageError from "../ErrorPage/PageError";
import PropTypes from "prop-types";
import { Spinner } from "@material-tailwind/react";
import { Helmet } from "react-helmet";
import { getMyEvents, deleteEvent } from "../../../utils/postApi";
import { truncateChars } from '../../../utils/textUtils';
import postIcon from '../../images/post.svg';

const EvOrgPost = ({ title }) => {
    const user = useSelector(s => s.auth.user);
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialPage = Math.max(0, parseInt(searchParams.get('page') || '0', 10) || 0);
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    const [myVolunteerPost, setMyVolunteerPost] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        const volunteers = async () => {
            try {
                const resp = await getMyEvents({ page });
                let data = resp?.data;
                let items = [];
                if (data && Array.isArray(data.content)) {
                    items = data.content;
                    setTotalCount(data.totalElements || items.length);
                    setTotalPages(data.totalPages || 1);
                } else if (data && Array.isArray(data.data)) {
                    items = data.data;
                    setTotalCount(items.length);
                    setTotalPages(1);
                } else if (Array.isArray(data)) {
                    items = data;
                    setTotalCount(items.length);
                    setTotalPages(1);
                } else if (data && typeof data === 'object') {
                    items = [data];
                    setTotalCount(1);
                    setTotalPages(1);
                } else {
                    items = [];
                    setTotalCount(0);
                    setTotalPages(1);
                }

                const normalized = items.map(e => {
                    const total = Number(e.noOfVolunteer ?? e.no_of_volunteer ?? 0) || 0;
                    const remaining = Number(e.remaining ?? e.remainingVol ?? 0) || 0;
                    const neededCount = Math.max(0, total - remaining);
                    return ({
                        id: e.id,
                        title: e.title,
                        category: e.category || 'General',
                        startTime: e.startTime,
                        endTime: e.endTime,
                        location: e.location,
                        status: e.status,
                        noOfVolunteer: total,
                        remaining: remaining,
                        neededCount: neededCount,
                        orgEmail: e.orgEmail || e.organizerEmail || (e.org && e.org.email) || e.org?.email,
                        orgName: e.orgName || e.organizerName || (e.org && e.org.name) || e.org?.name,
                    });
                });
                setMyVolunteerPost(normalized);
            } catch (err) {
                console.error('Failed to load my events', err);
                setMyVolunteerPost([]);
            }
        };
        volunteers();
    }, [user?.id, user?.name, page]);

    // keep URL in sync when page changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if ((params.get('page') || '0') !== String(page)) {
            params.set('page', String(page));
            navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        }
        // reload when page changes
    }, [page]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể thay đổi hành động này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Hãy xóa nó!",
            cancelButtonText: "Không",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEvent(id);
                    Swal.fire({ title: 'Deleted!', text: 'The event has been deleted.', icon: 'success' });
                    const remaining = myVolunteerPost.filter((post) => post.id !== id);
                    setMyVolunteerPost(remaining);
                    navigate(`/manage-event-list`);
                } catch (err) {
                    console.error('Delete failed', err);
                    Swal.fire({ title: 'Error', text: 'Failed to delete event', icon: 'error' });
                }
            }
        });
    };
    const STATUS_LABELS = {
        PENDING: 'Chờ duyệt',
        COMING: 'Chấp nhận',
        REJECTED: 'Từ chối',
        ONGOING: "Đang diễn ra",
        FINISHED: "Hoàn thành",
    };
    const navigation = useNavigation();
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
    if (navigation.state === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="container font-qs mx-auto space-y-5">
            <Helmet>
                <title>
                    {title}
                </title>
            </Helmet>
            {myVolunteerPost.length > 0 ? (
                <div>
                    <h2 className="text-5xl font-bold my-6 text-center mt-6">
                        Tổng số sự kiện: {totalCount || myVolunteerPost.length}
                    </h2>

                    <div className="hidden md:block">
                        <div className="overflow-x-auto ">
                            <table className="table border-collapse border border-gray-400 text-center">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#2986cc]">
                                        <th></th>
                                        <th>Tên sự kiện</th>
                                        <th>Phân loại </th>
                                        <th>Thời gian bắt đầu </th>
                                        <th>Thời gian kết thúc</th>
                                        <th>Địa điểm</th>
                                        <th>Số lượng</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myVolunteerPost.map((post, idx) => (
                                        <tr className="border border-gray-300" key={post.id}>
                                            <th className="font-semibold">{idx + 1}</th>
                                            <td className="font-semibold">{truncateChars(post.title, 15)}</td>
                                            <td className="font-semibold">{post.category}</td>
                                            <td className="font-semibold">{formatDateOnly(post.startTime)}</td>
                                            <td className="font-semibold">{formatDateOnly(post.endTime)}</td>
                                            <td className="font-semibold">{post.location}</td>
                                            <td className="font-semibold">{post.neededCount}/{post.noOfVolunteer || '-'}</td>
                                            <td className="font-semibold">{STATUS_LABELS[post.status] || post.status}</td>

                                            <td className="overflow-visible">
                                                <div className="flex items-center gap-3 justify-center flex-nowrap">
                                                    <Link to={`/update-my-post/${post.id}`}>
                                                        <MdEdit className="size-6" />
                                                    </Link>
                                                    <Link to={`/manage-event-list/tabs`} state={{ event: post }} className="flex-shrink-0">
                                                        <img src={postIcon} alt="Open tabs" className="w-6 h-6 object-contain flex-shrink-0" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(post.id)}>
                                                        <MdDelete className="size-6" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className=" md:hidden">
                            <div className="overflow-x-auto ">
                                <table className="table border-collapse border border-gray-400 text-center">
                                    <thead>
                                        <tr className="text-white raleway text-base bg-[#2986cc]">
                                            <th>Tên sự kiện </th>
                                            <th>Phân loại</th>
                                            <th>Hành dộng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myVolunteerPost.map((post) => (
                                            <tr className="border border-gray-300" key={post.id}>
                                                <td>{truncateChars(post.title, 15)}</td>
                                                <td>{post.category}</td>
                                                <td className="overflow-visible">

                                                    <div className="flex items-center gap-3 justify-center flex-nowrap">
                                                        <Link to={`/update-my-post/${post.id}`}>
                                                            <MdEdit className="size-6" />
                                                        </Link>
                                                        <Link to={`/manage-event-list/tabs`} state={{ event: post }} className="flex-shrink-0">
                                                            <img src={postIcon} alt="Open tabs" className="w-6 h-6 object-contain flex-shrink-0" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(post.id)}>
                                                            <MdDelete className="size-6" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-3 my-4">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} className="px-3 py-2 bg-gray-200 rounded" disabled={page <= 0}>Trước</button>
                        <div className="px-3 py-2">Trang {page + 1} / {totalPages}</div>
                        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} className="px-3 py-2 bg-gray-200 rounded" disabled={page + 1 >= totalPages}>Sau</button>
                    </div>
                </div>
            ) : showLoader ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <PageError></PageError>
            )}
        </div>
    );
};
EvOrgPost.propTypes = {
    title: PropTypes.object.isRequired,
};
export default EvOrgPost;
