import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Spinner } from "@material-tailwind/react";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useSelector(s => s.auth);
  const location = useLocation();
  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Spinner className="h-12 w-12" />
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