import ExperimentStats from "models/ExperimentStats";

it("Can get environments", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getEnvironments()).toStrictEqual(["prod", "stage"]);
});

it("Can get variations in correct order", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getVariations()).toStrictEqual([
        "Variation 5",
        "Variation 1",
        "Variation 2",
        "Variation 3",
    ]);
});

it("Can get control group", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getControlGroup()).toBe("Variation 5");
});

it("Can get segments when no segments are present", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getSegments()).toStrictEqual([]);
});

it("Can get segments when present in only one variation", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: 4,
                        two: 3,
                    },
                },
            },
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getSegments()).toStrictEqual(["all", "two"]);
});

it("Can get segments when present in multiple variation", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: 4,
                        two: 3,
                    },
                },
            },
        },
        {
            environment: "stage",
            variations: {
                "Variation 1": {
                    segments: {
                        all: 4,
                        two: 3,
                    },
                },
                "Variation 2": {
                    segments: {
                        all: 4,
                        one: 3,
                    },
                },
            },
        },
    ]);
    expect(stats.getSegments()).toStrictEqual(["all", "one", "two"]);
});

it("Can get metric ids when there are no metrics", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getMetricIds()).toStrictEqual([
        "ads/click",
        "ads/impression",
        "sessions",
    ]);
});

it("Can get metric ids when metric ids when only present in one environment, variation and segment", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            metricId: 4,
                            metricId2: 6,
                        },
                    },
                },
            },
        },
        {
            environment: "stage",
            variations: {},
        },
    ]);
    expect(stats.getMetricIds()).toStrictEqual([
        "ads/click",
        "ads/impression",
        "metricId",
        "metricId2",
        "sessions",
    ]);
});

it("Can get metric ids when metric ids are present in many variations", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            metricId: 4,
                            metricId2: 6,
                        },
                        one: {
                            metricId3: 1,
                        },
                    },
                },
            },
        },
        {
            environment: "stage",
            variations: {
                "Variation 2": {
                    segments: {
                        all: {
                            metricId4: 12,
                            metricId5: 122,
                        },
                    },
                },
                "Variation 1": {
                    segments: {
                        all: {
                            metricId5: 12,
                        },
                    },
                },
            },
        },
    ]);
    expect(stats.getMetricIds()).toStrictEqual([
        "ads/click",
        "ads/impression",
        "metricId",
        "metricId2",
        "metricId3",
        "metricId4",
        "metricId5",
        "sessions",
    ]);
});

it("Can get metrics when present in one variation but not another", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            metricId1: { count: 34, amount: 21 },
                        },
                    },
                },
            },
        },
    ]);
    const result = stats.getMetrics("prod", "all");
    expect(result.get("metricId1", "Variation 1", "count")).toBe(34);
    expect(result.get("metricId1", "Variation 1", "amount")).toBe(21);

    expect(result.get("metricId1", "Variation 5", "count")).toBe(0);
    expect(result.get("metricId1", "Variation 5", "amount")).toBe(0);
});

it("Can get metrics when present in multiple variations", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            metricId1: { count: 34, amount: 21 },
                        },
                    },
                },
                "Variation 5": {
                    segments: {
                        all: {
                            metricId1: { count: 8, amount: 10 },
                            metricId2: { count: 3, amount: 5 },
                        },
                    },
                },
            },
        },
    ]);
    const result = stats.getMetrics("prod", "all");
    expect(result.get("metricId1", "Variation 1", "count")).toBe(34);
    expect(result.get("metricId1", "Variation 1", "amount")).toBe(21);
    expect(result.get("metricId2", "Variation 1", "count")).toBe(0);
    expect(result.get("metricId2", "Variation 1", "amount")).toBe(0);

    expect(result.get("metricId1", "Variation 5", "count")).toBe(8);
    expect(result.get("metricId1", "Variation 5", "amount")).toBe(10);
    expect(result.get("metricId2", "Variation 5", "count")).toBe(3);
    expect(result.get("metricId2", "Variation 5", "amount")).toBe(5);
});

it("Can get sessions when present in multiple variations", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            sessions: 22,
                        },
                    },
                },
                "Variation 5": {
                    segments: {
                        all: {
                            sessions: 12,
                        },
                    },
                },
            },
        },
    ]);
    const result = stats.getMetrics("prod", "all");
    expect(result.get("sessions", "Variation 1")).toBe(22);
    expect(result.get("sessions", "Variation 5")).toBe(12);
    expect(result.get("sessions", "Variation 2")).toBe(0);
});

it("Can check if stats have any data", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {
                "Variation 1": {
                    segments: {
                        all: {
                            sessions: 22,
                        },
                    },
                },
                "Variation 5": {
                    segments: {
                        all: {
                            sessions: 12,
                        },
                    },
                },
            },
        },
    ]);
    expect(stats.hasData("prod")).toBe(true);
    expect(stats.hasData("stage")).toBe(false);
});

it("Can get list of all variables", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
    ]);
    expect(stats.getVariables()).toStrictEqual(["var1", "var2"]);
});

it("Can get variable values", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
    ]);
    expect(stats.getVariableValue("var1", "Variation 2")).toBe("2.1");
    expect(stats.getVariableValue("var2", "Variation 2")).toBe("2.2");
    expect(stats.getVariableValue("var1", "Variation 1")).toBe("1.1");
    expect(stats.getVariableValue("var2", "Variation 1")).toBe("1.2");
    expect(stats.getVariableValue("var1", "Variation 5")).toBe("5.1");
    expect(stats.getVariableValue("var2", "Variation 5")).toBe("5.2");
});

it("Can get variation allocation", () => {
    let stats = mockExperimentStats([
        {
            environment: "prod",
            variations: {},
        },
    ]);
    expect(stats.getVariationAllocation("Variation 2")).toBe(0.5);
    expect(stats.getVariationAllocation("Variation 1")).toBe(0.3);
    expect(stats.getVariationAllocation("Variation 5")).toBe(0.05);
    expect(stats.getVariationAllocation("Variation 3")).toBe(0.15);
});

const mockExperimentStats = (stats) => {
    return new ExperimentStats(experimentInfo, stats);
};

const experimentInfo = {
    variations: [
        {
            variationName: "Variation 2",
            controlGroup: false,
            variables: [
                {
                    variableName: "var1",
                    variableValue: "2.1",
                },
                {
                    variableName: "var2",
                    variableValue: "2.2",
                },
            ],
            normalizedTrafficAmount: 0.5,
        },
        {
            variationName: "Variation 1",
            controlGroup: false,
            variables: [
                {
                    variableName: "var1",
                    variableValue: "1.1",
                },
                {
                    variableName: "var2",
                    variableValue: "1.2",
                },
            ],
            normalizedTrafficAmount: 0.3,
        },
        {
            variationName: "Variation 5",
            controlGroup: true,
            variables: [
                {
                    variableName: "var1",
                    variableValue: "5.1",
                },
                {
                    variableName: "var2",
                    variableValue: "5.2",
                },
            ],
            normalizedTrafficAmount: 0.05,
        },
        {
            variationName: "Variation 3",
            controlGroup: false,
            variables: [
                {
                    variableName: "var1",
                },
                {
                    variableName: "var2",
                },
            ],
            normalizedTrafficAmount: 0.15,
        },
    ],
};
