import React from "react";
import strings from "../../../localizedStrings/strings";
import { Table, Button, FormGroup, Input, UncontrolledAlert } from "reactstrap";
import update from "immutability-helper";

const width = "35rem";
const translations = strings.addExperimentsTab.variationsComponent;

class VariationsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variations: [
                {
                    name: translations.controlGroup,
                    traffic: 50,
                },
                {
                    name: `${translations.variation} 1`,
                    traffic: 50,
                },
            ],
            errors: [],
        };
        this.updateVariationName.bind(this);
        this.updateVariationTraffic.bind(this);
        this.addVariation.bind(this);
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
                <div
                    className="text-center"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "3.5rem",
                    }}
                >
                    <h4>{translations.subTitle}</h4>
                </div>
                <Table
                    style={{
                        width,
                        margin: "auto",
                    }}
                >
                    <thead className="text-primary">
                        <tr>
                            <th>{translations.variationName}</th>
                            <th className="text-right">
                                {translations.trafficPercentage}
                            </th>
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
                                        editible={
                                            variation.name !==
                                            translations.controlGroup
                                        }
                                    />
                                </td>
                                <td className="text-right">
                                    <EditableCell
                                        inputFieldWidth="4.5rem"
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
                                    {variation.name !==
                                        translations.controlGroup && (
                                        <Button
                                            className="btn-link btn-icon"
                                            color="danger"
                                            onClick={() =>
                                                this.deleteVariation(index)
                                            }
                                        >
                                            <i className="tim-icons icon-trash-simple" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <Button
                                    color="primary"
                                    size="sm"
                                    style={{
                                        marginTop: "0.5rem",
                                        marginBottom: "0.5rem",
                                    }}
                                    onClick={() => this.addVariation()}
                                >
                                    {translations.addVariation}
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
            this.addErrorMessage(translations.variationsMustBeUnique);
            return false;
        } else {
            this.setState(newState);
            this.removeErrorMessage(translations.variationsMustBeUnique);
            return true;
        }
    }

    updateVariationTraffic(index, updatedTraffic) {
        const traffic = updatedTraffic.replace("%", "");
        if (isNaN(traffic) || traffic <= 0 || traffic > 100) {
            this.addErrorMessage(translations.trafficMustBeValid);
            return false;
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
        this.removeErrorMessage(translations.trafficMustBeValid);
        return true;
    }

    addVariation() {
        let variationCount = 1;
        let traffic = 10;
        while (true) {
            if (
                this.state.variations.some(
                    (variation) =>
                        variation.name ===
                        `${translations.variation} ${variationCount}`,
                )
            ) {
                variationCount++;
            } else {
                break;
            }
        }
        this.setState(
            update(this.state, {
                variations: {
                    $push: [
                        {
                            name: `${translations.variation} ${variationCount}`,
                            traffic,
                        },
                    ],
                },
            }),
        );
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

    isValidated() {
        if (!VariationsInfo.isTotalTrafficValid(this.state.variations)) {
            this.addErrorMessage(translations.trafficMustAddTo100);
            return false;
        } else {
            this.removeErrorMessage(translations.trafficMustAddTo100);
        }
        if (this.areVariationNamesUnique(this.state.variations)) {
            this.props.setVariations(this.state.variations);
            return true;
        } else {
            return false;
        }
    }

    static totalTraffic = (variations) => {
        let totalTraffic = 0;
        variations.forEach((variation) => (totalTraffic += variation.traffic));
        return totalTraffic;
    };

    static isTotalTrafficValid = (variations) =>
        VariationsInfo.totalTraffic(variations) === 100;
}

const EditableCell = (props) => {
    const { value, onValueChange, editible = true, inputFieldWidth } = props;

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
                                } else if (ev.key == "Escape") {
                                    setEdit(false);
                                }
                            }}
                            onBlur={() => setEdit(false)}
                            style={
                                inputFieldWidth && {
                                    width: inputFieldWidth,
                                }
                            }
                        />
                    </FormGroup>
                ) : (
                    <h5 onClick={() => setEdit(editible)}>{value}</h5>
                )}
            </div>
            {!edit && editible && (
                <Button
                    className="btn-link btn-icon"
                    color="primary"
                    style={{
                        visibility: showEditIcon ? "inherit" : "hidden",
                    }}
                    onClick={() => setEdit(editible)}
                >
                    <i className="tim-icons icon-pencil" />
                </Button>
            )}
            {!editible && (
                <i
                    className="tim-icons icon-lock-circle"
                    color="muted"
                    style={{
                        marginLeft: "0.5rem",
                        visibility: showEditIcon ? "inherit" : "hidden",
                    }}
                />
            )}
        </div>
    );
};

export default VariationsInfo;
