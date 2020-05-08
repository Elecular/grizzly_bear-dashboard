import React from "react";
import { Table, Label } from "reactstrap";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import { getValueFromObject } from "utils/objectUtils";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";
import PlacementBreakdownGraph from "./PlacementBreakdownGraph";

/**
 * These are the different metrics the users can see
 */
const metricOptions = [
    {
        value: "adImpressions",
        label: "Ad Impressions",
        graphLabel: "# Ad Impressions Per Sessions",
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
        normalized: true,
    },
];

const PlacementBreakDown = (props) => {
    const { stats, environment, segment } = props;
    const [metricOption, setMetricOption] = React.useState(metricOptions[2]);

    const variations = stats.getVariations();
    const metrics = stats.getMetrics(environment, segment);
    const placementIds = stats.getPlacementIds(environment, segment);
    console.log(placementIds);
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
                                    id="placement-sessions-info-icon"
                                    text="Sessions"
                                    tooltip="Number of sessions"
                                />
                                {variations.map((variation) => (
                                    <td>
                                        {Math.round(
                                            metrics.get("sessions", variation),
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {placementIds.map((placementId) => (
                                <tr>
                                    <td>{`${placementId}`}</td>
                                    <MetricRow
                                        placementId={placementId}
                                        metricOption={metricOption}
                                        stats={stats}
                                        environment={environment}
                                        segment={segment}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div style={{ width: "30rem" }}>
                    {
                        <PlacementBreakdownGraph
                            metricOption={metricOption}
                            stats={stats}
                            environment={environment}
                            segment={segment}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

const MetricRow = (props) => {
    const { placementId, metricOption, stats, environment, segment } = props;

    const variations = stats.getVariations();
    const placementDataset = stats.getPlacementDataset(environment, segment);

    return variations.map((variation) => {
        //Calculating metric value
        let value = placementDataset.get(
            placementId,
            metricOption.value,
            variation,
            metricOption.normalized,
        );
        if (metricOption.normalized) {
            value = (value * 100).toFixed(2);
        } else {
            value = Math.round(value);
        }

        //Calculating diff from control group
        let diff = placementDataset.getDiff(
            placementId,
            metricOption.value,
            variation,
        );
        if (!isFinite(diff)) diff = 0;
        const absoluteDiff = Math.abs(diff);

        const color = diff > 0 ? positiveColor : negativeColor;

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
                                color: color,
                            }}
                            className={`fa fa-arrow-${
                                diff > 0 ? "up" : "down"
                            }`}
                        ></i>
                        <div
                            style={{
                                display: "inline-flex",
                                color: color,
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

export default PlacementBreakDown;
