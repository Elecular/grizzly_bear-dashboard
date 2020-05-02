import React from "react";
import strings from "../../../localizedStrings/strings";
import EditableCell from "./EditableCell";
import update from "immutability-helper";
import {
    Table,
    Button,
    UncontrolledAlert,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
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
        const { variables, values } = this.state;
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
                                    <th className="text-left">
                                        {variation.name}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {variables.map((variable, variableIndex) => (
                            <tr>
                                <td className="text-left">
                                    <div>
                                        <EditableCell
                                            value={variable.name}
                                            editible={true}
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
                                        <td className="text-left">
                                            <EditableCell
                                                value={value}
                                                editible={true}
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
                            {variations.map(() => (
                                <td />
                            ))}
                            <td />
                        </tr>
                    </tbody>
                </Table>
                {this.state.errors.map((error) => (
                    <UncontrolledAlert
                        key={error}
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
        if (!VariationSettings.areVariableNamesUnique(newState.variables)) {
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
        if (value === "" || !value.match(/^[a-zA-Z0-9 ]*$/)) {
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
        this.setState({
            variables: this.state.variables.filter(
                (_, i) => i !== variableIndex,
            ),
            values: this.state.values.filter((_, i) => i !== variableIndex),
        });
    }

    addVariable() {
        let settingCount = 1;
        while (true) {
            if (
                this.state.variables.some(
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

    areAllValuesValid() {
        for (
            let variableIndex = 0;
            variableIndex < this.state.variables.length;
            variableIndex++
        ) {
            for (
                let variationIndex = 0;
                variationIndex < this.props.variations.length;
                variationIndex++
            ) {
                const value = this.state.values[variableIndex][variationIndex];
                if (!value) {
                    return false;
                }
            }
        }
        return true;
    }

    static areVariableNamesUnique(variables) {
        let names = {};
        for (let variable of variables) {
            if (names[variable.name]) return false;
            names[variable.name] = true;
        }
        return true;
    }

    isValidated() {
        if (!this.areAllValuesValid()) {
            this.addErrorMessage(translations.allSettingsMustBeDefined);
            return false;
        } else if (
            !VariationSettings.areVariableNamesUnique(this.state.variables)
        ) {
            this.addErrorMessage(translations.settingNamesMustBeUnique);
            return false;
        }
        this.removeErrorMessage(
            translations.allSettingsMustBeDefined,
            translations.settingNamesMustBeUnique,
        );
        this.props.setVariationSettings(this.state);
        return true;
    }
}

export default VariationSettings;
