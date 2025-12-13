import api from './apiClient';

export const createEvent = (eventData) => {
    return api.post('/events', eventData);
};

export const getMyEvents = () => {
    return api.get('/events/my-events');
};

export default { createEvent };
