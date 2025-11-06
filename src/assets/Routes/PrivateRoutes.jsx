import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import UseAuth from "../Hook/UseAuth";
import Loader from "../Components/Loader/Loader";
const PrivateRoutes = ( {children}) => {
    const { user, loading } = UseAuth();
    const location = useLocation();
    if (loading) {
      return (
        <div className=" h-[70vh] flex items-center justify-center">
          <div><Loader></Loader>
            {/* <img src={loader} /> */}
            {/* <h2><img src={loader} alt="" /></h2> */}
          </div>
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" state={location?.pathname || "/"} replace={true}></Navigate>;
    }
    return <div>{children}</div>;
};
PrivateRoutes.propTypes = {
    children: PropTypes.object.isRequired,
  };
export default PrivateRoutes;