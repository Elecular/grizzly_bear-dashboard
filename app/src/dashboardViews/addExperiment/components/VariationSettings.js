import React from "react";
import strings from "../../../localizedStrings/strings";
import EditableCell from "./EditableCell";
import update from "immutability-helper";
import { Table, Button, UncontrolledAlert } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";

const exampleColors = [
    "red",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "brown",
    "teal",
    "pink",
    "violet",
    "cyan",
    "olive",
    "lime",
    "black",
    "white",
    "navy",
];
const translations = strings.addExperimentsTab.settingsComponent;
const variableName = "Setting";

class VariationSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variables: [
                {
                    name: "Button Color",
                    type: "String",
                },
            ],
            values: [exampleColors],
            errors: [],
            scrollBar: undefined,
        };

        this.addVariable.bind(this);
        this.updateVariable.bind(this);
        this.updateValue.bind(this);
        this.deleteVariable.bind(this);
        this.areAllValuesValid.bind(this);
    }

    render() {
        const { variations } = this.props;
        const { variables, values, errors } = this.state;
        return (
            <div
                id="variationSettingsTable"
                style={{
                    marginLeft: "3.5rem",
                    marginRight: "3.5rem",
                    position: "relative",
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
                <Table>
                    <thead className="text-primary">
                        <tr>
                            <th className="text-left">
                                {translations.settings}
                            </th>
                            {variations &&
                                variations.map((variation) => (
                                    <th
                                        key={variation.name}
                                        className="text-left"
                                    >
                                        {variation.name}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {variables.map((variable, variableIndex) => (
                            <tr key={variable.name}>
                                <td className="text-left">
                                    <div>
                                        <EditableCell
                                            value={variable.name}
                                            editible={true}
                                            dataTestId={`${variable.name}`}
                                            onValueChange={(value) =>
                                                this.updateVariable(
                                                    variableIndex,
                                                    value.trim(),
                                                )
                                            }
                                        />
                                    </div>
                                </td>
                                {variations.map((variation, variationIndex) => {
                                    let value = "";
                                    if (
                                        values[variableIndex] &&
                                        values[variableIndex][variationIndex]
                                    ) {
                                        value =
                                            values[variableIndex][
                                                variationIndex
                                            ];
                                    }
                                    return (
                                        <td
                                            key={variation.name}
                                            className="text-left"
                                        >
                                            <EditableCell
                                                value={value}
                                                editible={true}
                                                dataTestId={`${variable.name}-${variation.name}`}
                                                onValueChange={(value) =>
                                                    this.updateValue(
                                                        variableIndex,
                                                        variationIndex,
                                                        value,
                                                    )
                                                }
                                            />
                                        </td>
                                    );
                                })}
                                <td>
                                    <Button
                                        className="btn-link btn-icon"
                                        color="danger"
                                        data-testid={`delete-${variable.name}`}
                                        onClick={() =>
                                            this.deleteVariable(variableIndex)
                                        }
                                    >
                                        <i className="tim-icons icon-trash-simple" />
                                    </Button>
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
                                    onClick={() => this.addVariable()}
                                >
                                    {translations.addSetting}
                                </Button>
                            </td>
                            {variations.map((variation) => (
                                <td key={variation.name} />
                            ))}
                            <td />
                        </tr>
                    </tbody>
                </Table>
                {errors.map((error) => (
                    <UncontrolledAlert
                        key={error}
                        color="danger"
                        onClick={() => {
                            this.removeErrorMessage(error);
                        }}
                        style={{
                            marginBottom: "1rem",
                        }}
                    >
                        {error}
                    </UncontrolledAlert>
                ))}
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            scrollBar: new PerfectScrollbar("#variationSettingsTable", {
                wheelPropagation: false,
            }),
        });
    }

    componentDidUpdate() {
        this.state.scrollBar.update();
    }

    updateVariable = (variableIndex, variableName) => {
        if (variableName === "" || !variableName.match(/^[a-zA-Z0-9 ]*$/)) {
            this.addErrorMessage(translations.enterValidSettingName);
            return false;
        }
        const newState = update(this.state, {
            variables: {
                [variableIndex]: {
                    name: {
                        $set: variableName,
                    },
                },
            },
        });
        if (!areVariableNamesUnique(newState.variables)) {
            this.addErrorMessage(translations.settingNamesMustBeUnique);
            return false;
        }

        this.setState(newState);
        this.removeErrorMessage(
            translations.settingNamesMustBeUnique,
            translations.enterValidSettingName,
        );
        return true;
    };

    updateValue(variableIndex, variationIndex, value) {
        if (value === "") {
            this.addErrorMessage(translations.enterValidValueName);
            return false;
        }
        const newState = update(this.state, {
            values: {
                [variableIndex]: {
                    [variationIndex]: {
                        $set: value,
                    },
                },
            },
        });
        this.setState(newState);
        this.removeErrorMessage(translations.enterValidValueName);
        return true;
    }

    deleteVariable(variableIndex) {
        const { variables, values } = this.state;
        this.setState({
            variables: variables.filter((_, i) => i !== variableIndex),
            values: values.filter((_, i) => i !== variableIndex),
        });
    }

    addVariable() {
        const { variables } = this.state;
        let settingCount = 1;
        while (true) {
            if (
                variables.some(
                    (variable) =>
                        variable.name === `${variableName} ${settingCount}`,
                )
            ) {
                settingCount++;
            } else {
                break;
            }
        }
        this.setState(
            update(this.state, {
                variables: {
                    $push: [
                        {
                            name: `${variableName} ${settingCount}`,
                            type: "String",
                        },
                    ],
                },
                values: {
                    $push: [[]],
                },
            }),
        );
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

    areAllValuesValid() {
        const { variables, values } = this.state;
        const { variations } = this.props;
        for (
            let variableIndex = 0;
            variableIndex < variables.length;
            variableIndex++
        ) {
            for (
                let variationIndex = 0;
                variationIndex < variations.length;
                variationIndex++
            ) {
                const value = values[variableIndex][variationIndex];
                if (!value) {
                    return false;
                }
            }
        }
        return true;
    }

    isValidated() {
        const { variables } = this.state;
        const { setVariationSettings } = this.props;
        if (!this.areAllValuesValid()) {
            this.addErrorMessage(translations.allSettingsMustBeDefined);
            return false;
        } else if (!areVariableNamesUnique(variables)) {
            this.addErrorMessage(translations.settingNamesMustBeUnique);
            return false;
        }
        this.removeErrorMessage(
            translations.allSettingsMustBeDefined,
            translations.settingNamesMustBeUnique,
        );
        setVariationSettings(this.state);
        return true;
    }
}

const areVariableNamesUnique = (variables) => {
    let names = {};
    for (let variable of variables) {
        if (names[variable.name]) return false;
        names[variable.name] = true;
    }
    return true;
};

export default VariationSettings;
