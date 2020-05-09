import AdStats from "models/AdStats";

it("Can get list placement ids", () => {
    const adStats = mockAdStats();
    expect(adStats.getPlacementIds("prod", "all")).toStrictEqual([
        "ad-1",
        "ad-2",
        "ad-3",
    ]);
});

it("Can get list placement ids without any placements", () => {
    const adStats = mockAdStats({
        environment: "prod",
        variations: {
            "Variation 1": {
                segments: {
                    all: {
                        sessions: 23,
                        "ads/click": 54,
                    },
                },
            },
        },
    });
    expect(adStats.getPlacementIds("prod", "all")).toStrictEqual([]);
});

it("Can get sessions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.sessions).toStrictEqual({
        "Variation 5": 2000,
        "Variation 4": 0,
        "Variation 1": 1000,
        "Variation 2": 3000,
        "Variation 3": 6000,
    });
});

it("Can get impressions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.adImpressions).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 25,
        "Variation 1": 25,
        "Variation 2": 60,
        "Variation 3": 0,
    });
});

it("Can get clicks from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.adClicks).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 500,
        "Variation 1": 500,
        "Variation 2": 600,
        "Variation 3": 0,
    });
});

it("Can get conversions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.conversions).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 250,
        "Variation 1": 250,
        "Variation 2": 350,
        "Variation 3": 0,
    });
});

it("Can get normalized impressions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.normalized.adImpressions).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 0.0125,
        "Variation 1": 0.025,
        "Variation 2": 0.02,
        "Variation 3": 0,
    });
});

it("Can get normalized clicks from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.normalized.adClicks).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 0.25,
        "Variation 1": 0.5,
        "Variation 2": 0.2,
        "Variation 3": 0,
    });
});

it("Can get normalized conversions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.normalized.conversions).toStrictEqual({
        "Variation 4": 0,
        "Variation 5": 0.125,
        "Variation 1": 0.25,
        "Variation 2": 0.11666666666666667,
        "Variation 3": 0,
    });
});

it("Can get diff of ad impressions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");

    expect(dataset.data.diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 4": -1,
        "Variation 1": 1,
        "Variation 2": 0.6,
        "Variation 3": -1,
    });
});

it("Can get diff of ad clicks from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.diff.adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 4": -1,
        "Variation 1": 1,
        "Variation 2": -0.19999999999999996,
        "Variation 3": -1,
    });
});

it("Can get diff of conversions from adDataset", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.diff.conversions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 1,
        "Variation 2": -0.06666666666666665,
        "Variation 3": -1,
        "Variation 4": -1,
    });
});

it("Can get sessions of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");
    const expectedSessions = {
        "Variation 5": 2000,
        "Variation 1": 1000,
        "Variation 2": 3000,
        "Variation 3": 6000,
        "Variation 4": 0,
    };
    expect(dataset.data["ad-1"].sessions).toStrictEqual(expectedSessions);
    expect(dataset.data["ad-2"].sessions).toStrictEqual(expectedSessions);
    expect(dataset.data["ad-3"].sessions).toStrictEqual(expectedSessions);
});

it("Can get ad impressions of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");

    expect(dataset.data["ad-1"].adImpressions).toStrictEqual({
        "Variation 5": 100,
        "Variation 1": 100,
        "Variation 2": 972,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-2"].adImpressions).toStrictEqual({
        "Variation 5": 150,
        "Variation 1": 150,
        "Variation 2": 650,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-3"].adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 1050,
        "Variation 4": 0,
    });
});

it("Can get ad clicks of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");
    expect(dataset.data["ad-1"].adClicks).toStrictEqual({
        "Variation 5": 300,
        "Variation 1": 300,
        "Variation 2": 832,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-2"].adClicks).toStrictEqual({
        "Variation 5": 350,
        "Variation 1": 350,
        "Variation 2": 541,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-3"].adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get normalized ad impressions of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");

    expect(dataset.data["ad-1"].normalized.adImpressions).toStrictEqual({
        "Variation 5": 0.05,
        "Variation 1": 0.1,
        "Variation 2": 0.324,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-2"].normalized.adImpressions).toStrictEqual({
        "Variation 5": 0.075,
        "Variation 1": 0.15,
        "Variation 2": 0.21666666666666667,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-3"].normalized.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0.175,
        "Variation 4": 0,
    });
});

