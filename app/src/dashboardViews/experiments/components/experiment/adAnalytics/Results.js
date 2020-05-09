import React from "react";
import { Table } from "reactstrap";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";
import ResultsGraph from "./ResultsGraph";

const AdResults = (props) => {
    const { stats, environment, segment } = props;
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flexGrow: 1, marginRight: "3rem" }}>
                <Table>
                    <thead className="text-primary">
                        <tr>
                            <th>Metric</th>
                            {stats.getVariations().map((variation, index) => (
                                <th key={variation}>
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
                            <MetricRow
                                metricName="sessions"
                                stats={stats}
                                environment={environment}
                                segment={segment}
                            />
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="ad-impressions-info-icon"
                                text="Ad Impressions"
                                tooltip="Number of times an ad was shown"
                            />
                            <MetricRow
                                metricName="adImpressions"
                                stats={stats}
                                environment={environment}
                                segment={segment}
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
                                stats={stats}
                                environment={environment}
                                segment={segment}
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
                                stats={stats}
                                environment={environment}
                                segment={segment}
                                normalized={true}
                            />
                        </tr>
                    </tbody>
                </Table>
            </div>
            {
                <div style={{ width: "30rem" }}>
                    <ResultsGraph
                        stats={stats}
                        environment={environment}
                        segment={segment}
                    />
                </div>
            }
        </div>
    );
};

const MetricRow = (props) => {
    const {
        stats,
        environment,
        segment,
        metricName,
        normalized = false,
    } = props;
    const dataset = stats.getAdDataset(environment, segment);
    const variations = stats.getVariations();

    return variations.map((variation) => {
        //Calculating metric value
        let value = dataset.get(metricName, variation, normalized);
        if (normalized) {
            value = (value * 100).toFixed(2);
        } else {
            value = Math.round(value);
        }

        //Calculating diff from control group
        let diff = dataset.getDiff(metricName, variation);
        const absoluteDiff = Math.abs(diff);

        const color = diff > 0 ? positiveColor : negativeColor;

        return (
            <td key={variation}>
                {`${value}${normalized ? "%" : ""}`}
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

export default AdResults;
