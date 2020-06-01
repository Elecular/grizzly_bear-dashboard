import "./Experiment.scss";
import React, { useContext, useState } from "react";
import getExperimentStats from "api/experimentStats";
import AuthorizationContext from "auth/authorizationContext";
import { Card, CardHeader, CardBody, Collapse } from "reactstrap";
import { Redirect } from "react-router-dom";
import About from "./about/About";
import AdAnalytics from "./adAnalytics/Ads";
import TransactionAnalytics from "./transactionAnalytics/Transaction";
import RetentionStatsAnalytics from "./retentionStatAnalytics/RetentionStats";
import CustomEventAnalytics from "./customEventAnalytics/CustomEvents";
import strings from "localizedStrings/strings";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Row, Col, Label, BreadcrumbItem } from "reactstrap";
import Select from "react-select";
import InfoIcon from "./InfoIcon";
import { negativeColor } from "utils/constants";
import Message from "dashboardViews/Message";
import { forceLogin } from "auth/login";
import swal from "sweetalert";

const translations = strings.experimentsTab;
const defaultEnvironment = "prod";
const defaultSegment = "all";

const tabs = [
    {
        value: "About",
        label: "About",
        displayHeaderInput: false,
    },
    { value: "Ads", label: "Ads", displayHeaderInput: true },
    {
        value: "Transactions",
        label: "Transactions",
        displayHeaderInput: true,
    },
    {
        value: "Retention",
        label: "Retention",
        displayHeaderInput: true,
    },
    {
        value: "Custom Events",
        label: "Custom Events",
        displayHeaderInput: true,
    },
];

const Experiment = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const [experiment, setExperiment] = React.useState(
        props.location.state
            ? props.location.state.selectedExperiment
            : undefined,
    );

    const [experimentStats, setExperimentStats] = useState(undefined);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [selectedSegment, setSegment] = React.useState(undefined);
    const [selectedEnvironment, setEnvironment] = React.useState(undefined);

    React.useEffect(() => {
        if (!experiment) return;
        getExperimentStats(project._id, experiment, authToken)
            .then(setExperimentStats)
            .catch((err) => {
                if (err.status === 401 || err.stats === 403) {
                    swal("It seems like you are logged out. Please login", {
                        icon: "info",
                    }).then((_) => {
                        forceLogin();
                    });
                    return;
                }
                setExperimentStats(() => {
                    throw new Error("Error while loading experiment stats");
                });
            });
    }, [project._id, experiment, authToken]);

    if (!experiment) {
        return <Redirect to="dashboard/experiments" />;
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
                    <a
                        className="link"
                        onClick={() => setExperiment(undefined)}
                    >
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
                    }}
                >
                    <div>
                        {!experimentStats.hasData(selectedEnvironment) &&
                            activeTab.displayHeaderInput && (
                                <div style={{ width: "35rem" }}>
                                    <p style={{ color: negativeColor }}>
                                        {translations.noDataAlert}
                                    </p>
                                </div>
                            )}
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
                        {activeTab.value == "Retention" && (
                            <RetentionStatsAnalytics
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
                <Label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                marginRight: "0.5rem",
                            }}
                        >
                            Environment
                        </div>
                        <InfoIcon
                            id={"environment-dropdown-info"}
                            tooltip={translations.environmentToolTip}
                        />
                    </div>
                </Label>
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
                <Label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                marginRight: "0.5rem",
                            }}
                        >
                            Segment
                        </div>
                        <InfoIcon
                            id={"segment-dropdown-info"}
                            tooltip={translations.segmentToolTip}
                        />
                    </div>
                </Label>
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

export default Experiment;
