import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import ExperimentTable from "./components/ExperimentsTable";
import ExperimentResults from "./components/ExperimentResults";

const Experiments = (props) => {
    return (
        <Switch>
            <Route
                path="/dashboard/experiments/results"
                render={(props) => <ExperimentResults {...props} />}
            />
            <Route path="/dashboard/experiments">
                <ExperimentTable />
            </Route>
        </Switch>
    );
};

export default Experiments;
