import ExperimentStats from "./ExperimentStats";
import { getValueFromObject } from "utils/objectUtils";
import { number } from "prop-types";

class RetentionStats extends ExperimentStats {
    /**
     * Instantiates RetentionStats from given experimentStats
     * @param {ExperimentStats} experimentStats
     * @returns {RetentionStats}
     */
    static Instantiate(experimentStats) {
        return new RetentionStats(
            experimentStats.info,
            Object.values(experimentStats.stats),
        );
    }

    getRetentionStatDataset(environment, segment) {
        const retentionStatIds = this.getRetentionStatIds(environment, segment);
        let retentionStatDataset = {};

        const retentionStatDatasetDefinition = retentionStatIds.map(
            (retentionStatId) => ({
                name: retentionStatId,
                id: this._retentionStatToMetricId(retentionStatId),
                dimension: "count",
            }),
        );

        retentionStatDataset = this.getDataset(
            environment,
            segment,
            retentionStatDatasetDefinition,
        );

        return {
            data: retentionStatDataset,
            //Helper method for extracting retention stat metrics
            get: function (retentionStatId, variation, normalized = false) {
                return getValueFromObject(
                    this.data,
                    [
                        ...(normalized ? ["normalized"] : []),
                        retentionStatId,
                        ...[variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (retentionStatId, variation) {
                return getValueFromObject(
                    this.data,
                    ["diff", retentionStatId, variation],
                    0,
                );
            },
        };
    }

    getRetentionStatIds(environment, segment) {
        let metrics = this.getMetrics(environment, segment);
        return [
            ...new Set(
                Object.keys(metrics.data)
                    .map((metricId) => {
                        if (this._isRetentionStatId(metricId)) {
                            return this._getRetentiontStatId(metricId);
                        }
                    })
                    .filter((retentionStatId) => retentionStatId !== undefined),
            ),
        ].sort((first, second) => {
            return Number.parseInt(first.substring(4)) - Number.parseInt(second.substring(4));
        });
    }

    _isRetentionStatId(metricId) {
        return metricId.match(new RegExp("retention/.+"));
    }

    _getRetentiontStatId(metricId) {
        return metricId.replace(new RegExp("retention/"), "");
    }

    _retentionStatToMetricId(retentionStatId) {
        return `retention/${retentionStatId}`;
    }
}

export default RetentionStats;
