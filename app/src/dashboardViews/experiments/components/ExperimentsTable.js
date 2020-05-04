import React, { useContext, useState } from "react";
import { Table } from "reactstrap";
import moment from "moment";
import { Badge } from "reactstrap";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import AuthorizationContext from "../../../auth/authorizationContext";
import { getExperiments } from "../../../api/experiments";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import strings from "localizedStrings/strings";
import { BreadcrumbItem } from "reactstrap";
import { Redirect } from "react-router-dom";

/**
 * Renders an experiment table
 */
const ExperimentTable = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const [experiments, setExperiments] = useState([]);

    React.useEffect(() => {
        getExperiments(project._id, authToken).then(setExperiments);
    }, [authToken, project._id]);

    return (
        <div className="content">
            <ol className="breadcrumb bg-transparent">
                <BreadcrumbItem>{strings.tabs.experiments}</BreadcrumbItem>
            </ol>
            <Card
                style={{
                    width: `${experiments.length === 0 ? 40 : 60}rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    {experiments.length !== 0 ? (
                        <ExperimentDataTable experiments={experiments} />
                    ) : (
                        <AddExperiment />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

const ExperimentDataTable = (props) => {
    const { experiments } = props;

    const [selectedExperiment, setSelectedExperiment] = React.useState(
        undefined,
    );

    if (selectedExperiment !== undefined) {
        return (
            <Redirect
                to={{
                    pathname: `/dashboard/experiments/results`,
                    state: {
                        selectedExperiment,
                    },
                }}
            />
        );
    }

    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {experiments
                    .sort((a, b) => a.startTime - b.startTime)
                    .map((experiment) => (
                        <tr
                            key={experiment._id.experimentName}
                            className="clickable"
                            onClick={() =>
                                setSelectedExperiment(
                                    experiment._id.experimentName,
                                )
                            }
                        >
                            <td>{experiment._id.experimentName}</td>
                            <td>{`${dateString(experiment.startTime)}`}</td>
                            <td>{`${dateString(experiment.endTime)}`}</td>
                            <td>
                                <StatusBadge
                                    startTime={experiment.startTime}
                                    endTime={experiment.endTime}
                                />
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
};

const AddExperiment = (props) => (
    <div className="text-center">
        <Link to="/dashboard/add-experiment">
            <Button
                style={{
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                }}
                color="primary"
            >
                {strings.experimentsTab.addExperiment}
            </Button>
        </Link>
        <CardText
            style={{
                marginBottom: "1rem",
            }}
        >
            {strings.experimentsTab.noExperimentsFound}
        </CardText>
    </div>
);

const StatusBadge = (props) => {
    let { startTime, endTime } = props;
    let status = "Running";
    let color = "success";

    let time = Date.now();

    if (time < startTime) {
        status = "Not Sarted";
        color = "warning";
    } else if (endTime && time > endTime) {
        status = "Finished";
        color = "default";
    }

    return <Badge color={color}>{status}</Badge>;
};

const dateString = (date) => (date ? moment(date).format("MMM Do YYYY") : "-");

export default ExperimentTable;
