import { getFromLocalStorage } from "../utils/Common";

// services/userService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class UserService {

    getAuthHeaders() {
        const token = getFromLocalStorage('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async fetchUsers(params = {}) {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });

        const response = await fetch(`${API_BASE_URL}/ukie/api/users?${queryParams}`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async fetchUserStats() {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/stats`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async getUserById(id) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async getUserByEmail(email) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/email/${encodeURIComponent(email)}`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async createUser(userData) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users`, {
            credentials: 'include',
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async updateUser(id, userData) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async updateProfile(id, profileData) {
        // Separate endpoint for profile updates that might include password changes
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}/profile`, {
            credentials: 'include',
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async changePassword(id, passwordData) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}/change-password`, {
            credentials: 'include',
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(passwordData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async deleteUser(id) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.ok;
    }

    async verifyEmail(id) {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/${id}/verify-email`, {
            credentials: 'include',
            method: 'PATCH',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async bulkDelete(userIds) {
        const promises = userIds.map(id => this.deleteUser(id));
        return Promise.all(promises);
    }

    async exportUsers(format = 'csv') {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/export?format=${format}`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
    }

    // New method to get current user profile
    async getCurrentUserProfile() {
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/me`, {
            credentials: 'include',
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Method to upload avatar file
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const token = getFromLocalStorage('token');
        const response = await fetch(`${API_BASE_URL}/ukie/api/users/avatar`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
}

export default new UserService();