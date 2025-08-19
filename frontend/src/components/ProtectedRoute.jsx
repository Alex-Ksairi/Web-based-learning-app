import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * 
 * @param {object} children
 */
function ProtectedRoute({ children }) {
    const userId = localStorage.getItem('user_id');
    const sessionToken = localStorage.getItem('session_token');

    const isAuthenticated = userId && sessionToken;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;