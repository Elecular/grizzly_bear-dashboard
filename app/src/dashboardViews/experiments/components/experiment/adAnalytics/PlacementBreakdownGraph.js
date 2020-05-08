import React from "react";
import { Bar } from "react-chartjs-2";
import { getValueFromObject } from "utils/objectUtils";
import { variationColors } from "utils/constants";

const PlacementBreakDownGraph = (props) => {
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
    const placementIds = stats.getPlacementIds(environment, segment);
    const placementDataset = stats.getPlacementDataset(environment, segment);
    return {
        datasets: variations.map((variation, index) => ({
            label: variation,
            backgroundColor: variationColors[index],
            data: placementIds.map((placementId) =>
                (
                    placementDataset.get(
                        placementId,
                        metricOption.value,
                        variation,
                        metricOption.normalized,
                    ) * (metricOption.normalized ? 100 : 1)
                ).toFixed(metricOption.normalized ? 2 : 0),
            ),
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.3,
        })),
        labels: placementIds,
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

export default PlacementBreakDownGraph;
