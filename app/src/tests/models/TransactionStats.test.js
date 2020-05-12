import TransactionStats from "models/TransactionStats";

it("can get list of product ids", () => {
    const stats = mockTransactionStats();
    expect(stats.getProductIds("prod", "all")).toStrictEqual([
        "item-1",
        "item-2",
    ]);
});

it("can get sessions from transaction dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getTransactionDataset("prod", "all");

    expect(result.data.sessions).toStrictEqual({
        "Variation 1": 1000,
        "Variation 2": 2000,
        "Variation 3": 0,
    });
});

it("can get revenue from transaction dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getTransactionDataset("prod", "all");

    expect(result.data.revenue).toStrictEqual({
        "Variation 1": 500,
        "Variation 2": 505,
        "Variation 3": 0,
    });
});

it("can get conversions from transaction dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getTransactionDataset("prod", "all");

    expect(result.data.conversions).toStrictEqual({
        "Variation 1": 250,
        "Variation 2": 255,
        "Variation 3": 0,
    });
});

it("can get sessions from product dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getProductDataset("prod", "all");
    expect(result.data["item-1"].sessions).toStrictEqual({
        "Variation 1": 1000,
        "Variation 2": 2000,
        "Variation 3": 0,
    });
    expect(result.data["item-2"].sessions).toStrictEqual({
        "Variation 1": 1000,
        "Variation 2": 2000,
        "Variation 3": 0,
    });
});

it("can get revenue from product dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getProductDataset("prod", "all");
    expect(result.data["item-1"].revenue).toStrictEqual({
        "Variation 1": 300,
        "Variation 2": 350,
        "Variation 3": 0,
    });
    expect(result.data["item-2"].revenue).toStrictEqual({
        "Variation 1": 100,
        "Variation 2": 150,
        "Variation 3": 0,
    });
});

it("can get conversions from product dataset", () => {
    const stats = mockTransactionStats();
    const result = stats.getProductDataset("prod", "all");
    expect(result.data["item-1"].conversions).toStrictEqual({
        "Variation 1": 400,
        "Variation 2": 450,
        "Variation 3": 0,
    });
    expect(result.data["item-2"].conversions).toStrictEqual({
        "Variation 1": 600,
        "Variation 2": 650,
        "Variation 3": 0,
    });
});

const mockTransactionStats = (mockStats) =>
    new TransactionStats(experimentInfo, [mockStats ? mockStats : stats]);

const stats = {
    environment: "prod",
    variations: {
        "Variation 1": {
            segments: {
                all: {
                    sessions: 1000,
                    "transactions/complete": {
                        count: 250,
                        amount: 500,
                    },
                    "transactions/complete/item-1": {
                        count: 400,
                        amount: 300,
                    },
                    "transactions/complete/item-2": {
                        count: 600,
                        amount: 100,
                    },
                },
            },
        },
        "Variation 2": {
            segments: {
                all: {
                    sessions: 2000,
                    "transactions/complete": {
                        count: 255,
                        amount: 505,
                    },
                    "transactions/complete/item-1": {
                        count: 450,
                        amount: 350,
                    },
                    "transactions/complete/item-2": {
                        count: 650,
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
