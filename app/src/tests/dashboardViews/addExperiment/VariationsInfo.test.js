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

const skipFirstStep = () => {
    const experimentNameField = screen.getByLabelText(
        strings.addExperimentsTab.basicInfoComponent.experimentName,
    );
    const nextButton = screen.getByText(strings.addExperimentsTab.next);
    fireEvent.change(experimentNameField, {
        target: { value: "Experiment Name" },
    });
    fireEvent.click(nextButton);
};

it("Can add a new variation and update traffic", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.variationsComponent.addVariation,
        ),
    );
    expect(screen.getByText("Variation 2")).toBeInTheDocument();

    //Editing traffic to make ot equal to 100%
    fireEvent.click(screen.getByTestId("text-Variation 1-traffic"));
    fireEvent.change(screen.getByTestId("input-Variation 1-traffic"), {
        target: { value: 40 },
    });
    fireEvent.keyDown(screen.getByTestId("input-Variation 1-traffic"), {
        key: "Enter",
    });

    fireEvent.click(screen.getByText(strings.addExperimentsTab.next));

    expect(mockCallback.mock.calls[0][0]).toEqual([
        { name: "Control Group", traffic: 50, controlGroup: true },
        { name: "Variation 1", traffic: 40, controlGroup: false },
        { name: "Variation 2", traffic: 10, controlGroup: false },
    ]);
});

it("Can delete a variation", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.variationsComponent.addVariation,
        ),
    );
    expect(screen.getByText("Variation 2")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-Variation 2"));
    fireEvent.click(screen.getByText(strings.addExperimentsTab.next));

    expect(screen.queryByText("Variation 2")).not.toBeInTheDocument();

    expect(mockCallback.mock.calls[0][0]).toEqual([
        { name: "Control Group", traffic: 50, controlGroup: true },
        { name: "Variation 1", traffic: 50, controlGroup: false },
    ]);
});

it("Can edit variation name", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstStep();
    mockCallback.mockClear();

    fireEvent.click(screen.getByTestId("text-Variation 1"));
    fireEvent.change(screen.getByTestId("input-Variation 1"), {
        target: { value: "Variation edited name" },
    });
    fireEvent.keyDown(screen.getByTestId("input-Variation 1"), {
        key: "Enter",
        code: "Enter",
    });
    fireEvent.click(screen.getByText(strings.addExperimentsTab.next));

    expect(mockCallback.mock.calls[0][0]).toEqual([
        { name: "Control Group", traffic: 50, controlGroup: true },
        { name: "Variation edited name", traffic: 50, controlGroup: false },
    ]);
});

it("Cannot have duplicate or empty variation names", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstStep();
    mockCallback.mockClear();

    fireEvent.click(screen.getByTestId("text-Variation 1"));
    fireEvent.change(screen.getByTestId("input-Variation 1"), {
        target: { value: "Control Group" },
    });
    fireEvent.keyDown(screen.getByTestId("input-Variation 1"), {
        key: "Enter",
        code: "Enter",
    });
    fireEvent.change(screen.getByTestId("input-Variation 1"), {
        target: { value: "" },
    });
    fireEvent.keyDown(screen.getByTestId("input-Variation 1"), {
        key: "Enter",
        code: "Enter",
    });

    const uniqueErrorMessage =
        strings.addExperimentsTab.variationsComponent.variationsMustBeUnique;
    const variationNameErrorMessage =
        strings.addExperimentsTab.variationsComponent.enterValidVariationName;

    expect(screen.getByText(uniqueErrorMessage)).toBeInTheDocument();
    expect(screen.getByText(variationNameErrorMessage)).toBeInTheDocument();

    fireEvent.click(screen.getByText(strings.addExperimentsTab.next));

    expect(mockCallback.mock.calls[0][0]).toEqual([
        { name: "Control Group", traffic: 50, controlGroup: true },
        { name: "Variation 1", traffic: 50, controlGroup: false },
    ]);
});

it("Cannot cannot got to next step when traffic does not add up to 100%", async () => {
    const mockCallback = jest.fn();
    render(tree(mockCallback));
    skipFirstStep();
    mockCallback.mockClear();

    fireEvent.click(
        screen.getByText(
            strings.addExperimentsTab.variationsComponent.addVariation,
        ),
    );

    fireEvent.click(screen.getByText(strings.addExperimentsTab.next));

    expect(
        screen.getByText(
            strings.addExperimentsTab.variationsComponent.trafficMustAddTo100,
        ),
    ).toBeInTheDocument();
    expect(mockCallback.mock.calls.length).toBe(0);
});
