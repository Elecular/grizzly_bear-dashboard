import { assignKeyToObject, getValueFromObject } from "utils/objectUtils";
import ExperimentStats, { sessionsMetricId } from "./ExperimentStats";

/**
 * Please look at typedef Metric in models/ExperimentStats before look into this
 *
 * An ad metric is derived from metric. These ad metrics definitions are used for creating an AdDataset. You can look at the typedef below
 * The following is basically definiing how to calculdate an ad metric based on a metric.
 * name: Name of the ad metric
 * id: The metric id it corresponds to
 * dimension: The dimension of the metric that should be used for calculating the ad metric
 */
const adMetricDefinitions = [
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
 * Placement Metrics are derived from metrics.
 * Please look at typedef Metric in models/ExperimentStats before look into this
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
        getDiff: (adMetricName: string, variation: string)
    }}
     */
    getAdDataset(environment, segment) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();

        let adMetrics = {};
        for (const variation of variations) {
            const sessions = metrics.get(sessionsMetricId, variation);
            assignKeyToObject(
                adMetrics,
                [sessionsMetricId, variation],
                sessions,
            );
            //Getting and storing all ad metrics for each variation
            for (const metricDef of adMetricDefinitions) {
                const metricValue = metrics.get(
                    metricDef.id,
                    variation,
                    metricDef.dimension,
                );
                assignKeyToObject(
                    adMetrics,
                    [metricDef.name, variation],
                    metricValue,
                );
                assignKeyToObject(
                    adMetrics,
                    ["normalized", metricDef.name, variation],
                    sessions === 0 ? 0 : metricValue / sessions,
                );
            }
        }

        adMetrics.diff = this._getAdMetricsDiff(adMetrics);
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
     * Gets ads data for individual placements
     * @param {string} environment
     * @param {string} segment
     * @returns {Object.<string, AdDataset>}
     */
    getPlacementDataset(environment, segment) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();
        const placementIds = this.getPlacementIds(environment, segment);

        let placementMetrics = {};

        for (const placementId of placementIds) {
            for (const variation of variations) {
                //Getting and storing the session metric for each placement id and variation
                const sessions = metrics.get(sessionsMetricId, variation);
                assignKeyToObject(
                    placementMetrics,
                    [placementId, sessionsMetricId, variation],
                    sessions,
                );
                //Getting and storing all ad metrics for each placement id and variation
                for (const metricDef of adMetricDefinitions) {
                    const metricId = this._placementToMetricId(
                        placementId,
                        metricDef,
                    );
                    const metricValue = metrics.get(
                        metricId,
                        variation,
                        metricDef.dimension,
                    );
                    assignKeyToObject(
                        placementMetrics,
                        [placementId, metricDef.name, variation],
                        metricValue,
                    );
                    assignKeyToObject(
                        placementMetrics,
                        [placementId, "normalized", metricDef.name, variation],
                        sessions === 0 ? 0 : metricValue / sessions,
                    );
                }
            }
            placementMetrics[placementId]["diff"] = this._getAdMetricsDiff(
                placementMetrics[placementId],
            );
        }
        return {
            data: placementMetrics,
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

    _getAdMetricsDiff(adMetrics) {
        const variations = this.getVariations();
        const controlGroup = this.getControlGroup();
        let diff = {};

        for (const metricDef of adMetricDefinitions) {
            const baseMetric = getValueFromObject(
                adMetrics,
                ["normalized", metricDef.name, controlGroup],
                0,
            );
            for (const variation of variations) {
                const metricValue = getValueFromObject(
                    adMetrics,
                    ["normalized", metricDef.name, variation],
                    0,
                );
                assignKeyToObject(
                    diff,
                    [metricDef.name, variation],
                    baseMetric === 0
                        ? 0
                        : (metricValue - baseMetric) / baseMetric,
                );
            }
        }
        return diff;
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
