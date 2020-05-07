import React from "react";
import { Row, Col, Label } from "reactstrap";
import Select from "react-select";
import AdResults from "./Results";
import PlacementBreakDown from "./PlacementBreakdown";

const defaultEnvironment = "prod";
const defaultSegment = "all";

const AdAnalytics = React.memo((props) => {
    const { experimentStats } = props;

    const environments = experimentStats
        ? experimentStats.getEnvironments()
        : [];
    const segments = experimentStats ? experimentStats.getSegments() : [];
    const [segment, setSegment] = React.useState(defaultSegment);
    const [environment, setEnvironment] = React.useState(
        environments.length === 0 || environments.includes(defaultEnvironment)
            ? defaultEnvironment
            : environments[0],
    );

    return (
        <div>
            <Header
                selectedEnvironment={environment}
                environments={environments}
                selectedSegment={segment}
                segments={segments}
                onEnvironmentChange={setEnvironment}
                onSegmentChange={setSegment}
            />
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "4rem", marginBottom: "1rem" }}
                >
                    Summary
                </h4>
                {
                    <AdResults
                        stats={experimentStats}
                        environment={environment}
                        segment={segment}
                    />
                }
            </div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "4rem", marginBottom: "1rem" }}
                >
                    Placement Break Down
                </h4>
                {
                    <PlacementBreakDown
                        stats={experimentStats}
                        environment={environment}
                        segment={segment}
                    />
                }
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

export default AdAnalytics;
