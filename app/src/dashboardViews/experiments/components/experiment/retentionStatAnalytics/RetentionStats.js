import React from "react";
import RetentionStats from "models/RetentionStats";
import RetentionStatsResults from "./Results";

const RetentionStatsAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const retentionStats = RetentionStats.Instantiate(experimentStats);

    return (
        <div style={{ marginTop: "1rem"}}>
            <RetentionStatsResults
                stats={retentionStats}
                environment={environment}
                segment={segment}
            />
        </div>
    );
});

export default RetentionStatsAnalytics;