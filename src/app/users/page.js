// pages/users.js
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2, Eye, Users, UserCheck, Mail, Calendar, Settings, LogOut, Download, Filter, Shield, Lock } from 'lucide-react';
import userService from '../component/userService';
import Navbar from '../component/Navbar';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [pageSize, setPageSize] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [stats, setStats] = useState({});
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const router = useRouter();

    // Admin email - you can also move this to environment variables
    const ADMIN_EMAIL = 'gursimranbasra7.gs@gmail.com';

    useEffect(() => {
        checkAdminAccess();
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchStats();
        }
    }, [currentPage, searchTerm, sortBy, sortDir, pageSize, isAdmin]);

    const checkAdminAccess = async () => {
        try {
            setAuthLoading(true);

            // Get current user from localStorage, sessionStorage, or API call
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (!token) {
                redirectToLogin();
                return;
            }

            // Fetch current user details - replace with your actual auth service
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get user info');
            }

            const userData = await response.json();
            setCurrentUser(userData);

            // Check if user is admin
            if (userData.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            } else {
                setError('Access denied. Admin privileges required.');
                setTimeout(() => {
                    router.push('/dashboard'); // Redirect to dashboard or home page
                }, 3000);
            }

        } catch (error) {
            console.error('Error checking admin access:', error);
            setError('Authentication failed. Please login again.');
            setTimeout(() => {
                redirectToLogin();
            }, 2000);
        } finally {
            setAuthLoading(false);
        }
    };

    const redirectToLogin = () => {
        // Clear any stored tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        router.push('/login');
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                size: pageSize,
                sortBy,
                sortDir,
                ...(searchTerm && { search: searchTerm })
            };

            const data = await userService.fetchUsers(params);

            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 403) {
                setError('Access denied. Admin privileges required.');
            } else {
                setError('Failed to fetch users. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await userService.fetchUserStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
        setCurrentPage(0);
    };

    const handleSelectUser = (userId) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(u => u.id)));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.deleteUser(userId);
                await fetchUsers();
                await fetchStats();
                setSelectedUsers(new Set([...selectedUsers].filter(id => id !== userId)));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user. Please try again.');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedUsers.size === 0) return;

        if (window.confirm(`Are you sure you want to delete ${selectedUsers.size} user(s)?`)) {
            try {
                await userService.bulkDelete([...selectedUsers]);
                await fetchUsers();
                await fetchStats();
                setSelectedUsers(new Set());
            } catch (error) {
                console.error('Error deleting users:', error);
                alert('Failed to delete users. Please try again.');
            }
        }
    };

    const handleVerifyEmail = async (userId) => {
        try {
            await userService.verifyEmail(userId);
            await fetchUsers();
            await fetchStats();
        } catch (error) {
            console.error('Error verifying email:', error);
            alert('Failed to verify email. Please try again.');
        }
    };

    const handleExportUsers = async () => {
        try {
            const blob = await userService.exportUsers('csv');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting users:', error);
            alert('Failed to export users. Please try again.');
        }
    };

    const formatDate = (dateInput) => {
        let date;

        if (Array.isArray(dateInput)) {
            // MongoDB LocalDateTime is returned as array: [year, month, day, hour, minute, second, nanosecond]
            const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
            date = new Date(year, month - 1, day, hour, minute, second); // month is 0-indexed in JS
        } else if (typeof dateInput === 'string') {
            date = new Date(dateInput);
        } else if (dateInput instanceof Date) {
            date = dateInput;
        } else {
            return 'Invalid Date';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProviderIcon = (provider) => {
        switch (provider) {
            case 'google':
                return '🔍';
            case 'email':
                return '📧';
            default:
                return '👤';
        }
    };

    const UserModal = ({ user, onClose, onSave }) => {
        const [formData, setFormData] = useState({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            avatar: user?.avatar || ''
        });
        const [saving, setSaving] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);

            try {
                if (user) {
                    await userService.updateUser(user.id, formData);
                } else {
                    await userService.createUser(formData);
                }
                onSave();
                onClose();
            } catch (error) {
                console.error('Error saving user:', error);
                alert('Failed to save user. Please try again.');
            } finally {
                setSaving(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add User'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                required
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                required
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                required
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                type="url"
                                value={formData.avatar}
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                disabled={saving}
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : (user ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Loading screen while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Access denied screen
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <Shield className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">
                            You don't have permission to access this page. Admin privileges are required.
                        </p>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={redirectToLogin}
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Sign Out & Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Admin Badge */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Shield className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-blue-800 font-medium">Admin Panel</span>
                            <span className="ml-2 text-blue-600">- User Management</span>
                            <span className="ml-auto text-sm text-blue-600">
                                Logged in as: {currentUser?.email}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Users className="w-8 h-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <UserCheck className="w-8 h-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Verified</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Mail className="w-8 h-8 text-yellow-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Google Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.googleUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Calendar className="w-8 h-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Recent (30d)</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.recentUsers || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* <button
                                        onClick={handleExportUsers}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </button> */}
                                    <button
                                        disabled={selectedUsers.size === 0}
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm rounded-md shadow-sm bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Selected ({selectedUsers.size})
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(null);
                                            setShowUserModal(true);
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm rounded-md shadow-sm bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add User
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={users.length > 0 && selectedUsers.size === users.length}
                                                onChange={handleSelectAll}
                                                disabled={users.length === 0}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('firstName')}>
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Provider
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('createdAt')}>
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                                    Loading users...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center px-6 py-4 text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className={user.email === ADMIN_EMAIL ? 'bg-blue-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.has(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        disabled={user.email === ADMIN_EMAIL} // Prevent admin from being selected for deletion
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                                                    <img
                                                        src={user.avatar || '/avatar-placeholder.png'}
                                                        alt={user.firstName}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <span className="flex items-center">
                                                        {user.firstName} {user.lastName}
                                                        {user.email === ADMIN_EMAIL && (
                                                            <Shield className="w-4 h-4 text-blue-600 ml-2" title="Admin" />
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getProviderIcon(user.provider)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                    {!user.emailVerified && (
                                                        <button
                                                            title="Verify Email"
                                                            onClick={() => handleVerifyEmail(user.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            <Mail className="w-5 h-5 inline" />
                                                        </button>
                                                    )}
                                                    <button
                                                        title="View"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="w-5 h-5 inline" />
                                                    </button>
                                                    <button
                                                        title="Edit"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowUserModal(true);
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-800"
                                                    >
                                                        <Edit className="w-5 h-5 inline" />
                                                    </button>
                                                    {user.email !== ADMIN_EMAIL && (
                                                        <button
                                                            title="Delete"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-5 h-5 inline" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
                            <div>
                                Showing {(currentPage * pageSize) + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                    disabled={currentPage === 0}
                                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage + 1} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                    disabled={currentPage + 1 >= totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Modal */}
                    {showUserModal && (
                        <UserModal
                            user={selectedUser}
                            onClose={() => {
                                setShowUserModal(false);
                                setSelectedUser(null);
                            }}
                            onSave={fetchUsers}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default UserManagementPage;