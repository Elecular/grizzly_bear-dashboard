import React from "react";
import strings from "../../../localizedStrings/strings";
import {
    Table,
    Button,
    FormGroup,
    Input,
    Alert,
    UncontrolledAlert,
} from "reactstrap";
import update from "immutability-helper";

const width = "35rem";

class VariationsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variations: [
                {
                    name: "Control Group",
                    traffic: 50,
                },
                {
                    name: "Variation 1",
                    traffic: 50,
                },
            ],
            errors: [],
        };
        this.updateVariationName.bind(this);
        this.updateVariationTraffic.bind(this);
        this.deleteVariation.bind(this);
        this.addErrorMessage.bind(this);
        this.removeErrorMessage.bind(this);
    }

    render() {
        const { variations } = this.state;
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
                        marginBottom: "3.5rem",
                    }}
                >
                    <h4>
                        {strings.addExperimentsTab.variationsComponent.subTitle}
                    </h4>
                </div>
                <Table
                    style={{
                        width,
                        margin: "auto",
                    }}
                >
                    <thead className="text-primary">
                        <tr>
                            <th>Variation Name</th>
                            <th className="text-right">Traffic %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variations.map((variation, index) => (
                            <tr key={variation.name}>
                                <td>
                                    <EditableCell
                                        value={variation.name}
                                        onValueChange={(value) =>
                                            this.updateVariationName(
                                                index,
                                                value.trim(),
                                            )
                                        }
                                    />
                                </td>
                                <td className="text-right">
                                    <EditableCell
                                        value={`${variation.traffic}%`}
                                        onValueChange={(value) =>
                                            this.updateVariationTraffic(
                                                index,
                                                value,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <Button
                                        className="btn-link btn-icon"
                                        color="danger"
                                        onClick={() =>
                                            this.deleteVariation(index)
                                        }
                                    >
                                        <i className="tim-icons icon-trash-simple" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <Button color="primary" size="sm">
                                    Add Variation
                                </Button>
                            </td>
                            <td />
                            <td />
                        </tr>
                    </tbody>
                </Table>
                {this.state.errors.map((error) => (
                    <UncontrolledAlert
                        key={error}
                        style={{ width, margin: "auto" }}
                        color="danger"
                        onClick={() => {
                            this.removeErrorMessage(error);
                        }}
                    >
                        {error}
                    </UncontrolledAlert>
                ))}
            </div>
        );
    }

    updateVariationName(index, updatedName) {
        const newState = update(this.state, {
            variations: {
                [index]: {
                    name: {
                        $set: updatedName,
                    },
                },
            },
        });
        if (!this.areVariationNamesUnique(newState.variations)) {
            this.addErrorMessage("Variation names must be unique");
            return false;
        } else {
            this.setState(newState);
            this.removeErrorMessage("Variation names must be unique");
            return true;
        }
    }

    updateVariationTraffic(index, updatedTraffic) {
        const traffic = updatedTraffic.replace("%", "");
        if (isNaN(traffic)) {
            this.addErrorMessage("Traffic % must be a valid number");
            return false;
        } else {
            this.removeErrorMessage("Traffic % must be a valid number");
        }
        this.setState(
            update(this.state, {
                variations: {
                    [index]: {
                        traffic: {
                            $set: Math.round(parseFloat(traffic)),
                        },
                    },
                },
            }),
        );
        return true;
    }

    deleteVariation(index) {
        this.setState({
            variations: this.state.variations.filter((_, i) => i !== index),
        });
    }

    addErrorMessage(errorMessage) {
        if (this.state.errors.includes(errorMessage)) return;
        this.setState(
            update(this.state, {
                errors: {
                    $push: [errorMessage],
                },
            }),
        );
    }

    removeErrorMessage(errorMessage) {
        this.setState({
            errors: this.state.errors.filter((error) => error !== errorMessage),
        });
    }

    areVariationNamesUnique(variations) {
        let names = {};
        for (let variation of variations) {
            if (names[variation.name]) return false;
            names[variation.name] = true;
        }
        return true;
    }

    isTotalTrafficValid = (variations) =>
        variations.reduce((x, y) => x.traffic + y.traffic) === 100;

    isValidated() {
        if (!this.isTotalTrafficValid(this.state.variations)) {
            this.addErrorMessage("Total traffic must add up to 100%");
            return false;
        } else {
            this.removeErrorMessage("Total traffic must add up to 100%");
        }
        return this.areVariationNamesUnique(this.state.variations);
    }
}

const EditableCell = (props) => {
    const { value, onValueChange } = props;

    const [edit, setEdit] = React.useState(false);
    const [showEditIcon, setShowEditIcon] = React.useState(false);

    const handleValueChange = (val) => {
        if (!onValueChange(val)) return;
        setEdit(false);
    };

    return (
        <div
            onMouseEnter={() => setShowEditIcon(true)}
            onMouseLeave={() => setShowEditIcon(false)}
        >
            <div
                style={{
                    display: "inline-block",
                    width: "10rem",
                }}
            >
                {edit ? (
                    <FormGroup>
                        <Input
                            type="text"
                            autoFocus
                            defaultValue={value}
                            onKeyDown={(ev) => {
                                if (ev.key === "Enter") {
                                    handleValueChange(ev.target.value);
                                }
                            }}
                            onBlur={() => setEdit(false)}
                        />
                    </FormGroup>
                ) : (
                    <h5>{value}</h5>
                )}
            </div>
            <Button
                className="btn-link btn-icon"
                color="primary"
                onClick={() => setEdit(true)}
                style={{
                    visibility: showEditIcon ? "inherit" : "hidden",
                }}
            >
                <i className="tim-icons icon-pencil" />
            </Button>
        </div>
    );
};

export default VariationsInfo;
