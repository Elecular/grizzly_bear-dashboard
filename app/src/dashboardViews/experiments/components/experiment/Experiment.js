import "./Experiment.scss";
import React, { useContext, useState } from "react";
import getExperimentStats from "api/experimentStats";
import AuthorizationContext from "auth/authorizationContext";
import { Card, CardHeader, CardBody, Collapse } from "reactstrap";
import { Redirect } from "react-router-dom";
import About from "./about/About";
import AdAnalytics from "./adAnalytics/Ads";
import TransactionAnalytics from "./transactionAnalytics/Transaction";
import CustomEventAnalytics from "./customEventAnalytics/CustomEvents";
import strings from "localizedStrings/strings";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Row, Col, Label, BreadcrumbItem } from "reactstrap";
import Select from "react-select";
import PerfectScrollbar from "perfect-scrollbar";

const translations = strings.experimentsTab;
const defaultEnvironment = "prod";
const defaultSegment = "all";

const tabs = [
    {
        value: "About",
        label: "About",
        displayHeaderInput: false,
        minWidth: "40rem",
    },
    { value: "Ads", label: "Ads", displayHeaderInput: true, minWidth: "40rem" },
    {
        value: "Transactions",
        label: "Transactions",
        displayHeaderInput: true,
        minWidth: "40rem",
    },
    {
        value: "Custom Events",
        label: "Custom Events",
        displayHeaderInput: true,
        minWidth: "40rem",
    },
];

const Experiment = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const experiment = props.location.state
        ? props.location.state.selectedExperiment
        : undefined;

    const [experimentStats, setExperimentStats] = useState(undefined);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [selectedSegment, setSegment] = React.useState(undefined);
    const [selectedEnvironment, setEnvironment] = React.useState(undefined);
    const [error, SetError] = useState(false);
    const [scrollBar, setScrollBar] = useState(undefined);

    React.useEffect(() => {
        if (!experiment) return;
        getExperimentStats(project._id, experiment, authToken)
            .then(setExperimentStats)
            .catch((_) => SetError(true));
    }, [project._id, experiment, authToken]);

    React.useEffect(() => {
        if (!scrollBar && experimentStats) {
            const ps = new PerfectScrollbar("#experiment-cardbody");
            setScrollBar(ps);
            window.addEventListener("resize", () => ps.update());
        }
        if (scrollBar) {
            scrollBar.update();
        }
    }, [experimentStats, scrollBar, activeTab]);

    if (!experiment) {
        return <Redirect to="dashboard/experiments" />;
    }
    if (error) {
        return (
            <Message
                title={translations.error}
                message={translations.errorMessage}
            />
        );
    }
    if (!experimentStats) {
        return (
            <Message
                title={translations.loading}
                message={translations.loadingMessage}
            />
        );
    }
    return (
        <div className="content">
            <ol className="breadcrumb bg-transparent">
                <BreadcrumbItem>
                    <a className="link" href="dashboard/experiments">
                        Experiments
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    {experimentStats.info._id.experimentName}
                </BreadcrumbItem>
            </ol>
            <Card>
                <CardHeader>
                    <Header
                        activeTab={activeTab}
                        environment={selectedEnvironment}
                        segment={selectedSegment}
                        onActiveTabChange={setActiveTab}
                        onEnvironmentChange={setEnvironment}
                        onSegmentChange={setSegment}
                        experimentStats={experimentStats}
                    />
                </CardHeader>
                <CardBody
                    id="experiment-cardbody"
                    style={{
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            minWidth: activeTab.minWidth,
                        }}
                    >
                        {activeTab.value == "About" && (
                            <About stats={experimentStats} />
                        )}
                        {activeTab.value == "Ads" && (
                            <AdAnalytics
                                experimentStats={experimentStats}
                                environment={selectedEnvironment}
                                segment={selectedSegment}
                            />
                        )}
                        {activeTab.value == "Transactions" && (
                            <TransactionAnalytics
                                experimentStats={experimentStats}
                                environment={selectedEnvironment}
                                segment={selectedSegment}
                            />
                        )}
                        {activeTab.value == "Custom Events" && (
                            <CustomEventAnalytics
                                experimentStats={experimentStats}
                                environment={selectedEnvironment}
                                segment={selectedSegment}
                            />
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

const Header = (props) => {
    const {
        activeTab,
        environment,
        segment,
        onActiveTabChange,
        onEnvironmentChange,
        onSegmentChange,
        experimentStats,
    } = props;

    const environments = experimentStats
        ? experimentStats.getEnvironments()
        : [];
    const segments = experimentStats ? experimentStats.getSegments() : [];

    React.useEffect(() => {
        if (!environment) {
            //Setting the default environment
            onEnvironmentChange(
                environments.length === 0 ||
                    environments.includes(defaultEnvironment)
                    ? defaultEnvironment
                    : environments[0],
            );
        }

        if (!segment) {
            //Setting the default segment
            onSegmentChange(defaultSegment);
        }

        if (!activeTab) {
            onActiveTabChange(tabs[0].label);
        }
    }, [
        activeTab,
        environment,
        environments,
        onActiveTabChange,
        onEnvironmentChange,
        onSegmentChange,
        segment,
        segments,
    ]);

    return (
        <Row>
            <Col xs={"8"}>
                <div className="nav-tabs-navigation">
                    <div className="nav-tabs-wrapper">
                        <Nav
                            tabs
                            style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                            }}
                        >
                            {tabs.map((tab) => (
                                <NavItem key={tab.value}>
                                    <NavLink
                                        className={`${
                                            activeTab.value === tab.value
                                                ? "active"
                                                : ""
                                        } clickable`}
                                        onClick={() => onActiveTabChange(tab)}
                                    >
                                        {tab.label}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </div>
                </div>
            </Col>
            {(!activeTab ||
                tabs.find((tab) => tab.value === activeTab.value)
                    .displayHeaderInput) && (
                <Col xs={"4"}>
                    <HeaderInput
                        selectedEnvironment={environment}
                        environments={environments}
                        selectedSegment={segment}
                        segments={segments}
                        onEnvironmentChange={onEnvironmentChange}
                        onSegmentChange={onSegmentChange}
                    />
                </Col>
            )}
        </Row>
    );
};

const HeaderInput = (props) => {
    return (
        <Row style={{ alignItems: "flex-end" }}>
            <Col xs="6">
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
            <Col xs="6">
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

export default Experiment;
