import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyVolunteerPost from "./MyVolunteerPost/MyVolunteerPost";
import MyVolunteerRequest from "./MyVolunteerRequest/MyVolunteerRequest";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";
import ROLE from "../../../constants/roles";
import { useSelector } from 'react-redux';


const ManageMyPost = ({ title }) => {
  const navigation = useNavigate();
  if (navigation.state === "loading") return <Loader />;
  const user = useSelector(s => s.auth.user);
  const derivedRole = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : undefined);
  const isVolunteer = derivedRole === ROLE.VOLUNTEER;
  const isOrganizer = derivedRole === ROLE.EVENT_ORGANIZER;
  return (
    <div className="mt-16">
      <div>
        <Helmet>
          <title>
            {title}
          </title>
        </Helmet>
        {isOrganizer || isVolunteer ? (
          <Tabs>
            <div className="mx-8 md:mx-0 flex items-center justify-center">
              <TabList>
                {isOrganizer && <Tab>My Need Volunteer Post</Tab>}
                {isVolunteer && <Tab>My Volunteer Request Post</Tab>}
              </TabList>
            </div>

            {isOrganizer && (
              <TabPanel>
                <h2>
                  <MyVolunteerPost title="My Volunteer Post" />
                </h2>
              </TabPanel>
            )}

            {isVolunteer && (
              <TabPanel>
                <h2>
                  <MyVolunteerRequest title="My Volunteer Request" />
                </h2>
              </TabPanel>
            )}
          </Tabs>
        ) : (
          <div className="p-8 text-center text-gray-600">
            Chức năng chỉ dành cho Volunteer hoặc Event Organizer — xử lý sau.
          </div>
        )}
      </div>
    </div>
  );
};
ManageMyPost.propTypes = {
  title: PropTypes.object.isRequired,
}
export default ManageMyPost;
