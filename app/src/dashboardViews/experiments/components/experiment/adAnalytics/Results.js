import React from "react";
import { Table } from "reactstrap";
import { variationColors } from "utils/constants";
import { Bar } from "react-chartjs-2";
import ToolTipTableCell from "../ToolTipTableCell";

const AdResults = (props) => {
    const { stats, environment, segment } = props;

    const variations = stats.getVariations();
    const metrics = stats.getAdMetrics(environment, segment);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flexGrow: 1, marginRight: "3rem" }}>
                <Table>
                    <thead className="text-primary">
                        <tr>
                            <th>Metric</th>
                            {variations.map((variation) => (
                                <th className="text-right">{variation}</th>
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
                                <td className="text-right">
                                    {metrics.sessions[variation]}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="ad-impressions-info-icon"
                                text="Ad Impressions"
                                tooltip="Number of times an ad was shown"
                            />
                            {variations.map((variation) => (
                                <td className="text-right">
                                    {metrics.adImpressions[variation]}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="ad-click-info-icon"
                                text="Ad Clicks"
                                tooltip="Number of times an ad was clicked"
                            />
                            {variations.map((variation) => (
                                <td className="text-right">
                                    {Math.round(metrics.adClicks[variation])}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="converted-sessions-info-icon"
                                text="Converted Sessions %"
                                tooltip="% of sessions that clicked at least one ad"
                            />
                            {variations.map((variation) => {
                                return (
                                    <td className="text-right">{`${metrics.convertedSessionsPercentage[variation]}%`}</td>
                                );
                            })}
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div style={{ width: "30rem" }}>
                <Bar
                    data={{
                        datasets: [
                            {
                                label: "% Converted Sessions",
                                data: variations.map(
                                    (variation) =>
                                        metrics.convertedSessionsPercentage[
                                            variation
                                        ],
                                ),
                                backgroundColor: variations.map(
                                    (_) => "rgba(0, 0, 0, 0)",
                                ),
                                borderColor: variationColors,
                                borderWidth: 3,
                                barPercentage: 0.3,
                            },
                        ],
                        labels: variations,
                    }}
                    options={graphOptions}
                />
            </div>
        </div>
    );
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
