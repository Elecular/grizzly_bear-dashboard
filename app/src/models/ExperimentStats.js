import { assignKeyToObject, getValueFromObject } from "utils/objectUtils";

/**
 * A metric is the amount of times a user action has happened. It is broken down into variations. 
 * For example, adImpressions is the amount of times an ad was shown.
 * A metric has the following sub dimensions
 *      amount:
 *          Total number of times the user action has happened.
 *      count:
 *          In how many sessions did this user action happened
 *          (This is basically deduplication of multiple user actions within the same session)
 *          For example, if an ad impression happened twice in one session, it will be counted as one
 * 
 * Note that sessions is also a metric. a session is just a number without any sub dimesions (Hence in the typedef of a metric, a metric could also be a number)
 * 
This is an example metric. This means that in variation 1, the metric happened 7 times in total and occured in 4 different sessions
{
    variation1: {
        count: 4,
        amount: 7
    },
    variation2: {
        count: 2,
        amount: 9
    }
}

This is an example sessions metric. This means that 10 sessions happened in variation1 and 12 happened in variation2
{
    variation1: 10,
    variation2: 12
}
*/

/**
 * @typedef {
    Object.<string, ({
        count: number,
        amount: number
    }|number)>
} Metric
 */

/**
 * Please look at typedef Metric in models/ExperimentStats before look into this
 *
 * A dataset is a collection of metrics
 * The following is basically definiing how to calculate a dataset based on list of metrics.
 * name: Name of the  metric
 * id: The metric id it corresponds to
 * dimension: The dimension of the metric that should be used for calculating the metric
 * @typedef {Array<{
       name: String,
       id: String,
       dimension: String
 }>} DatasetDefinition
 */

/**
 * @typedef {import("../api/experiments").Experiment} Experiment
 */

/**
 * @typedef {import("../api/experimentStats").UserActivityStats} UserActivityStats
 */

/**
 * Metric id for sessions.
 */
export const sessionsMetricId = "sessions";

/**
 * These are the metrics that are needed for the UI to run properly
 */
const essentialMetricIds = [sessionsMetricId, "ads/impression", "ads/click"];

/**
 * This class is used for storing experiment stats
 * It has many useful methods to extracts stats.
 *
 * NOTE: Do not initialize manually. Use api/experimentStats to initialize this class
 */
class ExperimentStats {
    /**
     *
     * @param {Experiment} info
     * @param {Array<UserActivityStats>} stats
     */
    constructor(info, stats) {
        if (!info || !stats || !Array.isArray(stats)) {
            throw new Error("Invalid info and stats passed to ExperimentStats");
        }

        /**
         * @type {Object<string, UserActivityStats>}
         */
        this.stats = {};
        /**
         * @type {Experiment}
         */
        this.info = info;

        stats.forEach((stat) => {
            if (!stat.environment || typeof stat.environment !== "string") {
                throw new Error("Invalid stats passed");
            }
            this.stats[stat.environment] = stat;
        });

        this._initVariables();
    }

    _initVariables() {
        this.variables = {};
        for (const variation of this.info.variations) {
            for (const variable of variation.variables) {
                assignKeyToObject(
                    this.variables,
                    [variable.variableName, variation.variationName],
                    variable.variableValue,
                );
            }
        }
    }

    /**
     * A Dataset is a collection of metrics
     * @param {string} environment
     * @param {string} segment
     * @param {DatasetDefinition} datasetDefinition Dataset definition
     */
    getDataset(environment, segment, datasetDefinition) {
        const metrics = this.getMetrics(environment, segment);
        const variations = this.getVariations();

        let dataset = {};
        for (const variation of variations) {
            const sessions = metrics.get(sessionsMetricId, variation);
            assignKeyToObject(dataset, [sessionsMetricId, variation], sessions);

            for (const metricDef of datasetDefinition) {
                const metricValue = metrics.get(
                    metricDef.id,
                    variation,
                    metricDef.dimension,
                );
                assignKeyToObject(
                    dataset,
                    [metricDef.name, variation],
                    metricValue,
                );
                assignKeyToObject(
                    dataset,
                    ["normalized", metricDef.name, variation],
                    sessions === 0 ? 0 : metricValue / sessions,
                );
            }
        }
        dataset.diff = this._getDatasetDiff(dataset, datasetDefinition);
        return dataset;
    }

