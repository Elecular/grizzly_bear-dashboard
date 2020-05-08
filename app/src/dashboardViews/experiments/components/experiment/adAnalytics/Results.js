import React from "react";
import { Table } from "reactstrap";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import { Bar } from "react-chartjs-2";
import ToolTipTableCell from "../ToolTipTableCell";
import { getValueFromObject } from "utils/objectUtils";
import AdStats from "models/AdStats";

const AdResults = (props) => {
    const { stats, environment, segment } = props;

    const adStats = AdStats.Instantiate(stats);
    const variations = adStats.getVariations();
    const metrics = adStats.getAdDataset(environment, segment);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flexGrow: 1, marginRight: "3rem" }}>
                <Table>
                    <thead className="text-primary">
                        <tr>
                            <th>Metric</th>
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
                                <td>{metrics.sessions[variation]}</td>
                            ))}
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="ad-impressions-info-icon"
                                text="Ad Impressions"
                                tooltip="Number of times an ad was shown"
                            />
                            <MetricRow
                                metricName="adImpressions"
                                metrics={metrics}
                                variations={variations}
                            />
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="ad-click-info-icon"
                                text="Ad Clicks"
                                tooltip="Number of times an ad was clicked"
                            />
                            <MetricRow
                                metricName="adClicks"
                                metrics={metrics}
                                variations={variations}
                            />
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="converted-sessions-info-icon"
                                text="Converted Sessions %"
                                tooltip="% of sessions that clicked at least one ad"
                            />
                            <MetricRow
                                metricName="conversions"
                                metrics={metrics}
                                variations={variations}
                                useFraction={true}
                            />
                        </tr>
                    </tbody>
                </Table>
            </div>
            {
                <div style={{ width: "30rem" }}>
                    <Bar
                        data={{
                            datasets: [
                                {
                                    label: "% Converted Sessions",
                                    data: variations.map((variation) =>
                                        (
                                            getValueFromObject(metrics, [
                                                "normalized",
                                                "conversions",
                                                variation,
                                            ]) * 100
                                        ).toFixed(2),
                                    ),
                                    backgroundColor: variationColors,
                                    barPercentage: 0.3,
                                },
                            ],
                            labels: variations,
                        }}
                        options={graphOptions}
                    />
                </div>
            }
        </div>
    );
};

const MetricRow = (props) => {
    const { metricName, metrics, variations, useFraction = false } = props;
    return variations.map((variation) => {
        const value = useFraction
            ? (
                  getValueFromObject(
                      metrics,
                      ["normalized", metricName, variation],
                      0,
                  ) * 100
              ).toFixed(2)
            : Math.round(
                  getValueFromObject(metrics, [metricName, variation], 0),
              );

        let diff = getValueFromObject(
            metrics,
            ["diff", metricName, variation],
            0,
        );
        if (!isFinite(diff)) {
            diff = 0;
        }
        const absoluteDiff = Math.abs(diff);

        return (
            <td>
                {`${value}${useFraction ? "%" : ""}`}
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
                    labelString: "% Converted Sessions",
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

export default AdResults;
