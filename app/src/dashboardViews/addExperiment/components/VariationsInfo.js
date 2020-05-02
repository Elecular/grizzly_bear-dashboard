import React from "react";
import strings from "../../../localizedStrings/strings";
import { Table, Button, UncontrolledAlert } from "reactstrap";
import update from "immutability-helper";
import EditableCell from "./EditableCell";

const width = "35rem";
const controlGoupName = "Control Group";
const variationName = "Variation";
const translations = strings.addExperimentsTab.variationsComponent;

class VariationsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variations: [
                {
                    name: controlGoupName,
                    traffic: 50,
                    controlGroup: true,
                },
                {
                    name: `${variationName} 1`,
                    traffic: 50,
                    controlGroup: false,
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
                            <th className="text-left">
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
                                            variation.name !== controlGoupName
                                        }
                                    />
                                </td>
                                <td className="text-left">
                                    <EditableCell
                                        cellWidth="4.5rem"
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
                                    {variation.name !== controlGoupName && (
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
        if (updatedName === "" || !updatedName.match(/^[a-zA-Z0-9 ]*$/)) {
            this.addErrorMessage(translations.enterValidVariationName);
            return false;
        }
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
        }

        this.setState(newState);
        this.removeErrorMessage(
            translations.enterValidVariationName,
            translations.variationsMustBeUnique,
        );
        return true;
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
        while (true) {
            if (
                this.state.variations.some(
                    (variation) =>
                        variation.name === `${variationName} ${variationCount}`,
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
                            name: `${variationName} ${variationCount}`,
                            traffic: 0,
                            controlGroup: false,
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

    removeErrorMessage(...errorMessages) {
        this.setState({
            errors: this.state.errors.filter(
                (error) => !errorMessages.includes(error),
            ),
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
        }
        if (!this.areVariationNamesUnique(this.state.variations)) {
            return false;
        }
        this.removeErrorMessage(
            translations.trafficMustAddTo100,
            translations.variationsMustBeUnique,
        );
        this.props.setVariations(this.state.variations);
        return true;
    }

    static totalTraffic = (variations) => {
        let totalTraffic = 0;
        variations.forEach((variation) => (totalTraffic += variation.traffic));
        return totalTraffic;
    };

    static isTotalTrafficValid = (variations) =>
        VariationsInfo.totalTraffic(variations) === 100;
}

export default VariationsInfo;
