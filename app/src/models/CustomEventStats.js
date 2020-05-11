import ExperimentStats from "./ExperimentStats";
import { getValueFromObject } from "utils/objectUtils";

class CustomEventStats extends ExperimentStats {
    /**
     * Instantiates CustomEventStats from given experimentStats
     * @param {ExperimentStats} experimentStats
     * @returns {CustomEventStats}
     */
    static Instantiate(experimentStats) {
        return new CustomEventStats(
            experimentStats.info,
            Object.values(experimentStats.stats),
        );
    }

    getCustomEventDataset(environment, segment) {
        const customEventIds = this.getCustomEventIds(environment, segment);
        let customEventDataset = {};

        const customEventDatasetDefinition = customEventIds.map(
            (customEventId) => ({
                name: customEventId,
                id: this._customEventToMetricId(customEventId),
                dimension: "amount",
            }),
        );

        customEventDataset = this.getDataset(
            environment,
            segment,
            customEventDatasetDefinition,
        );

        return {
            data: customEventDataset,
            //Helper method for extracting transaction metrics
            get: function (customEventId, variation, normalized = false) {
                return getValueFromObject(
                    this.data,
                    [
                        customEventId,
                        ...(normalized ? ["normalized"] : []),
                        ...[variation],
                    ],
                    0,
                );
            },
            //Helper method for extracting diff
            getDiff: function (customEventId, variation) {
                return getValueFromObject(
                    this.data,
                    ["diff", customEventId, variation],
                    0,
                );
            },
        };
    }

    getCustomEventIds(environment, segment) {
        let metrics = this.getMetrics(environment, segment);
        return [
            ...new Set(
                Object.keys(metrics.data)
                    .map((metricId) => {
                        if (this._isCustomEventId(metricId)) {
                            return this._getCustomEventId(metricId);
                        }
                    })
                    .filter((productId) => productId !== undefined),
            ),
        ].sort();
    }

    _isCustomEventId(metricId) {
        return metricId.match(new RegExp("custom/.+"));
    }

    _getCustomEventId(metricId) {
        return metricId.replace(new RegExp("custom/"), "");
    }

    _customEventToMetricId(customEventId) {
        return `custom/${customEventId}`;
    }
}

export default CustomEventStats;
