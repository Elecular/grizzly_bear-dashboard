import React from "react";
import { Row, Col, Label } from "reactstrap";
import Select from "react-select";
import AdResults from "./Results";
import PlacementBreakDown from "./PlacementBreakdown";
import AdStats from "models/AdStats";
import strings from "localizedStrings/strings";

const translations = strings.experimentsTab.adAnalytics;
const defaultEnvironment = "prod";
const defaultSegment = "all";

const AdAnalytics = React.memo((props) => {
    const { experimentStats } = props;
    const adStats = AdStats.Instantiate(experimentStats);
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
                {
                    <AdResults
                        stats={adStats}
                        environment={selectedEnvironment}
                        segment={selectedSegment}
                    />
                }
            </div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "4rem", marginBottom: "1rem" }}
                >
                    {translations.placementBreakDown}
                </h4>
                {
                    <PlacementBreakDown
                        stats={adStats}
                        environment={selectedEnvironment}
                        segment={selectedSegment}
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
