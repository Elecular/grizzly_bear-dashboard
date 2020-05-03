import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import strings from "../../../localizedStrings/en";
import AuthorizationContext from "../../../auth/authorizationContext";
import AddExperiment from "../../../dashboardViews/addExperiment/AddExperiment";

jest.mock("../../../api/experiments");
jest.mock("../../../auth/login");

const tree = (onNextClick) => (
    <AuthorizationContext.Provider
        value={{
            project: {},
        }}
    >
        <AddExperiment onNextClick={onNextClick} />
    </AuthorizationContext.Provider>
);

const skipFirstAndSecondStep = () => {
    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
};

it("Can add a new setting", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.addSetting,
        ),
    );
    expect(screen.getByText("Setting 1")).toBeInTheDocument();
    setValue("Setting 1", "Control Group", "test 1");
    setValue("Setting 1", "Variation 1", "test 2");
    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    const res = mockCallback.mock.calls[0][0];

    expect(res.variables).toStrictEqual([
        { name: "Button Color", type: "String" },
        { name: "Setting 1", type: "String" },
    ]);

    expect(res.values[1]).toStrictEqual(["test 1", "test 2"]);
    expect(res.values[0][0]).toBe("red");
    expect(res.values[0][1]).toBe("blue");
});

it("Can delete a setting", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.addSetting,
        ),
    );
    expect(screen.getByText("Setting 1")).toBeInTheDocument();
    setValue("Setting 1", "Control Group", "test 1");
    setValue("Setting 1", "Variation 1", "test 2");

    fireEvent.click(screen.getByTestId("delete-Button Color"));

    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    const res = mockCallback.mock.calls[0][0];

    expect(res.variables).toStrictEqual([
        { name: "Setting 1", type: "String" },
    ]);
    expect(res.values[0]).toStrictEqual(["test 1", "test 2"]);
});

it("Cannot finish with empty values", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.addSetting,
        ),
    );
    expect(screen.getByText("Setting 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    expect(mockCallback.mock.calls.length).toBe(0);
    expect(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent
                .allSettingsMustBeDefined,
        ),
    ).toBeInTheDocument();
});

it("Cannot have duplicate setting names", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.addSetting,
        ),
    );
    expect(screen.getByText("Setting 1")).toBeInTheDocument();
    setValue("Setting 1", "Control Group", "test 1");
    setValue("Setting 1", "Variation 1", "test 2");
    setVariableName("Setting 1", "Button Color");

    expect(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent
                .settingNamesMustBeUnique,
        ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    const res = mockCallback.mock.calls[0][0];
    expect(res.variables).toStrictEqual([
        { name: "Button Color", type: "String" },
        { name: "Setting 1", type: "String" },
    ]);
});

it("Cannot edit a setting value to empty", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    setValue("Button Color", "Control Group", "");
    expect(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.enterValidValueName,
        ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    const res = mockCallback.mock.calls[0][0];
    expect(res.variables).toStrictEqual([
        { name: "Button Color", type: "String" },
    ]);
    expect(res.values[0][0]).toBe("red");
    expect(res.values[0][1]).toBe("blue");
});

it("Cannot edit a setting name to invalid name", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    setVariableName("Button Color", "!Button Color");
    expect(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.enterValidSettingName,
        ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    const res = mockCallback.mock.calls[0][0];
    expect(res.variables).toStrictEqual([
        { name: "Button Color", type: "String" },
    ]);
    expect(res.values[0][0]).toBe("red");
    expect(res.values[0][1]).toBe("blue");
});

it("Cannot go to next step if there are no settings", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstAndSecondStep();
    mockCallback.mockClear();

    fireEvent.click(screen.getByTestId("delete-Button Color"));
    fireEvent.click(screen.getByText(strings.addExperimentsTab.finish));

    expect(
        screen.getByText(
            strings.addExperimentsTab.settingsComponent.miniminSettingsError,
        ),
    ).toBeInTheDocument();
    expect(mockCallback.mock.calls.length).toBe(0);
});

const setVariableName = (variable, value) => {
    fireEvent.click(screen.getByTestId(`text-${variable}`));
    fireEvent.change(screen.getByTestId(`input-${variable}`), {
        target: { value },
    });
    fireEvent.keyDown(screen.getByTestId(`input-${variable}`), {
        key: "Enter",
    });
};

const setValue = (variable, variation, value) => {
    fireEvent.click(screen.getByTestId(`text-${variable}-${variation}`));
    fireEvent.change(screen.getByTestId(`input-${variable}-${variation}`), {
        target: { value },
    });
    fireEvent.keyDown(screen.getByTestId(`input-${variable}-${variation}`), {
        key: "Enter",
    });
};
