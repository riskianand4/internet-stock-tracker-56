import { apiClient } from '@/services/apiClient';
import { User, UserActivity, Role } from '@/types/users';
import { handleApiResponse, safeApiCall } from '@/services/apiResponseHandler';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await safeApiCall<User[]>(
    () => apiClient.get('/api/users'),
    'Failed to fetch users'
  );
  return response.success ? (response.data || []) : [];
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const response = await safeApiCall<User>(
    () => apiClient.get(`/api/users/${id}`),
    'Failed to fetch user'
  );
  return response.success ? (response.data || null) : null;
};

// Create new user
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  const response = await safeApiCall<User>(
    () => apiClient.post('/api/users', userData),
    'Failed to create user'
  );
  return response.success ? (response.data || null) : null;
};

// Update user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  const response = await safeApiCall<User>(
    () => apiClient.put(`/api/users/${id}`, userData),
    'Failed to update user'
  );
  return response.success ? (response.data || null) : null;
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  const response = await safeApiCall<boolean>(
    () => apiClient.delete(`/api/users/${id}`),
    'Failed to delete user'
  );
  return response.success;
};

// Get users by role
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const response = await safeApiCall<User[]>(
    () => apiClient.get(`/api/users?role=${role}`),
    'Failed to fetch users by role'
  );
  return response.success ? (response.data || []) : [];
};

// Get users by department
export const getUsersByDepartment = async (department: string): Promise<User[]> => {
  const response = await safeApiCall<User[]>(
    () => apiClient.get(`/api/users?department=${department}`),
    'Failed to fetch users by department'
  );
  return response.success ? (response.data || []) : [];
};

// Search users
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await safeApiCall<User[]>(
    () => apiClient.get(`/api/users/search?q=${encodeURIComponent(query)}`),
    'Failed to search users'
  );
  return response.success ? (response.data || []) : [];
};

// Get current user profile
export const getCurrentUser = async (): Promise<User | null> => {
  const response = await safeApiCall<User>(
    () => apiClient.get('/api/users/profile'),
    'Failed to fetch current user'
  );
  return response.success ? (response.data || null) : null;
};

// Get user activity logs
export const getUserActivity = async (userId: string, filters?: any): Promise<UserActivity[]> => {
  const queryParams = filters ? new URLSearchParams(filters).toString() : '';
  const url = `/api/users/${userId}/activity${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await safeApiCall<UserActivity[]>(
    () => apiClient.get(url),
    'Failed to fetch user activity'
  );
  return response.success ? (response.data || []) : [];
};

// Get available roles
export const getRoles = async (): Promise<Role[]> => {
  const response = await safeApiCall<Role[]>(
    () => apiClient.get('/api/users/roles'),
    'Failed to fetch roles'
  );
  return response.success ? (response.data || []) : [];
};

// Update user permissions
export const updateUserPermissions = async (userId: string, permissions: string[]): Promise<User | null> => {
  const response = await safeApiCall<User>(
    () => apiClient.patch(`/api/users/${userId}/permissions`, { permissions }),
    'Failed to update user permissions'
  );
  return response.success ? (response.data || null) : null;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  getUsersByDepartment,
  searchUsers,
  getCurrentUser,
  getUserActivity,
  getRoles,
  updateUserPermissions,
};