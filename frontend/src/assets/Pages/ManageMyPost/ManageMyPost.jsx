import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MyVolunteerPost from "./MyVolunteerPost/MyVolunteerPost";
import MyVolunteerRequest from "./MyVolunteerRequest/MyVolunteerRequest";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader/Loader";


const ManageMyPost = ({title}) => {
  const navigation=useNavigate()
  if (navigation.state === "loading") return <Loader />;
  return (
    <div className="mt-16">
      <div>
        <Helmet>
          <title>
            {title}
          </title>
        </Helmet>
        <Tabs>
          <div className="mx-8 md:mx-0 flex items-center justify-center">
            <TabList>
              <Tab>My Need Volunteer Post</Tab>
              <Tab>My Volunteer Request Post</Tab>
            </TabList>
          </div>
          <TabPanel>
            <h2>
              <MyVolunteerPost title="My Volunteer Post"></MyVolunteerPost>
            </h2>
          </TabPanel>
          <TabPanel>
            <h2>
              <MyVolunteerRequest title="My Volunteer Request"></MyVolunteerRequest>
            </h2>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
ManageMyPost.propTypes = {
  title: PropTypes.object.isRequired,
}
export default ManageMyPost;
