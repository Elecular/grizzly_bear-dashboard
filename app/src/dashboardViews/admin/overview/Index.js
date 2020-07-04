import React from "react";
import AllProjectsView from "dashboardViews/admin/overview/AllProjectsView";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProjectView from "dashboardViews/admin/overview/ProjectView";

function Index() {
    console.log("Render Index");
    return (
        <div className="content">
            <Switch>
                <Route path="/admin/overview/project/:projectId">
                    <ProjectView />
                </Route>
                <Route path="/admin/overview">
                    <AllProjectsView />
                </Route>
            </Switch>
        </div>
    );
}

export default Index;
