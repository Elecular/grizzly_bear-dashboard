import React from "react";
import { Table } from "reactstrap";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";
import TransactionResultsGraph from "./ResultsGraph";

const TranslactionResults = (props) => {
    const { stats, environment, segment } = props;
    return (
        <div style={{ display: "flex" }}>
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
                                id="transactions-summary-sessions-info-icon"
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
                                id="transaction-conversions-info-icon"
                                text="Converted Sessions %"
                                tooltip="% of sessions that made at least one transaction"
                            />
                            <MetricRow
                                metricName="conversions"
                                stats={stats}
                                environment={environment}
                                segment={segment}
                                normalized={true}
                                decimalPoints={2}
                                suffix="%"
                            />
                        </tr>
                        <tr>
                            <ToolTipTableCell
                                id="revenue-info-icon"
                                text="Revenue"
                                tooltip="Total revenue made from transactions"
                            />
                            <MetricRow
                                metricName="revenue"
                                stats={stats}
                                environment={environment}
                                segment={segment}
                                decimalPoints={2}
                                prefix="$"
                            />
                        </tr>
                    </tbody>
                </Table>
            </div>
            {
                <div style={{ width: "30rem" }}>
                    <TransactionResultsGraph
                        stats={stats}
                        environment={environment}
                        segment={segment}
                    />
                </div>
            }
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
        decimalPoints = 0,
        suffix = "",
        prefix = "",
    } = props;
    const dataset = stats.getTransactionDataset(environment, segment);
    const variations = stats.getVariations();

    return variations.map((variation) => {
        //Calculating metric value
        let value = dataset.get(metricName, variation, normalized);
        if (normalized) {
            value = value * 100;
        }
        value = value.toFixed(decimalPoints);

        //Calculating diff from control group
        let diff = dataset.getDiff(metricName, variation);
        const absoluteDiff = Math.abs(diff);

        const color = diff > 0 ? positiveColor : negativeColor;

        return (
            <td key={variation}>
                {`${prefix}${value}${suffix}`}
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

export default TranslactionResults;
