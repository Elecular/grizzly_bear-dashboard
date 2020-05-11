import React from "react";
import { Switch, Route } from "react-router-dom";
import Experiments from "./components/Experiments";
import Experiment from "./components/experiment/Experiment";

const Index = (props) => {
    return (
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
};

export default Index;