    _getDatasetDiff(dataset, datasetDefinition) {
        const variations = this.getVariations();
        const controlGroup = this.getControlGroup();
        let diff = {};

        for (const metricDef of datasetDefinition) {
            const baseMetric = getValueFromObject(
                dataset,
                ["normalized", metricDef.name, controlGroup],
                0,
            );
            for (const variation of variations) {
                const metricValue = getValueFromObject(
                    dataset,
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

    /**
     * Gets a list of metrics for the given environment and segment
     * @param {String} environment 
     * @param {String} segment
     * @return {{
        data: Object.<string, Metric>,
        get: (metricId: String, variation: String, dimension: String) => number
    }} A list of metrics. Each metric is assigned an id. 
     */
    getMetrics(environment, segment) {
        let result = {};

        const variations = this.getVariations();
        const metricIds = this.getMetricIds();
        for (const variation of variations) {
            for (const metricId of metricIds) {
                const metricValue = getValueFromObject(
                    this.stats,
                    [
                        environment,
                        "variations",
                        variation,
                        "segments",
                        segment,
                        metricId,
                    ],
                    //If this is a sessions metric, then the default is just a number
                    metricId === sessionsMetricId ? 0 : { count: 0, amount: 0 },
                );
                assignKeyToObject(result, [metricId, variation], metricValue);
            }
        }
        return {
            data: result,
            get: function (metricId, variation, dimension = undefined) {
                return getValueFromObject(
                    this.data,
                    [metricId, variation, ...(dimension ? [dimension] : [])],
                    0,
                );
            },
        };
    }

    /**
     * Gets all segments in given experiment
     * @returns {Array<String>}
     */
    getSegments() {
        let segments = new Set();
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
        return [...segments].sort();
    }

    /**
     * Gets all the metric ids present in this stats
     * @returns {Array<String>}
     */
    getMetricIds() {
        let metricIds = new Set();

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
        return [...metricIds, ...essentialMetricIds].sort();
    }

    /**
     * Gets all environments
     * @returns {Array<string>}
     */
    getEnvironments() {
        return Object.keys(this.stats).sort();
    }

    /**
     * Gets all variations
     * @returns {Array<string>}
     */
    getVariations() {
        return !this.info || !this.info.variations
            ? []
            : this.info.variations
                  .sort((v1, v2) => {
                      if (v1.controlGroup) return -1;
                      if (v2.controlGroup) return 1;
                      return v1.variationName.localeCompare(v2.variationName);
                  })
                  .map((variation) => variation.variationName);
    }

    getVariationAllocation(variationName) {
        return !this.info.variations
            ? 0
            : this.info.variations.find(
                  (variation) => variation.variationName === variationName,
              ).normalizedTrafficAmount;
    }

    /**
     * Gets the controlgroup
     * @returns {String}
     */
    getControlGroup() {
        const controlGroup = this.info.variations.find(
            (variation) => variation.controlGroup,
        );
        if (!controlGroup) {
            throw new Error("Control Group not found. This is a fatal error!");
        }
        return controlGroup.variationName;
    }

    /**
     * Checks if the given environment have any data at all
     */
    hasData(environment) {
        const metrics = this.getMetrics(environment, "all");
        const variations = this.getVariations();
        let totalNumberOfSessions = 0;
        for (const variation of variations) {
            totalNumberOfSessions += metrics.get(sessionsMetricId, variation);
        }
        return totalNumberOfSessions > 0;
    }

    getVariables() {
        return Object.keys(this.variables);
    }

    getVariableValue(variableName, variationName) {
        return this.variables[variableName][variationName];
    }
}

export default ExperimentStats;
