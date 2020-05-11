import React from "react";
import { Table, Label } from "reactstrap";
import Select from "react-select";
import { variationColors, positiveColor, negativeColor } from "utils/constants";
import ToolTipTableCell from "../ToolTipTableCell";
import ProductBreakDownGraph from "./ProductBreakdownGraph";

/**
 * These are the different metrics the users can see
 */
const metricOptions = [
    {
        value: "revenue",
        label: "Revenue",
        graphLabel: "Revenue ($)",
        decimalPoints: 2,
        prefix: "$",
    },
    {
        value: "conversions",
        label: "Converted Sessions %",
        graphLabel: "Converted Sessions %",
        normalized: true,
        decimalPoints: 2,
        suffix: "%",
    },
];

const ProductBreakDown = (props) => {
    const { stats, environment, segment } = props;
    const [metricOption, setMetricOption] = React.useState(metricOptions[1]);

    const variations = stats.getVariations();
    const metrics = stats.getMetrics(environment, segment);
    const productIds = stats.getProductIds(environment, segment);

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
            <div style={{ display: "flex", marginTop: "1.5rem" }}>
                <div style={{ flexGrow: 1, marginRight: "3rem" }}>
                    <Table>
                        <thead className="text-primary">
                            <tr>
                                <th>Product Id</th>
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
                                    id="product-sessions-info-icon"
                                    text="Sessions"
                                    tooltip="Number of sessions"
                                />
                                {variations.map((variation) => (
                                    <td key={variation}>
                                        {Math.round(
                                            metrics.get("sessions", variation),
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {productIds.map((productId) => (
                                <tr key={productId}>
                                    <td>{`${productId}`}</td>
                                    <MetricRow
                                        productId={productId}
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
                    <ProductBreakDownGraph
                        metricOption={metricOption}
                        stats={stats}
                        environment={environment}
                        segment={segment}
                    />
                </div>
            </div>
        </div>
    );
};

const MetricRow = (props) => {
    const { productId, metricOption, stats, environment, segment } = props;

    const variations = stats.getVariations();
    const productDataset = stats.getProductDataset(environment, segment);

    return variations.map((variation) => {
        //Calculating metric value
        let value = productDataset.get(
            productId,
            metricOption.value,
            variation,
            metricOption.normalized,
        );
        if (metricOption.normalized) {
            value = value * 100;
        }
        value = value.toFixed(metricOption.decimalPoints);

        //Calculating diff from control group
        let diff = productDataset.getDiff(
            productId,
            metricOption.value,
            variation,
        );
        const absoluteDiff = Math.abs(diff);

        const color = diff > 0 ? positiveColor : negativeColor;

        return (
            <td key={variation}>
                {`${metricOption.prefix || ""}${value}${
                    metricOption.suffix || ""
                }`}
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

export default ProductBreakDown;
