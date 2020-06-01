import React from "react";
import AdResults from "./Results";
import PlacementBreakDown from "./PlacementBreakdown";
import AdStats from "models/AdStats";
import strings from "localizedStrings/strings";

const translations = strings.experimentsTab.adAnalytics;

const AdAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const adStats = AdStats.Instantiate(experimentStats);

    return (
        <div>
            <div>
                <h4
                    className="text-muted"
                    style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        display: "flex",
                    }}
                >
                    {translations.summary}
                </h4>
                {
                    <AdResults
                        stats={adStats}
                        environment={environment}
                        segment={segment}
                    />
                }
            </div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
                >
                    {translations.placementBreakDown}
                </h4>
                {
                    <PlacementBreakDown
                        stats={adStats}
                        environment={environment}
                        segment={segment}
                    />
                }
            </div>
        </div>
    );
});

export default AdAnalytics;