it("Can get normalized ad clicks of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");

    expect(dataset.data["ad-1"].normalized.adClicks).toStrictEqual({
        "Variation 5": 300 / 2000,
        "Variation 1": 300 / 1000,
        "Variation 2": 832 / 3000,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-2"].normalized.adClicks).toStrictEqual({
        "Variation 5": 350 / 2000,
        "Variation 1": 350 / 1000,
        "Variation 2": 541 / 3000,
        "Variation 3": 0,
        "Variation 4": 0,
    });
    expect(dataset.data["ad-3"].normalized.adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad impressions of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");

    expect(dataset.data["ad-1"].diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 1,
        "Variation 2": 5.48,
        "Variation 3": -1,
        "Variation 4": -1,
    });
    expect(dataset.data["ad-2"].diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 1,
        "Variation 2": 1.8888888888888888,
        "Variation 3": -1,
        "Variation 4": -1,
    });
    expect(dataset.data["ad-3"].diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad clicks of all placements", () => {
    const adStats = mockAdStats();
    const dataset = adStats.getPlacementDataset("prod", "all");

    expect(dataset.data["ad-1"].diff.adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 1,
        "Variation 2": 0.8488888888888889,
        "Variation 3": -1,
        "Variation 4": -1,
    });
    expect(dataset.data["ad-2"].diff.adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 1,
        "Variation 2": 0.03047619047619061,
        "Variation 3": -1,
        "Variation 4": -1,
    });
    expect(dataset.data["ad-3"].diff.adClicks).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad impressions when there are sessions but no metrics in control group", () => {
    const adStats = mockAdStats(noMetricsInControlGroupStats);
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad impressions of placeent when there are sessions but no metrics in control group", () => {
    const adStats = mockAdStats(noMetricsInControlGroupStats);
    const dataset = adStats.getPlacementDataset("prod", "all");
    expect(dataset.data["ad-1"].diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad impressions when there are no metrics in control group", () => {
    const adStats = mockAdStats(emptyControlGroupStats);
    const dataset = adStats.getAdDataset("prod", "all");
    expect(dataset.data.diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

it("Can get diff of ad impressions of placeent when there are no metrics in control group", () => {
    const adStats = mockAdStats(emptyControlGroupStats);
    const dataset = adStats.getPlacementDataset("prod", "all");
    expect(dataset.data["ad-1"].diff.adImpressions).toStrictEqual({
        "Variation 5": 0,
        "Variation 1": 0,
        "Variation 2": 0,
        "Variation 3": 0,
        "Variation 4": 0,
    });
});

//Test when there are sessions and no metrics in control group

//Test when there are no sessions and no metrics in control group

//TODO: test when control group does not have any sessions
//TODO: Test when control group does not have any metrics

const mockAdStats = (mockStats) =>
    new AdStats(experimentInfo, [mockStats ? mockStats : stats]);

const adStats = {
    "ads/click": {
        count: 250,
        amount: 500,
    },
    "ads/impression": {
        count: 50,
        amount: 25,
    },
    "ads/click/ad-1": {
        count: 400,
        amount: 300,
    },
    "ads/impression/ad-1": {
        count: 600,
        amount: 100,
    },
    "ads/click/ad-2": {
        count: 700,
        amount: 350,
    },
    "ads/impression/ad-2": {
        count: 550,
        amount: 150,
    },
};

const stats = {
    environment: "prod",
    variations: {
        "Variation 1": {
            segments: {
                all: {
                    sessions: 1000,
                    ...adStats,
                },
            },
        },
        "Variation 2": {
            segments: {
                all: {
                    sessions: 3000,
                    "ads/click": {
                        count: 350,
                        amount: 600,
                    },
                    "ads/impression": {
                        count: 35,
                        amount: 60,
                    },
                    "ads/click/ad-1": {
                        count: 500,
                        amount: 832,
                    },
                    "ads/impression/ad-1": {
                        count: 700,
                        amount: 972,
                    },
                    "ads/click/ad-2": {
                        count: 200,
                        amount: 541,
                    },
                    "ads/impression/ad-2": {
                        count: 850,
                        amount: 650,
                    },
                },
            },
        },
        "Variation 5": {
            segments: {
                all: {
                    sessions: 2000,
                    ...adStats,
                },
            },
        },
        "Variation 3": {
            segments: {
                all: {
                    sessions: 6000,
                    "ads/impression/ad-3": {
                        count: 950,
                        amount: 1050,
                    },
                    "custom/event-1": {
                        count: 954,
                        amount: 1070,
                    },
                },
            },
        },
    },
};

const experimentInfo = {
    variations: [
        {
            variationName: "Variation 2",
            controlGroup: false,
        },
        {
            variationName: "Variation 1",
            controlGroup: false,
        },
        {
            variationName: "Variation 3",
            controlGroup: false,
        },
        {
            variationName: "Variation 5",
            controlGroup: true,
        },
        {
            variationName: "Variation 4",
            controlGroup: false,
        },
    ],
};

const noMetricsInControlGroupStats = {
    environment: "prod",
    variations: {
        "Variation 5": {
            segments: {
                all: {
                    sessions: 1000,
                },
            },
        },
        "Variation 2": {
            segments: {
                all: {
                    sessions: 3000,
                    "ads/click": {
                        count: 350,
                        amount: 600,
                    },
                    "ads/impression": {
                        count: 35,
                        amount: 60,
                    },
                    "ads/click/ad-1": {
                        count: 500,
                        amount: 832,
                    },
                    "ads/impression/ad-1": {
                        count: 700,
                        amount: 972,
                    },
                    "ads/click/ad-2": {
                        count: 200,
                        amount: 541,
                    },
                    "ads/impression/ad-2": {
                        count: 850,
                        amount: 650,
                    },
                },
            },
        },
    },
};

const emptyControlGroupStats = {
    environment: "prod",
    variations: {
        "Variation 2": {
            segments: {
                all: {
                    sessions: 3000,
                    "ads/click": {
                        count: 350,
                        amount: 600,
                    },
                    "ads/impression": {
                        count: 35,
                        amount: 60,
                    },
                    "ads/click/ad-1": {
                        count: 500,
                        amount: 832,
                    },
                    "ads/impression/ad-1": {
                        count: 700,
                        amount: 972,
                    },
                    "ads/click/ad-2": {
                        count: 200,
                        amount: 541,
                    },
                    "ads/impression/ad-2": {
                        count: 850,
                        amount: 650,
                    },
                },
            },
        },
    },
};
