import React from "react";
import { Row, Col, FormGroup, Label, Input, FormText } from "reactstrap";
import Datetime from "react-datetime";
import { isMoment } from "moment";
import strings from "../../../localizedStrings/strings";

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleExperiments: false,
            experimentName: "",
            //By default, we set the start date to be tomorrow
            startTime: new Date().valueOf() + 1 * 24 * 3600 * 1000,
            endTime: undefined,
            errors: {},
        };
    }

    render() {
        const {
            startTime,
            endTime,
            experimentName,
            scheduleExperiments,
        } = this.state;

        const {
            invalidExperimentName,
            invalidStartTime,
            invalidEndTime,
        } = this.state.errors;

        return (
            <div
                style={{
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                }}
            >
                {/*Header*/}
                <div
                    className="text-center"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "2.5rem",
                    }}
                >
                    <h4>
                        {strings.addExperimentsTab.basicInfoComponent.subTitle}
                    </h4>
                </div>

                <form>
                    {/*Experiment Name*/}
                    <Label for="experimentName">
                        {
                            strings.addExperimentsTab.basicInfoComponent
                                .experimentName
                        }
                    </Label>
                    <FormGroup
                        style={{
                            marginBottom: "2rem",
                        }}
                    >
                        <Input
                            type="text"
                            id="experimentName"
                            value={experimentName}
                            onChange={(ev) =>
                                this.setState({
                                    experimentName: ev.target.value,
                                })
                            }
                        />
                        {invalidExperimentName && (
                            <FormText color="danger">
                                {invalidExperimentName}
                            </FormText>
                        )}
                    </FormGroup>

                    {/*Scheduling Experiment Radio Buttons*/}
                    <FormGroup
                        check
                        className="form-check-radio form-check-inline"
                    >
                        <Label className="form-check-label">
                            <Input
                                type="radio"
                                name="scheduleExperiment"
                                id="scheduleExperiment-false"
                                value="false"
                                defaultChecked
                                onClick={() =>
                                    this.setState({
                                        scheduleExperiments: false,
                                    })
                                }
                            />
                            {
                                strings.addExperimentsTab.basicInfoComponent
                                    .startExperimentNow
                            }
                            <span className="form-check-sign"></span>
                        </Label>
                    </FormGroup>
                    <FormGroup
                        check
                        className="form-check-radio form-check-inline"
                    >
                        <Label className="form-check-label">
                            <Input
                                type="radio"
                                name="scheduleExperiment"
                                id="scheduleExperiment-true"
                                value="true"
                                onClick={() =>
                                    this.setState({ scheduleExperiments: true })
                                }
                            />
                            {
                                strings.addExperimentsTab.basicInfoComponent
                                    .scheduleExperiment
                            }
                            <span className="form-check-sign"></span>
                        </Label>
                    </FormGroup>

                    {/*Scheduling Experiments Input Field*/}
                    {scheduleExperiments && (
                        <Row
                            style={{
                                marginTop: "1rem",
                            }}
                        >
                            <Col>
                                <FormGroup>
                                    <Label for="startDate">
                                        {
                                            strings.addExperimentsTab
                                                .basicInfoComponent.startDate
                                        }
                                    </Label>
                                    <Datetime
                                        id="startDate"
                                        value={new Date(startTime)}
                                        onChange={(date) => {
                                            const time =
                                                this.processDate(date) ||
                                                startTime;
                                            this.setState({ startTime: time });
                                        }}
                                    />
                                    {invalidStartTime && (
                                        <FormText color="danger">
                                            {invalidStartTime}
                                        </FormText>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="endDate">
                                        {
                                            strings.addExperimentsTab
                                                .basicInfoComponent.endDate
                                        }
                                    </Label>
                                    <Datetime
                                        id="endDate"
                                        value={
                                            endTime ? new Date(endTime) : null
                                        }
                                        onChange={(date) => {
                                            const time = this.processDate(date);
                                            this.setState({ endTime: time });
                                        }}
                                    />
                                    {invalidEndTime && (
                                        <FormText color="danger">
                                            {invalidEndTime}
                                        </FormText>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                    )}
                </form>
            </div>
        );
    }

    isValidated() {
        const {
            startTime,
            endTime,
            experimentName,
            scheduleExperiments,
        } = this.state;

        const isStartTimeValid =
            typeof startTime === "number" && startTime > Date.now();
        const isEndTimeValid =
            endTime === undefined ||
            (typeof endTime === "number" && endTime > startTime);
        const isValidTimeRange =
            !scheduleExperiments || (isStartTimeValid && isEndTimeValid);

        const isExperimentNameValid = experimentName.length > 0;

        this.setState({
            errors: {
                invalidExperimentName: !isExperimentNameValid
                    ? strings.addExperimentsTab.basicInfoComponent
                          .invalidExperimentName
                    : undefined,
                invalidStartTime:
                    scheduleExperiments && !isStartTimeValid
                        ? strings.addExperimentsTab.basicInfoComponent
                              .invalidStartDate
                        : undefined,
                invalidEndTime:
                    scheduleExperiments && !isEndTimeValid
                        ? strings.addExperimentsTab.basicInfoComponent
                              .invalidEndDate
                        : undefined,
            },
        });

        return isExperimentNameValid && isValidTimeRange;
    }

    processDate(date) {
        return isMoment(date) ? date.valueOf() : undefined;
    }
}

export default BasicInfo;
