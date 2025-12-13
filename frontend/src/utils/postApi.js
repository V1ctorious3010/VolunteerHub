import api from './apiClient';

export const createEvent = (eventData) => {
    return api.post('/events', eventData);
};

export const getMyEvents = () => {
    return api.get('/events/my-events');
};

export const updateEvent = (eventId, eventData) => {
    return api.put(`/events/${eventId}`, eventData);
};

export const deleteEvent = (eventId) => {
    return api.delete(`/events/${eventId}`);
};

export const getAdminEvents = (params) => {
    // params can include pagination or filters
    return api.get('/admin/events', { params });
};

export const patchAdminEventStatus = (eventId, statusBody) => {
    return api.patch(`/admin/events/${eventId}/status`, statusBody);
};

export const registerEvent = (eventId, registrationBody) => {
    return api.post(`/events/${eventId}/registration`, registrationBody);
};

export const getRegistrations = (params) => {
    // params optional for pagination
    return api.get('/registrations', { params });
};

export const getEventRegistrations = (eventId, params) => {
    return api.get(`/events/${eventId}/registrations`, { params });
};

export const patchRegistrationStatus = (registrationId, statusBody) => {
    return api.patch(`/registrations/${registrationId}/status`, statusBody);
};

export const deleteRegistration = (registrationId) => {
    return api.delete(`/registrations/${registrationId}`);
};

export default { createEvent, getMyEvents, updateEvent, deleteEvent, getAdminEvents, patchAdminEventStatus, registerEvent, getRegistrations, deleteRegistration, getEventRegistrations, patchRegistrationStatus };