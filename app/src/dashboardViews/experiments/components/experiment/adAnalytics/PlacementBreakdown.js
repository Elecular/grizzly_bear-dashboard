import React from "react";
import { Table, Label } from "reactstrap";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import { getValueFromObject } from "utils/objectUtils";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";

const metricOptions = [
    {
        value: "adImpressions",
        label: "Ad Impressions",
        graphLabel: "Ad Impressions / Sessions",
    },
    {
        value: "adClicks",
        label: "Ad Clicks",
        graphLabel: "# Ad Clicks Per Sessions",
    },
    {
        value: "conversions",
        label: "Converted Sessions %",
        graphLabel: "Converted Sessions %",
        useFraction: true,
    },
];

const PlacementBreakDown = (props) => {
    const { stats, environment, segment } = props;

    const [metricOption, setMetricOption] = React.useState(metricOptions[2]);
    const variations = stats.getVariations();
    const metrics = stats.getAdMetrics(environment, segment);
    const placementMetrics = stats.getPlacementMetrics(environment, segment);
    console.log(placementMetrics);
    return (
        <div>
            <div style={{ width: "15rem" }}>
                <Label>Metric</Label>
                <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    placeholder="Metric"
                    value={metricOption}
                    options={metricOptions}
                    onChange={setMetricOption}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flexGrow: 1, marginRight: "3rem" }}>
                    <Table>
                        <thead className="text-primary">
                            <tr>
                                <th>Placement Id</th>
                                {variations.map((variation, index) => (
                                    <th>
                                        <i
                                            style={{
                                                color: variationColors[index],
                                                marginRight: "0.4rem",
                                            }}
                                            className="fa fa-circle"
                                        />
                                        {variation}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <ToolTipTableCell
                                    id="summary-sessions-info-icon"
                                    text="Sessions"
                                    tooltip="Number of sessions"
                                />
                                {variations.map((variation) => (
                                    <td>
                                        {Math.round(
                                            metrics["sessions"][variation],
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {Object.keys(placementMetrics)
                                .sort()
                                .map((placementId) => (
                                    <tr>
                                        <td>{`${placementId}`}</td>
                                        <MetricRow
                                            placementId={placementId}
                                            metricOption={metricOption}
                                            placementMetrics={placementMetrics}
                                            variations={variations}
                                        />
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </div>
                <div style={{ width: "30rem" }}>
                    {
                        <Bar
                            data={graphData(
                                variations,
                                placementMetrics,
                                metricOption,
                            )}
                            options={graphOptions(metricOption)}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

const MetricRow = (props) => {
    const { placementId, metricOption, placementMetrics, variations } = props;
    return variations.map((variation) => {
        let value = Math.round(
            getValueFromObject(
                placementMetrics,
                [placementId, metricOption.value, variation],
                0,
            ),
        );
        if (metricOption.useFraction) {
            value = (
                getValueFromObject(
                    placementMetrics,
                    [placementId, "fraction", metricOption.value, variation],
                    0,
                ) * 100
            ).toFixed(2);
        }

        let diff = getValueFromObject(
            placementMetrics,
            [placementId, "diff", metricOption.value, variation],
            0,
        );
        if (!isFinite(diff)) {
            diff = 0;
        }
        const absoluteDiff = Math.abs(diff);

        return (
            <td>
                {`${value}${metricOption.useFraction ? "%" : ""}`}
                {absoluteDiff > 0.01 && (
                    <>
                        <i
                            style={{
                                display: "inline-flex",
                                marginLeft: "0.75rem",
                                marginRight: "0.2rem",
                                color: diff > 0 ? positiveColor : negativeColor,
                            }}
                            className={`fa fa-arrow-${
                                diff > 0 ? "up" : "down"
                            }`}
                        ></i>
                        <div
                            style={{
                                display: "inline-flex",
                                color: diff > 0 ? positiveColor : negativeColor,
                            }}
                        >
                            {`${Math.round(absoluteDiff * 100)}%`}
                        </div>
                    </>
                )}
            </td>
        );
    });
};

const graphData = (variations, placementMetrics, metricOption) => ({
    datasets: variations.map((variation, index) => ({
        label: variation,
        backgroundColor: variationColors[index],
        data: Object.keys(placementMetrics)
            .sort()
            .map((placementId) =>
                (
                    getValueFromObject(
                        placementMetrics,
                        [
                            placementId,
                            "fraction",
                            metricOption.value,
                            variation,
                        ],
                        0,
                    ) * (metricOption.useFraction ? 100 : 1)
                ).toFixed(2),
            ),
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 0.3,
    })),
    labels: Object.keys(placementMetrics).sort(),
});

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

export default PlacementBreakDown;
