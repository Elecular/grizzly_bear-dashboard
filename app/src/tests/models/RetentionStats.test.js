import RetentionStats from "models/RetentionStats";

it("can get retnetion stat ids", () => {
    const stats = mockRetentionStats();
    expect(stats.getRetentionStatIds("prod", "all")).toStrictEqual([
        "Day 7",
        "Day 30",
    ]);
});

it("can get sessions from retention stats dataset", () => {
    const stats = mockRetentionStats();
    const result = stats.getRetentionStatDataset("prod", "all");
    expect(result.data.sessions).toStrictEqual({
        "Variation 1": 1000,
        "Variation 2": 2000,
        "Variation 3": 0,
    });
});

it("can get events from retention stat dataset", () => {
    const stats = mockRetentionStats();
    const result = stats.getRetentionStatDataset("prod", "all");
    expect(result.data["Day 7"]).toStrictEqual({
        "Variation 1": 255,
        "Variation 2": 155,
        "Variation 3": 0,
    });
    expect(result.data["Day 30"]).toStrictEqual({
        "Variation 1": 450,
        "Variation 2": 750,
        "Variation 3": 0,
    });
});

const mockRetentionStats = (mockStats) =>
    new RetentionStats(experimentInfo, [mockStats ? mockStats : stats]);

const stats = {
    environment: "prod",
    variations: {
        "Variation 1": {
            segments: {
                all: {
                    sessions: 1000,
                    "retention/Day 7": {
                        count: 255,
                    },
                    "retention/Day 30": {
                        count: 450,
                    },
                },
            },
        },
        "Variation 2": {
            segments: {
                all: {
                    sessions: 2000,
                    "retention/Day 7": {
                        count: 155,
                    },
                    "retention/Day 30": {
                        count: 750,
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
