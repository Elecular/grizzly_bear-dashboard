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

it("Cannot go to next step until experiment name is not empty", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));

    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(nextButton);

    const invalidExperimentText =
        strings.addExperimentsTab.basicInfoComponent.invalidExperimentName;
    expect(screen.getByText(invalidExperimentText).textContent).toEqual(
        invalidExperimentText,
    );

    expect(mockCallback.mock.calls.length).toBe(0);
});

it("Cannot go to next step until end time is after startime", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));

    const scheduleExperment = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.scheduleExperiment,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(scheduleExperment);
    fireEvent.change(screen.getByTestId("endDate"), {
        target: { value: "05/04/2019 2:34 PM" },
    });
    fireEvent.click(nextButton);

    const invalidEndDateText =
        strings.addExperimentsTab.basicInfoComponent.invalidEndDate;
    expect(screen.getByText(invalidEndDateText).textContent).toEqual(
        invalidEndDateText,
    );

    expect(mockCallback.mock.calls.length).toBe(0);
});

it("Can go to next step until start time is after current", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));

    const scheduleExperment = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.scheduleExperiment,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(scheduleExperment);
    fireEvent.change(screen.getByTestId("startDate"), {
        target: { value: "05/04/2019 2:34 PM" },
    });
    fireEvent.click(nextButton);

    const invalidStartDateText =
        strings.addExperimentsTab.basicInfoComponent.invalidStartDate;
    expect(screen.getByText(invalidStartDateText).textContent).toEqual(
        invalidStartDateText,
    );

    expect(mockCallback.mock.calls.length).toBe(0);
});

it("Can go to next step with valid experiment name", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));

    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.click(nextButton);

    expect(mockCallback.mock.calls.length).toBe(1);
    const state = mockCallback.mock.calls[0][0];
    expect(state.experimentName).toEqual("Experiment Name");
    expect(state.scheduleExperiments).toEqual(false);
});

it("Can go to next step with valid experiment name after scheduling experiment and then choosing not to", async () => {
    const mockCallback = jest.fn();
    const addExperiment = render(tree(mockCallback));

    const scheduleExperment = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.scheduleExperiment,
    );
    const startExperimentNow = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.startExperimentNow,
    );

    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(scheduleExperment);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.change(screen.getByTestId("startDate"), {
        target: { value: "05/04/2019 2:34 PM" },
    });
    fireEvent.change(screen.getByTestId("endDate"), {
        target: { value: "05/04/2018 2:34 PM" },
    });
    fireEvent.click(startExperimentNow);
    fireEvent.click(nextButton);

    expect(mockCallback.mock.calls.length).toBe(1);
    const state = mockCallback.mock.calls[0][0];
    expect(state.experimentName).toEqual("Experiment Name");
    expect(state.scheduleExperiments).toEqual(false);
});

it("Can go to next step with valid experiment name, start date and undefined end date", async () => {
    const mockCallback = jest.fn();
    const addExperiment = render(tree(mockCallback));

    const scheduleExperment = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.scheduleExperiment,
    );
    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(scheduleExperment);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.change(screen.getByTestId("startDate"), {
        target: { value: "05/04/6000 2:34 PM" },
    });
    fireEvent.click(nextButton);

    expect(mockCallback.mock.calls.length).toBe(1);
    const state = mockCallback.mock.calls[0][0];
    expect(state.experimentName).toEqual("Experiment Name");
    expect(state.scheduleExperiments).toEqual(true);
    expect(state.startTime).toBe(127185251640000);
    expect(state.endTime).toBeUndefined();
});

it("Can go to next step with valid experiment name, start date and end date", async () => {
    const mockCallback = jest.fn();
    const addExperiment = render(tree(mockCallback));

    const scheduleExperment = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.scheduleExperiment,
    );
    const startExperimentNow = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.startExperimentNow,
    );

    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.click(scheduleExperment);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.change(screen.getByTestId("startDate"), {
        target: { value: "05/04/6000 2:34 PM" },
    });
    fireEvent.change(screen.getByTestId("endDate"), {
        target: { value: "05/04/6005 2:34 PM" },
    });
    fireEvent.click(nextButton);

    expect(mockCallback.mock.calls.length).toBe(1);
    const state = mockCallback.mock.calls[0][0];
    expect(state.experimentName).toEqual("Experiment Name");
    expect(state.scheduleExperiments).toEqual(true);
    expect(state.startTime).toBe(127185251640000);
    expect(state.endTime).toBe(127343018040000);
});
