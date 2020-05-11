import React from "react";
import strings from "../../../localizedStrings/strings";
import { Table, Button, UncontrolledAlert } from "reactstrap";
import update from "immutability-helper";
import EditableCell from "./EditableCell";
import { isValidAlphaNumericString } from "../../../utils/strings";

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
        const { variations, errors } = this.state;
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
                                        dataTestId={variation.name}
                                        editible={!isControlGroup(variation)}
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
                                        dataTestId={`${variation.name}-traffic`}
                                    />
                                </td>
                                <td>
                                    {!isControlGroup(variation) && (
                                        <Button
                                            className="btn-link btn-icon"
                                            color="danger"
                                            onClick={() =>
                                                this.deleteVariation(index)
                                            }
                                            data-testid={`delete-${variation.name}`}
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
                {errors.map((error) => (
                    <UncontrolledAlert
                        key={error}
                        style={{
                            width,
                            margin: "auto",
                            marginBottom: "1rem",
                        }}
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
        if (!isValidAlphaNumericString(updatedName)) {
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
        const { variations } = this.state;
        //variation count is simply used for giving a unique name to the newly added variation
        let variationCount = 1;
        while (true) {
            if (
                variations.some(
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
                            traffic: 10,
                            controlGroup: false,
                        },
                    ],
                },
            }),
        );
    }

    deleteVariation(index) {
        const { variations } = this.state;
        this.setState({
            variations: variations.filter((_, i) => i !== index),
        });
    }

    addErrorMessage(errorMessage) {
        const { errors } = this.state;
        if (errors.includes(errorMessage)) return;
        this.setState(
            update(this.state, {
                errors: {
                    $push: [errorMessage],
                },
            }),
        );
    }

    removeErrorMessage(...errorMessages) {
        const { errors } = this.state;
        this.setState({
            errors: errors.filter((error) => !errorMessages.includes(error)),
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
        const { variations } = this.state;
        const { setVariations } = this.props;
        if (!isTotalTrafficValid(variations)) {
            this.addErrorMessage(translations.trafficMustAddTo100);
            return false;
        }
        if (!this.areVariationNamesUnique(variations)) {
            this.addErrorMessage(translations.variationsMustBeUnique);
            return false;
        }
        if (variations.length < 2) {
            this.addErrorMessage(translations.minimumVariationError);
            return false;
        }
        this.removeErrorMessage(
            translations.trafficMustAddTo100,
            translations.variationsMustBeUnique,
            translations.minimumVariationError,
        );
        setVariations(variations);
        return true;
    }
}

const isControlGroup = (variation) => variation.controlGroup;

const isTotalTrafficValid = (variations) => totalTraffic(variations) === 100;

const totalTraffic = (variations) => {
    let totalTraffic = 0;
    variations.forEach((variation) => (totalTraffic += variation.traffic));
    return totalTraffic;
};

export default VariationsInfo;
