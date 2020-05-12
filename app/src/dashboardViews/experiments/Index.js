import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Experiments from "./components/Experiments";
import Experiment from "./components/experiment/Experiment";
import ErrorBoundary from "dashboardViews/ErrorBoundary";

const ExperimentsView = (props) => (
    <Switch>
        <Route
            path="/dashboard/experiments/results"
            render={(props) => <Experiment {...props} />}
        />
        <Route path="/dashboard/experiments">
            <Experiments />
        </Route>
    </Switch>
);

const ExperimentsViewWrapper = (props) => (
    <ErrorBoundary>
        <ExperimentsView {...props} />
    </ErrorBoundary>
);

export default ExperimentsViewWrapper;
