import { assignKeyToObject, getValueFromObject } from "utils/objectUtils";

/**
 * These are the metrics that are needed for the UI to run properly
 */
const essentialMetricIds = ["sessions", "ads/impression", "ads/click"];

export default class ExperimentStats {
    constructor(info, stats) {
        this.stats = {};
        stats.forEach((stat) => {
            this.stats[stat.environment] = stat;
        });

        this.info = info;
    }

    /**
     * Gets all ad related metrics
     */
    getAdMetrics(environment, segment) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();

        let adMetrics = {};
        for (const variation of variations) {
            const sessions = getValueFromObject(
                metrics,
                ["sessions", variation],
                0,
            );
            const impressions = Math.round(
                getValueFromObject(
                    metrics,
                    ["ads/impression", variation, "amount"],
                    0,
                ),
            );
            const clicks = Math.round(
                getValueFromObject(
                    metrics,
                    ["ads/click", variation, "amount"],
                    0,
                ),
            );
            const conversions = getValueFromObject(
                metrics,
                ["ads/click", variation, "count"],
                0,
            );
            const convertedSessionsPercentage =
                sessions === 0 ? 0 : Math.round((conversions * 100) / sessions);

            assignKeyToObject(adMetrics, ["sessions", variation], sessions);
            assignKeyToObject(
                adMetrics,
                ["adImpressions", variation],
                impressions,
            );
            assignKeyToObject(adMetrics, ["adClicks", variation], clicks);
            assignKeyToObject(
                adMetrics,
                ["convertedSessionsPercentage", variation],
                convertedSessionsPercentage,
            );
        }

        adMetrics.placementBreakDown = this.getPlacementBreakDown(metrics);
        return adMetrics;
    }

    getPlacementBreakDown(metrics) {
        const variations = this.getVariations();

        let placementMetrics = {};
        for (const metricId of Object.keys(metrics)) {
            //If the string matches ads/click/... or ads/impression/...
            if (!metricId.match(new RegExp("ads/(click|impression)/.+")))
                continue;
            const placementId = metricId.replace(
                new RegExp("ads/(click|impression)/"),
                "",
            );
            if (placementMetrics[placementId]) continue;

            for (const variation of variations) {
                const sessions = getValueFromObject(metrics, [
                    "sessions",
                    variation,
                ]);
                const impressions = Math.round(
                    getValueFromObject(
                        metrics,
                        [`ads/impression/${placementId}`, variation, "amount"],
                        0,
                    ),
                );
                const clicks = Math.round(
                    getValueFromObject(
                        metrics,
                        [`ads/click/${placementId}`, variation, "amount"],
                        0,
                    ),
                );
                const conversions = getValueFromObject(
                    metrics,
                    [`ads/click/${placementId}`, variation, "count"],
                    0,
                );
                const convertedSessionsPercentage =
                    sessions === 0
                        ? 0
                        : Math.round((conversions * 100) / sessions);

                assignKeyToObject(
                    placementMetrics,
                    [placementId, "sessions", variation],
                    sessions,
                );
                assignKeyToObject(
                    placementMetrics,
                    [placementId, "adImpressions", variation],
                    impressions,
                );
                assignKeyToObject(
                    placementMetrics,
                    [placementId, "adClicks", variation],
                    clicks,
                );
                assignKeyToObject(
                    placementMetrics,
                    [placementId, "convertedSessionsPercentage", variation],
                    convertedSessionsPercentage,
                );
            }
        }
        return placementMetrics;
    }

    /**
     * Gets all the metrics for the given environment and segment
     */
    getMetrics(environment, segment) {
        if (!this.stats || !this.stats[environment]) return {};
        let result = {};

        const variations = this.getVariations();
        const metricIds = this.getMetricIds();

        for (const variation of variations) {
            for (const metricId of metricIds) {
                assignKeyToObject(
                    result,
                    [metricId, variation],
                    getValueFromObject(
                        this.stats,
                        [
                            environment,
                            "variations",
                            variation,
                            "segments",
                            segment,
                            metricId,
                        ],
                        metricId === "sessions" ? 0 : { count: 0, amount: 0 },
                    ),
                );
            }
        }
        return result;
    }

    /**
     * Gets all segments in given experiment
     */
    getSegments() {
        let segments = new Set();
        if (!this.stats || !this.info) return [...segments];

        const environments = this.getEnvironments();
        const variations = this.getVariations();

        for (const environment of environments) {
            for (const variation of variations) {
                const variationSegments = getValueFromObject(
                    this.stats,
                    [environment, "variations", variation, "segments"],
                    undefined,
                );
                if (variationSegments !== undefined) {
                    segments = new Set([
                        ...segments,
                        ...Object.keys(variationSegments),
                    ]);
                }
            }
        }
        return [...segments];
    }

    /**
     * Gets all the metrics in given experiment
     */
    getMetricIds() {
        let metricIds = new Set();
        if (!this.stats) return [...metricIds, ...essentialMetricIds];

        const environments = this.getEnvironments();
        const variations = this.getVariations();
        const segments = this.getSegments();

        for (const environment of environments) {
            for (const variation of variations) {
                for (const segment of segments) {
                    const metrics = getValueFromObject(
                        this.stats,
                        [
                            environment,
                            "variations",
                            variation,
                            "segments",
                            segment,
                        ],
                        undefined,
                    );
                    if (metrics !== undefined) {
                        metricIds = new Set([
                            ...metricIds,
                            ...Object.keys(metrics),
                        ]);
                    }
                }
            }
        }
        return [...metricIds, ...essentialMetricIds];
    }

    /**
     * Gets all environments in given experiment
     */
    getEnvironments() {
        return this.stats ? Object.keys(this.stats) : [];
    }

    /**
     * Gets all variations in given experiment
     */
    getVariations() {
        return !this.info || !this.info.variations
            ? []
            : this.info.variations.map((variation) => variation.variationName);
    }
}
