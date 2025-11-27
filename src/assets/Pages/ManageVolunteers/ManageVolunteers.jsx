import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { fetchAllUsers, banUser, unbanUser } from "../../../features/auth/authSlice";
import PropTypes from "prop-types";

const ManageVolunteers = ({ title }) => {
    const { user } = useSelector((s) => s.auth);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // email của user đang xử lý

    // State cho confirmation popup
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'ban' hoặc 'unban'
        email: null,
        name: null,
    });

    // Kiểm tra quyền ADMIN
    useEffect(() => {
        if (!user || user.role !== "ADMIN") {
            toast.error("You have no authority to access");
            navigate("/");
        }
    }, [user, navigate]);

    // Lấy danh sách users
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };
    console.log(users);
    useEffect(() => {
        if (user?.role === "ADMIN") {
            loadUsers();
        }
    }, [user]);

    // Xử lý ban user
    const handleBan = async (email) => {
        try {
            setActionLoading(email);
            await banUser(email);
            toast.success(`Ban succeed ${email}`);
            // Cập nhật state local
            setUsers((prev) =>
                prev.map((u) => (u.email === email ? { ...u, locked: true } : u))
            );
        } catch (error) {
            toast.error("Failed to ban user");
        } finally {
            setActionLoading(null);
        }
    };

    // Xử lý unban user
    const handleUnban = async (email) => {
        try {
            setActionLoading(email);
            await unbanUser(email);
            toast.success(`Đã gỡ cấm người dùng ${email}`);
            // Cập nhật state local
            setUsers((prev) =>
                prev.map((u) => (u.email === email ? { ...u, locked: false } : u))
            );
        } catch (error) {
            toast.error("Failed to unban user");
        } finally {
            setActionLoading(null);
        }
    };

    // Mở modal xác nhận
    const openConfirmModal = (type, email, name) => {
        setConfirmModal({ isOpen: true, type, email, name });
    };

    // Đóng modal
    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, type: null, email: null, name: null });
    };

    // Xác nhận hành động từ modal
    const handleConfirmAction = async () => {
        const { type, email } = confirmModal;
        closeConfirmModal();
        if (type === 'ban') {
            await handleBan(email);
        } else if (type === 'unban') {
            await handleUnban(email);
        }
    };

    // Xuất danh sách users ra file JSON
    const exportToJSON = () => {
        const dataStr = JSON.stringify(users, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `volunteers_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Exported file JSON');
    };

    // Xuất danh sách users ra file CSV
    const exportToCSV = () => {
        if (users.length === 0) {
            toast.error('No resources');
            return;
        }
        // Header
        const headers = ['Name', 'Email', 'Role', 'Status'];
        // Rows
        const rows = users.map(u => [
            u.name || '',
            u.email || '',
            u.role || '',
            u.locked ? 'Ban' : 'Active'
        ]);
        // Build CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        // Add BOM for Excel UTF-8 compatibility
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `volunteers_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Exported file CSV');
    };

    // Hiển thị role badge
    const getRoleBadge = (role) => {
        const colors = {
            ADMIN: "bg-red-500 text-white",
            MANAGER: "bg-blue-500 text-white",
            VOLUNTEER: "bg-green-500 text-white",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role] || "bg-gray-500 text-white"}`}>
                {role}
            </span>
        );
    };

    // Hiển thị status badge
    const getStatusBadge = (locked) => {
        return locked ? (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                Banned
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Active
            </span>
        );
    };

    // if (!user || user.role !== "ADMIN") {
    //     return null;
    // }

    return (
        <div
            data-aos="fade-up"
            data-aos-easing="linear"
            data-aos-duration="1500"
            className="font-qs md:p-12 mb-12"
        >
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <div className="md:w-4/5 mx-auto min-h-[calc(100vh-364px)] my-12">
                <section className="p-2 md:p-6 mx-auto bg-white rounded-md shadow-md">
                    <h2 className="text-2xl pt-6 text-center mb-8 font-body font-semibold text-gray-900 capitalize">
                        Manage Volunteers
                    </h2>

                    {/* Refresh button */}
                    <div className="flex justify-end mb-4 px-4 gap-2 flex-wrap">
                        <button
                            onClick={exportToJSON}
                            disabled={loading || users.length === 0}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                        >
                            Export JSON
                        </button>
                        <button
                            onClick={exportToCSV}
                            disabled={loading || users.length === 0}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={loadUsers}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    {/* Users table */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <div className="overflow-x-auto px-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((volunteer) => (
                                        <tr key={volunteer.email} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {volunteer.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {volunteer.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRoleBadge(volunteer.role)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(volunteer.locked)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {/* Không cho phép ban chính mình hoặc ADMIN khác */}
                                                {volunteer.email === user.email ? (
                                                    <span className="text-gray-400 italic">You</span>
                                                ) : volunteer.role === "ADMIN" ? (
                                                    <span className="text-gray-400 italic">Admin</span>
                                                ) : volunteer.locked ? (
                                                    <button
                                                        onClick={() => openConfirmModal('unban', volunteer.email, volunteer.name)}
                                                        disabled={actionLoading === volunteer.email}
                                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
                                                    >
                                                        {actionLoading === volunteer.email
                                                            ? "Processing..."
                                                            : "Unban"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openConfirmModal('ban', volunteer.email, volunteer.name)}
                                                        disabled={actionLoading === volunteer.email}
                                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition"
                                                    >
                                                        {actionLoading === volunteer.email
                                                            ? "Processing..."
                                                            : "Ban"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="mt-6 px-4 text-sm text-gray-500">
                        Total: {users.length} users |{" "}
                        Active: {users.filter((u) => !u.locked).length} |{" "}
                        Banned: {users.filter((u) => u.locked).length}
                    </div>
                </section>
            </div>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeConfirmModal}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
                        {/* Icon */}
                        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${confirmModal.type === 'ban' ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                            {confirmModal.type === 'ban' ? (
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 text-lg font-semibold text-center text-gray-900">
                            {confirmModal.type === 'ban' ? 'Confirm ban user' : 'Confirm unban user'}
                        </h3>

                        {/* Message */}
                        <p className="mt-2 text-center text-gray-600">
                            Are you sure you want to {confirmModal.type === 'ban' ? 'ban' : 'unban'} user{' '}
                            <span className="font-semibold">{confirmModal.name || confirmModal.email}</span>?
                        </p>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3 justify-center">
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 text-white rounded-lg transition font-medium ${confirmModal.type === 'ban'
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                {confirmModal.type === 'ban' ? 'Ban' : 'Unban'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ManageVolunteers.propTypes = {
    title: PropTypes.string,
};

export default ManageVolunteers;
