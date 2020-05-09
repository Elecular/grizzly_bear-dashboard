import React from "react";
import { variationColors } from "utils/constants";
import { Bar } from "react-chartjs-2";

const ResultsGraph = (props) => {
    const { stats, environment, segment } = props;

    return (
        <Bar
            data={graphData(stats, environment, segment)}
            options={graphOptions}
        />
    );
};

const graphData = (stats, environment, segment) => {
    const variations = stats.getVariations();
    const metrics = stats.getAdDataset(environment, segment);

    return {
        datasets: [
            {
                label: "Converted Sessions %",
                data: variations.map((variation) =>
                    (metrics.get("conversions", variation, true) * 100).toFixed(
                        2,
                    ),
                ),
                backgroundColor: variationColors,
                barPercentage: 0.3,
            },
        ],
        labels: variations,
    };
};

const graphOptions = {
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
                    labelString: "Converted Sessions %",
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
};

export default ResultsGraph;
