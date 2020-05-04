import React, { useContext, useState } from "react";
import { Table } from "reactstrap";
import { Card, CardBody } from "reactstrap";
import AuthorizationContext from "../../../auth/authorizationContext";
import { Link, Redirect } from "react-router-dom";
import strings from "localizedStrings/strings";
import { BreadcrumbItem } from "reactstrap";

const ExperimentResults = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const [experiment, setExperiment] = useState(
        props.location.state.selectedExperiment,
    );
    if (experiment === undefined) {
        return <Redirect to="dashboard/experiments" />;
    }

    return (
        <div className="content">
            <nav aria-label="breadcrumb" role="navigation">
                <ol className="breadcrumb bg-transparent">
                    <BreadcrumbItem
                        className="bread-crumb-active-link"
                        onClick={() => setExperiment(undefined)}
                    >
                        {strings.tabs.experiments}
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Experiment 1</BreadcrumbItem>
                </ol>
            </nav>
            <Card
                style={{
                    width: `60rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    <h4>Hello world</h4>
                </CardBody>
            </Card>
        </div>
    );
};

export default ExperimentResults;
