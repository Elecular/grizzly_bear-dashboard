import React from "react";
import RetentionStats from "models/RetentionStats";
import RetentionStatsResults from "./Results";


const RetentionStatsAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const retentionStats = RetentionStats.Instantiate(experimentStats);

    return (
        <div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                >
                    Summary
                </h4>
                <RetentionStatsResults
                    stats={retentionStats}
                    environment={environment}
                    segment={segment}
                />
            </div>
        </div>
    );
});

export default RetentionStatsAnalytics;