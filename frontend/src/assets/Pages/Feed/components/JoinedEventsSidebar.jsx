import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Button } from "@material-tailwind/react";
import { getRegistrations } from "../../../../utils/postApi";

const JoinedEventsSidebar = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchEvents = async (pageNum) => {
        if (loading) return;
        
        try {
            setLoading(true);
            const response = await getRegistrations({
                status: 'APPROVED,COMPLETED',
                page: pageNum,
                size: 9
            });
            
            const newEvents = response?.data?.content || [];
            const isLastPage = response?.data?.last || false;
            
            if (pageNum === 0) {
                setEvents(newEvents);
            } else {
                setEvents(prev => [...prev, ...newEvents]);
            }
            
            setHasMore(!isLastPage);
            setPage(pageNum);
        } catch (error) {
            console.error("Error fetching joined events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(0);
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchEvents(page + 1);
        }
    };

    const handleEventClick = (eventId) => {
        navigate(`/event-feed/${eventId}`);
    };

    if (events.length === 0 && !loading) {
        return (
            <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">Diễn đàn đã tham gia</h2>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-gray-500 text-sm text-center">
                        Bạn chưa tham gia sự kiện nào
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Diễn đàn đã tham gia</h2>
            </div>
            
            <div 
                className="flex-1 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
                <div className="py-2">
                    {events.map((registration) => (
                        <button
                            key={registration.registrationId}
                            onClick={() => handleEventClick(registration.eventId)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 border-l-4 border-transparent hover:border-blue-500"
                        >
                            <div className="flex items-center gap-3">
                                {registration.eventThumbnail ? (
                                    <img
                                        src={registration.eventThumbnail}
                                        alt={registration.eventTitle}
                                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">
                                            {registration.eventTitle?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {registration.eventTitle}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {registration.eventCategory || 'Sự kiện'}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                    
                    {hasMore && (
                        <div className="px-4 py-3">
                            <Button
                                size="sm"
                                variant="outlined"
                                color="blue"
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? <Spinner className="h-4 w-4" /> : "Xem thêm"}
                            </Button>
                        </div>
                    )}
                    
                    {!hasMore && events.length > 0 && (
                        <div className="text-center py-4 text-xs text-gray-400">
                            Đã hiển thị tất cả
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinedEventsSidebar;
