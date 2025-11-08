// Legacy AuthProviders removed. This file remains as a no-op to avoid import errors if referenced accidentally.
// Prefer using Redux Provider in src/main.jsx
import PropTypes from 'prop-types';
const AuthProvider = ({ children }) => children;
AuthProvider.propTypes = { children: PropTypes.any };
export default AuthProvider;
