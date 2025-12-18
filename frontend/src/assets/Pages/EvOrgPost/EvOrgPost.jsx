import { useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import PageError from "../ErrorPage/PageError";
import PropTypes from "prop-types";
import { Spinner } from "@material-tailwind/react";
import { Helmet } from "react-helmet";
import { getMyEvents, deleteEvent } from "../../../utils/postApi";
import postIcon from '../../images/post.svg';

const EvOrgPost = ({ title }) => {
    const user = useSelector(s => s.auth.user);
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    const [myVolunteerPost, setMyVolunteerPost] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        const volunteers = async () => {
            try {
                const resp = await getMyEvents();
                let data = resp?.data;
                let items = [];
                if (data && Array.isArray(data.content)) {
                    items = data.content;
                    setTotalCount(data.totalElements || items.length);
                } else if (data && Array.isArray(data.data)) {
                    items = data.data;
                    setTotalCount(items.length);
                } else if (Array.isArray(data)) {
                    items = data;
                    setTotalCount(items.length);
                } else if (data && typeof data === 'object') {
                    items = [data];
                    setTotalCount(1);
                } else {
                    items = [];
                    setTotalCount(0);
                }

                const normalized = items.map(e => ({
                    id: e.id,
                    title: e.title,
                    category: e.category || 'General',
                    startTime: e.startTime,
                    endTime: e.endTime,
                    location: e.location,
                    status: e.status,
                }));
                setMyVolunteerPost(normalized);
            } catch (err) {
                console.error('Failed to load my events', err);
                setMyVolunteerPost([]);
            }
        };
        volunteers();
    }, [user?.id, user?.name]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEvent(id);
                    Swal.fire({ title: 'Deleted!', text: 'The event has been deleted.', icon: 'success' });
                    const remaining = myVolunteerPost.filter((post) => post.id !== id);
                    setMyVolunteerPost(remaining);
                    navigate(`/manage-my-post`);
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
    };
    const navigation = useNavigation();
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
                            <table className="table border-collapse border border-gray-400">
                                <thead>
                                    <tr className="text-white raleway text-base bg-[#2986cc]">
                                        <th></th>
                                        <th>Tên sự kiện</th>
                                        <th>Phân loại </th>
                                        <th>Thời gian bắt đầu </th>
                                        <th>Thời gian kết thúc</th>
                                        <th>Địa điểm</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myVolunteerPost.map((post, idx) => (
                                        <tr className="border border-gray-300" key={post.id}>
                                            <th className="font-semibold">{idx + 1}</th>
                                            <td className="font-semibold">{post.title}</td>
                                            <td className="font-semibold">{post.category}</td>
                                            <td className="font-semibold">{post.startTime}</td>
                                            <td className="font-semibold">{post.endTime}</td>
                                            <td className="font-semibold">{post.location}</td>
                                            <td className="font-semibold">{STATUS_LABELS[post.status] || post.status}</td>

                                            <td>
                                                <div className="flex items-center gap-6">
                                                    <Link to={`/update-my-post/${post.id}`}>
                                                        <MdEdit className="size-6" />
                                                    </Link>
                                                    <Link to={`/manage-event-list/tabs`} state={{ event: post }} className="">
                                                        <img src={postIcon} alt="Open tabs" className="w-6 h-6" />
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
                                <table className="table border-collapse border border-gray-400">
                                    <thead>
                                        <tr className="text-white raleway text-base bg-[#DE00DF]">
                                            <th>Tên sự kiện </th>
                                            <th>Phân loại</th>
                                            <th>Hành dộng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myVolunteerPost.map((post) => (
                                            <tr className="border border-gray-300" key={post.id}>
                                                <td>{post.title}</td>
                                                <td>{post.category}</td>
                                                <td>
                                                    {((post.orgEmail && post.orgEmail === user?.email) || (post.orgName && post.orgName === user?.name)) ? (
                                                        <div className="flex items-center gap-6">
                                                            <Link to={`/update-my-post/${post.id}`}>
                                                                <MdEdit className="size-6" />
                                                            </Link>
                                                            <Link to={`/manage-event-list/tabs`} state={{ event: post }}>
                                                                <img src={postIcon} alt="Open tabs" className="w-6 h-6" />
                                                            </Link>
                                                            <button onClick={() => handleDelete(post.id)}>
                                                                <MdDelete className="size-6" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
