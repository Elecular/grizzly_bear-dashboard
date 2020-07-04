import React from "react";
import ProjectsOverview from "dashboardViews/admin/overview/ProjectsOverview";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProjectView from "dashboardViews/admin/overview/ProjectView";

function Index() {
    return (
        <div className="content">
            <Switch>
                <Route path="/admin/overview/project/:projectId">
                    <ProjectView />
                </Route>
                <Route path="/admin/overview">
                    <ProjectsOverview />
                </Route>
            </Switch>
        </div>
    );
}

export default Index;
