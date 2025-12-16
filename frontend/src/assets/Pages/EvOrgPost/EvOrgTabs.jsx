import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RegistrationsPanel from './RegistrationsPanel';
import ParticipantsPanel from './ParticipantsPanel';
import backIcon from '../../images/back.svg';

const EvOrgTabs = ({ title }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('registrations');

    const navigate = useNavigate();

    const location = useLocation();
    const [currentEventObj, setCurrentEventObj] = useState(null);
    useEffect(() => {
        console.log('EvOrgTabs - location received', { pathname: location.pathname, search: location.search, state: location.state });
        const passed = location?.state?.event;
        if (passed && passed.id) {
            console.log('EvOrgTabs - event passed via location.state', passed);
            setSelectedEvent(passed.id);
            setCurrentEventObj(passed);
        } else {
            // fallback: try query param if present
            const params = new URLSearchParams(location.search);
            const eid = params.get('eventId');
            console.log('EvOrgTabs - fallback eventId query param', eid);
            if (eid) setSelectedEvent(Number(eid));
        }
    }, [location]);

    useEffect(() => {
        console.log('EvOrgTabs - state snapshot', { selectedEvent, activeTab });
    }, [selectedEvent, activeTab]);

    return (
        <div className="container font-qs mx-auto space-y-5 p-6">
            <Helmet><title>{title}</title></Helmet>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src={backIcon} alt="Back" className="w-6 h-6 cursor-pointer" onClick={() => navigate('/manage-event-list')} />
                    <h2 className="text-2xl font-semibold">{title}</h2>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Sự kiện: <strong>{currentEventObj?.title || selectedEvent || '—'}</strong></div>
                </div>
            </div>

            <Tabs selectedIndex={activeTab === 'participants' ? 1 : 0} onSelect={(index) => { setActiveTab(index === 1 ? 'participants' : 'registrations'); }}>
                <TabList className="mx-0 md:mx-0 flex items-center justify-start mb-4">
                    <Tab className={`tab tab-lifted ${activeTab === 'registrations' ? 'bg-gray-200 text-gray-800' : ''}`}>Danh sách đăng ký</Tab>
                    <Tab className={`tab tab-lifted ${activeTab === 'participants' ? 'bg-gray-200 text-gray-800' : ''}`}>Danh sách tham gia</Tab>
                </TabList>

                <TabPanel>
                    <RegistrationsPanel selectedEvent={selectedEvent} currentEventObj={currentEventObj} />
                </TabPanel>

                <TabPanel>
                    <ParticipantsPanel selectedEvent={selectedEvent} currentEventObj={currentEventObj} />
                </TabPanel>
            </Tabs>
        </div>
    );
};

EvOrgTabs.propTypes = {
    title: PropTypes.object.isRequired,
};

export default EvOrgTabs;
