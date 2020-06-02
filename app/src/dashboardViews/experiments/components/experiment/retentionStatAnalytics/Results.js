import React from "react";
import { Table } from "reactstrap";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";

const RetentionStatsResults = (props) => {
    const { stats, environment, segment } = props;

    const variations = stats.getVariations();
    const metrics = stats.getMetrics(environment, segment);
    const retentionStatIds = stats.getRetentionStatIds(environment, segment);
    return (
        <div>
            <Table>
                <thead className="text-primary">
                    <tr>
                        <th>Retention</th>
                        {variations.map((variation, index) => (
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
                            id="retention-sessions-info-icon"
                            text="Sessions"
                            tooltip="Number of sessions"
                        />
                        {variations.map((variation) => (
                            <td key={variation}>
                                {Math.round(metrics.get("sessions", variation))}
                            </td>
                        ))}
                    </tr>
                    {retentionStatIds.map((retentionStatId) => {
                        var retentionDay = Number.parseInt(retentionStatId.replace("Day ", ""));
                        return (
                            <tr key={retentionStatId}>
                                <ToolTipTableCell
                                    id={`retention-day-${retentionDay}-info-icon`}
                                    text={retentionStatId}
                                    tooltip={`% of sessions that started ${retentionDay} day${retentionDay == 1 ? "" : "s"} after the game was installed`}
                                />
                                <MetricRow
                                    retentionStatId={retentionStatId}
                                    stats={stats}
                                    environment={environment}
                                    segment={segment}
                                />
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
};

const MetricRow = (props) => {
    const { retentionStatId, stats, environment, segment } = props;

    const variations = stats.getVariations();
    const retentionStatDataset = stats.getRetentionStatDataset(
        environment,
        segment,
    );
        
    return variations.map((variation) => {
        //Calculating metric value
        let value = (retentionStatDataset.get(retentionStatId, variation, true)*100).toFixed(2);
        //Calculating diff from control group
        let diff = retentionStatDataset.getDiff(retentionStatId, variation);
        const absoluteDiff = Math.abs(diff);
        const color = diff > 0 ? positiveColor : negativeColor;

        return (
            <td key={variation}>
                {`${value}%`}
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

export default RetentionStatsResults;
