import React from "react";
import { Table } from "reactstrap";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";

const CustomEventResults = (props) => {
    const { stats, environment, segment } = props;

    const variations = stats.getVariations();
    const metrics = stats.getMetrics(environment, segment);
    const customEventIds = stats.getCustomEventIds(environment, segment);

    return (
        <div>
            <Table>
                <thead className="text-primary">
                    <tr>
                        <th>Custom Event Id</th>
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
                            id="custom-event-sessions-info-icon"
                            text="Sessions"
                            tooltip="Number of sessions"
                        />
                        {variations.map((variation) => (
                            <td key={variation}>
                                {Math.round(metrics.get("sessions", variation))}
                            </td>
                        ))}
                    </tr>
                    {customEventIds.map((customEventId) => (
                        <tr key={customEventId}>
                            <td>{`${customEventId}`}</td>
                            <MetricRow
                                customEventId={customEventId}
                                stats={stats}
                                environment={environment}
                                segment={segment}
                            />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

const MetricRow = (props) => {
    const { customEventId, stats, environment, segment } = props;

    const variations = stats.getVariations();
    const customEventDataset = stats.getCustomEventDataset(
        environment,
        segment,
    );

    return variations.map((variation) => {
        //Calculating metric value
        let value = customEventDataset.get(customEventId, variation).toFixed(2);

        //Calculating diff from control group
        let diff = customEventDataset.getDiff(customEventId, variation);
        const absoluteDiff = Math.abs(diff);
        const color = diff > 0 ? positiveColor : negativeColor;

        return (
            <td key={variation}>
                {`${value}`}
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

export default CustomEventResults;
