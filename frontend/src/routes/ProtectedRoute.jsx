import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const { user,initialized } = useSelector((state) => state.auth)

    if(!initialized) {
        return <div>Loading...</div>
    }

    if(!user) {
        return < Navigate to='/login' replace />
    }

    return children;
}

export default ProtectedRoute