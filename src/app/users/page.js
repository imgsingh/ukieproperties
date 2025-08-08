// pages/users.js
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, Plus, Edit, Trash2, Eye, Users, UserCheck, Mail, Calendar, Settings, LogOut, Download, Filter } from 'lucide-react';
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

    // Mock current user - replace with actual auth
    const currentUser = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    };

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [currentPage, searchTerm, sortBy, sortDir, pageSize]);

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
            setError('Failed to fetch users. Please try again.');
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

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue500 sm:text-sm"
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
                                        disabled={true}
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm rounded-md shadow-sm bg-red-100 text-red-700 hover:bg-red-200"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
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
                                                checked={selectedUsers.size === users.length}
                                                onChange={handleSelectAll}
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
                                                Loading users...
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
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.has(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                                                    <img
                                                        src={user.avatar || '/avatar-placeholder.png'}
                                                        alt={user.firstName}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <span>{user.firstName} {user.lastName}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getProviderIcon(user.provider)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                    {!user.verified && (
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
                                                    <button
                                                        title="Delete"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-5 h-5 inline" />
                                                    </button>
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
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage + 1} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                    disabled={currentPage + 1 >= totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
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