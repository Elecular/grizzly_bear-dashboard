import React, { useContext, useState } from "react";
import { Table } from "reactstrap";
import { Card, CardBody } from "reactstrap";
import { getExperimentStats } from "../../../api/userActivity";
import AuthorizationContext from "../../../auth/authorizationContext";
import { Link, Redirect } from "react-router-dom";
import strings from "localizedStrings/strings";
import { BreadcrumbItem } from "reactstrap";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

const environments = ["prod", "stage", "dev"];

const ExperimentResults = (props) => {
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
                    <BreadcrumbItem active>{experiment}</BreadcrumbItem>
                </ol>
            </nav>
            <Card
                style={{
                    width: `60rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    <ExperimentStats experimentName={experiment} />
                </CardBody>
            </Card>
        </div>
    );
};

const ExperimentStats = React.memo((props) => {
    const { experimentName } = props;
    const { authToken, project } = useContext(AuthorizationContext);
    const [environment, setEnvironment] = useState(environments[0]);
    const [variations, setVariations] = useState(undefined);
    const getStats = async (environment) => {
        const res = await getExperimentStats(
            project._id,
            experimentName,
            environment,
            authToken,
        );
        setVariations(res.variations);
        setEnvironment(res.environment);
        console.log(res);
    };

    if (variations === undefined) {
        getStats(environment);
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    marginBottom: "2rem",
                }}
            >
                <h4
                    style={{
                        flexGrow: 1,
                    }}
                >
                    Results
                </h4>
                <UncontrolledDropdown>
                    <DropdownToggle
                        caret
                        data-toggle="dropdown"
                        color="primary"
                        size="sm"
                    >
                        {environment}
                    </DropdownToggle>
                    <DropdownMenu>
                        {environments.map((environment) => (
                            <DropdownItem
                                onClick={() => {
                                    getStats(environment);
                                }}
                            >
                                {environment}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
            {variations && (
                <Table>
                    <thead className="text-primary">
                        <tr>
                            <th className="text-left">Metrics</th>
                            {Object.keys(variations).map((key) => (
                                <th className="text-right">{key}</th>
                            ))}
                        </tr>
                    </thead>
                </Table>
            )}
        </>
    );
});

const ExperimentStatsTable = (props) => (
    <Table>
        <thead className="text-primary">
            <tr>
                <th className="text-left">Metrics</th>
                {Object.keys(props.variations).map((key) => (
                    <th className="text-right">{key}</th>
                ))}
            </tr>
        </thead>
    </Table>
);

export default ExperimentResults;
