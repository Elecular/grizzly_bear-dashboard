import "./Experiment.scss";
import React, { useContext, useState } from "react";
import getExperimentStats from "api/experimentStats";
import AuthorizationContext from "auth/authorizationContext";
import { Card, CardHeader, CardBody, Collapse } from "reactstrap";
import { Redirect } from "react-router-dom";
import AdAnalytics from "./adAnalytics/Ads";

const Experiment = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const experiment = props.location.state
        ? props.location.state.selectedExperiment
        : undefined;

    const [experimentStats, setExperimentStats] = useState(undefined);
    const [error, SetError] = useState(false);

    React.useEffect(() => {
        if (!experiment) return;
        getExperimentStats(project._id, experiment, authToken)
            .then(setExperimentStats)
            .catch((_) => {
                SetError(true);
            });
    }, [project._id, experiment, authToken]);

    if (!experiment) {
        return <Redirect to="dashboard/experiments" />;
    }
    if (!experimentStats) {
        return (
            <Message
                title={"Loading"}
                message={"The experiment is loading. Please wait..."}
            />
        );
    }
    if (error) {
        return (
            <Message
                title={"Error"}
                message={
                    "There was an error while loading experiment stats. Please refresh the page and try again."
                }
            />
        );
    }
    return (
        <div className="content">
            <CollapseCard header="Summary" open={true}></CollapseCard>
            <CollapseCard header="Ad Analytics" open={true}>
                <AdAnalytics experimentStats={experimentStats} />
            </CollapseCard>
            <CollapseCard header="Transaction Analytics"></CollapseCard>
            <CollapseCard header="Custom Event Analytics"></CollapseCard>
        </div>
    );
};

const Message = (props) => (
    <div className="content">
        <Card
            className="text-center"
            style={{
                width: "40em",
                padding: "2rem",
            }}
        >
            <h4>{props.title}</h4>
            <p>{props.message}</p>
        </Card>
    </div>
);

const CollapseCard = (props) => {
    const [open, setOpen] = React.useState(props.open);
    const [hover, setHover] = React.useState(false);
    return (
        <div>
            <Card>
                <CardHeader
                    role="tab"
                    className="clickable"
                    onClick={() => setOpen(!open)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <h5
                            className={`${
                                hover ? "" : "text-muted"
                            } white-on-hover`}
                            style={{
                                flexGrow: 1,
                            }}
                        >
                            {props.header}
                        </h5>
                        <i
                            className={`${
                                hover ? "" : "text-muted"
                            } white-on-hover tim-icons icon-minimal-${
                                open ? "up" : "down"
                            }`}
                        />
                    </div>
                </CardHeader>
                <Collapse role="tabpanel" isOpen={open}>
                    <CardBody>{props.children}</CardBody>
                </Collapse>
            </Card>
        </div>
    );
};

export default Experiment;
