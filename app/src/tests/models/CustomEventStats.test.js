import CustomEventStats from "models/CustomEventStats";

it("can get custom event ids", () => {
    const stats = mockCustomEventStats();
    expect(stats.getCustomEventIds("prod", "all")).toStrictEqual([
        "event-1",
        "event-2",
    ]);
});

it("can sessions from custom event dataset", () => {
    const stats = mockCustomEventStats();
    const result = stats.getCustomEventDataset("prod", "all");
    expect(result.data.sessions).toStrictEqual({
        "Variation 1": 1000,
        "Variation 2": 2000,
        "Variation 3": 0,
    });
});

it("can events from custom event dataset", () => {
    const stats = mockCustomEventStats();
    const result = stats.getCustomEventDataset("prod", "all");
    expect(result.data["event-1"]).toStrictEqual({
        "Variation 1": 505,
        "Variation 2": 405,
        "Variation 3": 0,
    });
    expect(result.data["event-2"]).toStrictEqual({
        "Variation 1": 350,
        "Variation 2": 150,
        "Variation 3": 0,
    });
});

const mockCustomEventStats = (mockStats) =>
    new CustomEventStats(experimentInfo, [mockStats ? mockStats : stats]);

const stats = {
    environment: "prod",
    variations: {
        "Variation 1": {
            segments: {
                all: {
                    sessions: 1000,
                    "custom/event-1": {
                        count: 255,
                        amount: 505,
                    },
                    "custom/event-2": {
                        count: 450,
                        amount: 350,
                    },
                },
            },
        },
        "Variation 2": {
            segments: {
                all: {
                    sessions: 2000,
                    "custom/event-1": {
                        count: 155,
                        amount: 405,
                    },
                    "custom/event-2": {
                        count: 750,
                        amount: 150,
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
            controlGroup: true,
        },
        {
            variationName: "Variation 3",
            controlGroup: false,
        },
    ],
};
