import apiClient from './apiClient';

/**
 * Delete event by admin (any status allowed)
 * DELETE /admin/events/{eventId}
 * @param {number} eventId - The event ID to delete
 * @returns {Promise} - Response with success message
 */
export const deleteEventByAdmin = async (eventId) => {
    try {
        const response = await apiClient.delete(`/admin/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};

/**
 * Ban a user account
 * POST /user/ban
 * @param {string} email - The user email to ban
 * @returns {Promise} - Response with success message
 */
export const banUser = async (email) => {
    try {
        const response = await apiClient.post('/user/ban', { email });
        return response.data;
    } catch (error) {
        console.error("Error banning user:", error);
        throw error;
    }
};

/**
 * Unban a user account
 * POST /user/unban
 * @param {string} email - The user email to unban
 * @returns {Promise} - Response with success message
 */
export const unbanUser = async (email) => {
    try {
        const response = await apiClient.post('/user/unban', { email });
        return response.data;
    } catch (error) {
        console.error("Error unbanning user:", error);
        throw error;
    }
};
