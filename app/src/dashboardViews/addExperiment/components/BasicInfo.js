import React from "react";
import {
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    FormText,
    Button,
} from "reactstrap";
import Datetime from "react-datetime";

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                }}
            >
                {/*Header*/}
                <div
                    class="text-center"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "2.5rem",
                    }}
                >
                    <h4>
                        Let's start with some basic information about your
                        experiment
                    </h4>
                </div>

                <form>
                    {/*Experiment Name*/}
                    <FormGroup>
                        <Input
                            type="text"
                            id="experimentName"
                            placeholder="Experiment Name"
                        />
                    </FormGroup>

                    {/*Scheduling Experiment Radio Buttons*/}
                    <FormGroup
                        check
                        className="form-check-radio form-check-inline"
                    >
                        <Label className="form-check-label">
                            <Input
                                type="radio"
                                name="exampleRadios"
                                id="exampleRadios1"
                                value="false"
                                defaultChecked
                            />
                            Start experiment now
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
                                name="exampleRadios"
                                id="exampleRadios2"
                                value="option2"
                            />
                            Schedule experiment
                            <span className="form-check-sign"></span>
                        </Label>
                    </FormGroup>

                    {/*Scheduling Experiments Input Field*/}
                    <Row
                        style={{
                            marginTop: "1rem",
                        }}
                    >
                        <Col>
                            <FormGroup>
                                <Datetime
                                    inputProps={{ placeholder: "Start Date" }}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Datetime
                                    inputProps={{ placeholder: "End Date" }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
            </div>
        );
    }

    isValidated() {
        return true;
    }
}

export default BasicInfo;
