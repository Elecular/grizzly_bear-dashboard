import React from "react";

const AuthorizationContext = React.createContext({
    authToken: null,
    project: null,
});

export default AuthorizationContext;
