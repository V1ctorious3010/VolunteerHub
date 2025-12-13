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

export default { createEvent, getMyEvents, updateEvent, deleteEvent };
