import React from "react";
import { Bar } from "react-chartjs-2";
import { variationColors } from "utils/constants";

const ProductBreakDownGraph = (props) => {
    const { metricOption, stats, environment, segment } = props;
    return (
        <Bar
            data={graphData(metricOption, stats, environment, segment)}
            options={graphOptions(metricOption)}
        />
    );
};

const graphData = (metricOption, stats, environment, segment) => {
    const variations = stats.getVariations();
    const productIds = stats.getProductIds(environment, segment);
    const productDataset = stats.getProductDataset(environment, segment);
    return {
        datasets: variations.map((variation, index) => ({
            label: variation,
            backgroundColor: variationColors[index],
            data: productIds.map((productId) =>
                (
                    productDataset.get(
                        productId,
                        metricOption.value,
                        variation,
                        metricOption.normalized,
                    ) * (metricOption.normalized ? 100 : 1)
                ).toFixed(metricOption.decimalPoints),
            ),
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.3,
        })),
        labels: productIds,
    };
};

const graphOptions = (metricsOption) => ({
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                gridLines: {
                    offsetGridLines: true,
                    display: false,
                },
            },
        ],
        yAxes: [
            {
                scaleLabel: {
                    display: true,
                    labelString: metricsOption.graphLabel,
                },
                ticks: {
                    beginAtZero: true,
                },
                gridLines: {
                    zeroLineColor: "#9A9A9A25",
                    display: true,
                    color: "#9A9A9A25",
                    drawBorder: false,
                },
            },
        ],
    },
});

export default ProductBreakDownGraph;
