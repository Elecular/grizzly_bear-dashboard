import { getValueFromObject } from "utils/objectUtils";
import ExperimentStats from "./ExperimentStats";

/**
 * Please look at typedef Metric  and DatasetDefinition in models/ExperimentStats before look into this
 *
 * This definition is used for creating an AdDataset. You can look at the typedef below
 * The following is basically definiing how to calculdate an ad dataset based on the list of metrics
 * name: Name of the ad metric
 * id: The metric id it corresponds to
 * dimension: The dimension of the metric that should be used for calculating the ad metric
 */
const adDatasetDefinition = [
    {
        /**
         * This is the total amount of ad impressions
         * We use amount because we want to get the total
         */
        name: "adImpressions",
        id: "ads/impression",
        dimension: "amount",
    },
    {
        /**
         * This is the total amount of ad clicks
         * We use amoutn because we want to get the total
         */
        name: "adClicks",
        id: "ads/click",
        dimension: "amount",
    },
    {
        /**
         * This is how many sessions clicked at least one ad.
         * We use count because we do not want to have duplicate ad clicks within one session
         */
        name: "conversions",
        id: "ads/click",
        dimension: "count",
    },
];

/**
 * An ad metric is derived from metric. It represents the amount of user action occured per variation.
 * An example AdMetric. This example means that the metric happened 10 times in variation1 and 14 times in variation2
{
    variation1: 10,
    variatio2: 14
}

@typedef {
    Object.<string, number>
} AdMetric
 */

/**
 * An AdDataset describes Ad performance over multiple variations.
 * 
 * normalized has metrics that are normalized to the number of sessions. 
 * For example, if sessions is 10 and adClicks is 4, then normalized.adClicks is 0.4
 * 
 * diff has metrics thatrepresent the difference from the control group.
 * This is used for showing if a variation is performing better or worse than the control group. 
 * 
 @typedef {{
    sessions: AdMetric,
    adClicks: AdMetric,
    adImpressions: AdMetric,
    conversions: AdMetric,
    normalized: {
        adClicks: AdMetric,
        adImpressions: AdMetric,
        conversions: AdMetric
    },
    diff: {
        adClicks: AdMetric,
        adImpressions: AdMetric,
        conversions: AdMetric
    }
 }} AdDataset
 */

/**
 * Placement Dataset are derived from metrics.
 *
 * Ad placements metrics are stored under the following metric ids
 * ads/impression/<placementId>
 *      This is the number of impressions this placement had
 * ads/click/<placementId>
 *      This is the number of clicks this placement had
 */

/**
 * This class is used for getting ad stats for experiments
 */
class AdStats extends ExperimentStats {
    constructor(info, stats) {
        super(info, stats);
    }

    /**
     * Instantiates AdStats from given experimentStats
     * @param {ExperimentStats} experimentStats
     * @returns {AdStats}
     */
    static Instantiate(experimentStats) {
        return new AdStats(
            experimentStats.info,
            Object.values(experimentStats.stats),
        );
    }

    /**
     * Gets aggregated ads data
     * @returns {{
        data: AdDataset,
        get: (adMetricName: string, variation: string, normalized: boolean) => number,
        getDiff: (adMetricName: string, variation: string) => number
    }}
     */
    getAdDataset(environment, segment) {
        let adMetrics = this.getDataset(
            environment,
            segment,
            adDatasetDefinition,
        );
        return {
            data: adMetrics,
            //Helper method for extracting ad metrics
            get: function (adMetricName, variation, normalized = false) {
                return getValueFromObject(
                    this.data,
                    [
                        ...(normalized ? ["normalized"] : []),
                        ...[adMetricName, variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (adMetricName, variation) {
                return getValueFromObject(
                    this.data,
                    ["diff", adMetricName, variation],
                    0,
                );
            },
        };
    }

    /**
     * Gets ads dataset for individual placements
     * @param {string} environment
     * @param {string} segment
     * @returns {{
        data: Object.<string, AdDataset>,
        get: (placementId: String, adMetricName: String, variation: Name, normalized: boolean) => number,
        getDiff: (placementId: String, adMetricName: String, variation: Name) => number,
    }}
     */
    getPlacementDataset(environment, segment) {
        const placementIds = this.getPlacementIds(environment, segment);
        let placementDataset = {};

        for (const placementId of placementIds) {
            const placementDatasetDefinition = adDatasetDefinition.map(
                (metricDef) => ({
                    name: metricDef.name,
                    id: this._placementToMetricId(placementId, metricDef),
                    dimension: metricDef.dimension,
                }),
            );
            placementDataset[placementId] = this.getDataset(
                environment,
                segment,
                placementDatasetDefinition,
            );
        }

        return {
            data: placementDataset,
            //Helper method for extracting ad metrics
            get: function (
                placementId,
                adMetricName,
                variation,
                normalized = false,
            ) {
                return getValueFromObject(
                    this.data,
                    [
                        placementId,
                        ...(normalized ? ["normalized"] : []),
                        ...[adMetricName, variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (placementId, adMetricName, variation) {
                return getValueFromObject(
                    this.data,
                    [placementId, "diff", adMetricName, variation],
                    0,
                );
            },
        };
    }

    /**
     * Gets all placement ids from given environment and segment
     * @param {String} environment
     * @param {String} segment
     * @returns {Array<String>}
     */
    getPlacementIds(environment, segment) {
        let metrics = this.getMetrics(environment, segment);
        return [
            ...new Set(
                Object.keys(metrics.data)
                    .map((metricId) => {
                        if (this._isPlacementId(metricId)) {
                            return this._getPlacementId(metricId);
                        }
                    })
                    .filter((placementId) => placementId !== undefined),
            ),
        ].sort();
    }

    _isPlacementId(metricId) {
        return metricId.match(new RegExp("ads/(click|impression)/.+"));
    }

    _getPlacementId(metricId) {
        return metricId.replace(new RegExp("ads/(click|impression)/"), "");
    }

    _placementToMetricId(placementId, metricDef) {
        return `${metricDef.id}/${placementId}`;
    }
}

export default AdStats;
