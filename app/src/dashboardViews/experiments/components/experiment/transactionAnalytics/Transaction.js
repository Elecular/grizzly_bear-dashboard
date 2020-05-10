import React from "react";
import { Row, Col, Label } from "reactstrap";
import Select from "react-select";
import TransactionStats from "models/TransactionStats";
import strings from "localizedStrings/strings";
import TransactionResults from "./Results";
import ProductBreakDown from "./ProductBreakdown";

const translations = strings.experimentsTab.adAnalytics;
const defaultEnvironment = "prod";
const defaultSegment = "all";

const TransactionAnalytics = React.memo((props) => {
    const { experimentStats } = props;
    const transactionStats = TransactionStats.Instantiate(experimentStats);
    const environments = experimentStats
        ? experimentStats.getEnvironments()
        : [];
    const segments = experimentStats ? experimentStats.getSegments() : [];

    const [selectedSegment, setSegment] = React.useState(defaultSegment);
    const [selectedEnvironment, setEnvironment] = React.useState(
        environments.length === 0 || environments.includes(defaultEnvironment)
            ? defaultEnvironment
            : environments[0],
    );

    return (
        <div>
            <Header
                selectedEnvironment={selectedEnvironment}
                environments={environments}
                selectedSegment={selectedSegment}
                segments={segments}
                onEnvironmentChange={setEnvironment}
                onSegmentChange={setSegment}
            />
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "4rem", marginBottom: "1rem" }}
                >
                    {translations.summary}
                </h4>
                <TransactionResults
                    stats={transactionStats}
                    environment={selectedEnvironment}
                    segment={selectedSegment}
                />
            </div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "4rem", marginBottom: "1rem" }}
                >
                    {translations.placementBreakDown}
                </h4>
                <ProductBreakDown
                    stats={transactionStats}
                    environment={selectedEnvironment}
                    segment={selectedSegment}
                />
            </div>
        </div>
    );
});

const Header = (props) => {
    return (
        <Row style={{ alignItems: "flex-end" }}>
            <Col xs="3">
                <Label>Environment</Label>
                <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    value={{
                        value: props.selectedEnvironment,
                        label: props.selectedEnvironment,
                    }}
                    options={props.environments.map((environment) => ({
                        value: environment,
                        label: environment,
                    }))}
                    onChange={(environment) =>
                        props.onEnvironmentChange(environment.value)
                    }
                />
            </Col>
            <Col xs="3">
                <Label>Segment</Label>
                <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    value={{
                        value: props.selectedSegment,
                        label: props.selectedSegment,
                    }}
                    options={props.segments.map((segment) => ({
                        value: segment,
                        label: segment,
                    }))}
                    onChange={(segment) => props.onSegmentChange(segment.value)}
                />
            </Col>
        </Row>
    );
};

export default TransactionAnalytics;
