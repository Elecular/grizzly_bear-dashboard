//If we are in http and it is not localhost, we must redirect to https 
if(window.location.href.substr(0, 5) !== 'https' && window.location.href.indexOf("localhost") < 0) {
    window.location.href = window.location.href.replace('http', 'https');
}

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import DashboardLayout from "dashboardLayouts/DashboardLayout";
import login from "auth/login";
import initializeProject from "utils/initializeProject";
import AuthorizationContext from "auth/authorizationContext";

import "assets/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";
import "assets/scss/black-dashboard-pro-react.scss?v=1.1.0";
import "assets/demo/demo.css";

const hist = createBrowserHistory();

login().then((authToken) => {
    initializeProject(authToken).then((project) => {
        ReactDOM.render(
            <AuthorizationContext.Provider
                value={{
                    authToken,
                    project,
                }}
            >
                <Router history={hist}>
                    <Switch>
                        <Route
                            path="/dashboard"
                            render={(props) => <DashboardLayout {...props} />}
                        />
                        {<Redirect from="/" to="/dashboard/experiments" />}
                    </Switch>
                </Router>
            </AuthorizationContext.Provider>,
            document.getElementById("root"),
        );
    });
});
