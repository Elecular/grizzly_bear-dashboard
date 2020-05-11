import { getValueFromObject } from "utils/objectUtils";
import ExperimentStats from "./ExperimentStats";

/**
 * Please look at typedef Metric  and DatasetDefinition in models/ExperimentStats before look into this
 *
 * This definition is used for creating a TransactionDataset. You can look at the typedef below
 * The following is basically definiing how to calculdate an transaction dataset based on the list of metrics
 * name: Name of the transaction metric
 * id: The metric id it corresponds to
 * dimension: The dimension of the metric that should be used for calculating the transaction metric
 */
const transactionDatasetDefinition = [
    {
        /**
         * This is the total revenue made
         * We use amount because we want to get the total
         */
        name: "revenue",
        id: "transactions/complete",
        dimension: "amount",
    },
    {
        /**
         * This is the amount of sessions that made at least one transaction.
         * We use count because we do not want to have duplicate transactions within one session
         */
        name: "conversions",
        id: "transactions/complete",
        dimension: "count",
    },
];

/**
 * A transaction metric is derived from metric. It represents the amount of user action occured per variation.
 * An example TransactionMetric. This example means that the metric happened 10 times in variation1 and 14 times in variation2
{
    variation1: 10,
    variatio2: 14
}

@typedef {
    Object.<string, number>
} TransactionMetric
 */

/**
 * An TransactionDataset describes the revenue and conversions from micro transactions
 * 
 * normalized has metrics that are normalized to the number of sessions. 
 * For example, if sessions is 10 and conversions is 4, then normalized.conversions is 0.4
 * 
 * diff has metrics that represent the difference from the control group.
 * This is used for showing if a variation is performing better or worse than the control group. 
 * 
 @typedef {{
    sessions: TransactionMetric,
    revenue: TransactionMetric
    conversions: TransactionMetric,
    normalized: {
        revenue: TransactionMetric,
        conversions: TransactionMetric
    },
    diff: {
        revenue: TransactionMetric,
        conversions: TransactionMetric
    }
 }} TransactionDataset
 */

class TransactionStats extends ExperimentStats {
    /**
     * Instantiates TransactionStats from given experimentStats
     * @param {ExperimentStats} experimentStats
     * @returns {TransactionStats}
     */
    static Instantiate(experimentStats) {
        return new TransactionStats(
            experimentStats.info,
            Object.values(experimentStats.stats),
        );
    }

    /**
     * Gets aggregated transaction dataset
     * @returns {{
        data: TransactionDataset,
        get: (transactionMetricName: string, variation: string, normalized: boolean) => number,
        getDiff: (transactionMetricName: string, variation: string)
    }}
     */
    getTransactionDataset(environment, segment) {
        let transactionDataset = this.getDataset(
            environment,
            segment,
            transactionDatasetDefinition,
        );
        return {
            data: transactionDataset,
            //Helper method for extracting transaction metrics
            get: function (
                transactionMetricName,
                variation,
                normalized = false,
            ) {
                return getValueFromObject(
                    this.data,
                    [
                        ...(normalized ? ["normalized"] : []),
                        ...[transactionMetricName, variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (transactionMetricName, variation) {
                return getValueFromObject(
                    this.data,
                    ["diff", transactionMetricName, variation],
                    0,
                );
            },
        };
    }

    /**
     * Gets transaction dataset for each product
     * @returns {{
        data: Object.<string, AdDataset>,
        get: (productId, metricName: string, variation: string, normalized: boolean) => number,
        getDiff: (productId, metricName: string, variation: string)
    }}
    */
    getProductDataset(environment, segment) {
        const productIds = this.getProductIds(environment, segment);
        let productDataset = {};

        for (const productId of productIds) {
            const productDatasetDefinition = transactionDatasetDefinition.map(
                (metricDef) => ({
                    name: metricDef.name,
                    id: this._productToMetricId(productId, metricDef),
                    dimension: metricDef.dimension,
                }),
            );
            productDataset[productId] = this.getDataset(
                environment,
                segment,
                productDatasetDefinition,
            );
        }

        return {
            data: productDataset,
            //Helper method for extracting transaction metrics
            get: function (
                productId,
                metricName,
                variation,
                normalized = false,
            ) {
                return getValueFromObject(
                    this.data,
                    [
                        productId,
                        ...(normalized ? ["normalized"] : []),
                        ...[metricName, variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (productId, metricName, variation) {
                return getValueFromObject(
                    this.data,
                    [productId, "diff", metricName, variation],
                    0,
                );
            },
        };
    }

    /**
     * Gets all product ids from given environment and segment
     * @param {String} environment
     * @param {String} segment
     * @returns {Array<String>}
     */
    getProductIds(environment, segment) {
        let metrics = this.getMetrics(environment, segment);
        return [
            ...new Set(
                Object.keys(metrics.data)
                    .map((metricId) => {
                        if (this._isProductId(metricId)) {
                            return this._getProductId(metricId);
                        }
                    })
                    .filter((productId) => productId !== undefined),
            ),
        ].sort();
    }

    _isProductId(metricId) {
        return metricId.match(new RegExp("transactions/complete/.+"));
    }

    _getProductId(metricId) {
        return metricId.replace(new RegExp("transactions/complete/"), "");
    }

    _productToMetricId(productId, metricDef) {
        return `${metricDef.id}/${productId}`;
    }
}

export default TransactionStats;
