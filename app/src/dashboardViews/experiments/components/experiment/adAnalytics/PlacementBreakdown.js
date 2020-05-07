import React from "react";
import { Table, Label } from "reactstrap";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import { getValueFromObject } from "utils/objectUtils";
import { variationColors } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";

const metricOptions = [
    { value: "adImpressions", label: "Ad Impressions", suffix: "" },
    { value: "adClicks", label: "Ad Clicks", suffix: "" },
    {
        value: "convertedSessionsPercentage",
        label: "Converted Sessions %",
        suffix: "%",
    },
];

const PlacementBreakDown = (props) => {
    const { stats, environment, segment } = props;

    const [metricOption, setMetricOption] = React.useState(metricOptions[2]);
    const variations = stats.getVariations();
    const metrics = stats.getAdMetrics(environment, segment);

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
                                {variations.map((variation) => (
                                    <th className="text-right">{`${variation}`}</th>
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
                                        {Math.round(
                                            metrics["sessions"][variation],
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {Object.keys(metrics.placementBreakDown).map(
                                (placementId) => (
                                    <tr>
                                        <td>{`${placementId}`}</td>
                                        {variations.map((variation) => (
                                            <td className="text-right">
                                                {`${Math.round(
                                                    getValueFromObject(
                                                        metrics,
                                                        [
                                                            "placementBreakDown",
                                                            placementId,
                                                            metricOption.value,
                                                            variation,
                                                        ],
                                                        0,
                                                    ),
                                                )}${metricOption.suffix}`}
                                            </td>
                                        ))}
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </Table>
                </div>
                <div style={{ width: "30rem" }}>
                    <Bar
                        data={{
                            datasets: Object.keys(
                                metrics.placementBreakDown,
                            ).map((placementId) => ({
                                label: placementId,
                                data: variations.map((variation) =>
                                    Math.round(
                                        getValueFromObject(
                                            metrics,
                                            [
                                                "placementBreakDown",
                                                placementId,
                                                metricOption.value,
                                                variation,
                                            ],
                                            0,
                                        ),
                                    ),
                                ),
                                borderColor: variationColors,
                                borderWidth: 1,
                                barPercentage: 1,
                                categoryPercentage: 0.5,
                                backgroundColor: variations.map(
                                    (_) => "rgba(0, 0, 0, 0)",
                                ),
                            })),
                            labels: variations,
                        }}
                        options={graphOptions}
                    />
                </div>
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

export default PlacementBreakDown;
