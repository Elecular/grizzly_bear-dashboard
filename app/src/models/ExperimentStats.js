import { assignKeyToObject, getValueFromObject } from "utils/objectUtils";
import adStatsMixin from "./AdStats";
/**
 * These are the metrics that are needed for the UI to run properly
 */
const essentialMetricIds = ["sessions", "ads/impression", "ads/click"];

class ExperimentStats {
    constructor(info, stats) {
        this.stats = {};
        stats.forEach((stat) => {
            this.stats[stat.environment] = stat;
        });

        this.info = info;
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

    getControlGroup() {
        const controlGroup = this.info.variations.find(
            (variation) => variation.controlGroup,
        );
        if (!controlGroup) {
            throw new Error("Control Group not found. This is a fatal error!");
        }
        return controlGroup.variationName;
    }
}

Object.assign(ExperimentStats.prototype, adStatsMixin);

export default ExperimentStats;
