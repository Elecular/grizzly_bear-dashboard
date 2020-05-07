import { assignKeyToObject, getValueFromObject } from "utils/objectUtils";

/**
 * A metric is the amount of times a user action has happened.
 * For example, adImpression is the amount of times an ad was shown.
 * metricName: This is just a label for the metric
 * metricId: When getting metrics data from backend, each metric has a metricId. This is the mapping between the metrics and their metric id
 * dimension: When a metric is retrieved from the backend, they come with the following dimensions
 *      amount:
 *          Total number of times the user action has happened.
 *      count:
 *          Number of times the user action happened at least once in a session.
 *          (This is basically deduplication of multiple user actions within the same session)
 *          For example, if an ad impression happened twice in one session, it will be counted as one
 */
const metricDefintions = [
    {
        //Total number of ad impressions
        name: "adImpressions",
        id: "ads/impression",
        dimension: "amount",
    },
    {
        //Total number of clicks
        name: "adClicks",
        id: "ads/click",
        dimension: "amount",
    },
    {
        //Number of sessions that clicked an ad atleast once
        name: "conversions",
        id: "ads/click",
        dimension: "count",
    },
];

/**
 * This is a mixin for ExperimentStats
 */
const adStatsMixin = {
    /**
     * Gets all ad related metrics
     */
    getAdMetrics(environment, segment) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();

        let adMetrics = {};
        for (const variation of variations) {
            //Getting and storing the session stats for each variation
            const sessions = getValueFromObject(
                metrics,
                ["sessions", variation],
                0,
            );
            assignKeyToObject(adMetrics, ["sessions", variation], sessions);
            //Getting and storing all ad metrics for each variation
            for (const metricDef of metricDefintions) {
                const metricValue = getValueFromObject(
                    metrics,
                    [metricDef.id, variation, metricDef.dimension],
                    0,
                );
                assignKeyToObject(
                    adMetrics,
                    [metricDef.name, variation],
                    metricValue,
                );
                assignKeyToObject(
                    adMetrics,
                    ["fraction", metricDef.name, variation],
                    metricValue / sessions,
                );
            }
        }

        adMetrics.diff = this._getAdMetricsDiffFromControlGroup(adMetrics);
        return adMetrics;
    },

    _getAdMetricsDiffFromControlGroup(adMetrics) {
        const variations = this.getVariations();
        const controlGroup = this.getControlGroup();
        let diff = {};

        for (const metricDef of metricDefintions) {
            const baseMetric = getValueFromObject(
                adMetrics,
                ["fraction", metricDef.name, controlGroup],
                0,
            );
            for (const variation of variations) {
                const metricValue = getValueFromObject(
                    adMetrics,
                    ["fraction", metricDef.name, variation],
                    0,
                );
                assignKeyToObject(
                    diff,
                    [metricDef.name, variation],
                    (metricValue - baseMetric) / baseMetric,
                );
            }
        }
        return diff;
    },

    getPlacementMetrics(environment, segment) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();
        const placementIds = this._getPlacementIds(environment, segment);

        let placementMetrics = {};

        for (const placementId of placementIds) {
            for (const variation of variations) {
                //Getting and storing the session metric for each placement id and variation
                const sessions = getValueFromObject(
                    metrics,
                    ["sessions", variation],
                    0,
                );
                assignKeyToObject(
                    placementMetrics,
                    [placementId, "sessions", variation],
                    sessions,
                );
                //Getting and storing all ad metrics for each placement id and variation
                for (const metricDef of metricDefintions) {
                    const metricValue = getValueFromObject(
                        metrics,
                        [
                            this._getMetricIdFromPlacementId(
                                placementId,
                                metricDef,
                            ),
                            variation,
                            metricDef.dimension,
                        ],
                        0,
                    );
                    assignKeyToObject(
                        placementMetrics,
                        [placementId, metricDef.name, variation],
                        metricValue,
                    );
                    assignKeyToObject(
                        placementMetrics,
                        [placementId, "fraction", metricDef.name, variation],
                        metricValue / sessions,
                    );
                }
            }
            placementMetrics[placementId][
                "diff"
            ] = this._getAdMetricsDiffFromControlGroup(
                placementMetrics[placementId],
            );
        }
        return placementMetrics;
    },

    _getPlacementMetricsDiffFromControlGroup(placementMetrics) {
        let diff = {};

        for (const placementId of Object.keys(placementMetrics)) {
            diff[placementId] = this._getAdMetricsDiffFromControlGroup(
                placementMetrics[placementId],
            );
        }
        return diff;
    },

    _getPlacementIds(environment, segment) {
        let metrics = this.getMetrics(environment, segment);
        return Object.keys(metrics)
            .map((metricId) => {
                if (this._isPlacementId(metricId)) {
                    return this._getPlacementId(metricId);
                }
            })
            .filter((placementId) => placementId !== undefined);
    },

    _isPlacementId(metricId) {
        return metricId.match(new RegExp("ads/(click|impression)/.+"));
    },

    _getPlacementId(metricId) {
        return metricId.replace(new RegExp("ads/(click|impression)/"), "");
    },

    _getMetricIdFromPlacementId(placementId, metricDef) {
        return `${metricDef.id}/${placementId}`;
    },
};

export default adStatsMixin;
