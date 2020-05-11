import React from "react";
import CustomEventStats from "models/CustomEventStats";
import strings from "localizedStrings/strings";
import CustomEventResults from "./Results";

const translations = strings.experimentsTab.customAnalytics;

const CustomEventAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const customEventStats = CustomEventStats.Instantiate(experimentStats);

    return (
        <div>
            <div>
                <h4
                    className="text-muted"
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                >
                    {translations.summary}
                </h4>
                <CustomEventResults
                    stats={customEventStats}
                    environment={environment}
                    segment={segment}
                />
            </div>
        </div>
    );
});

export default CustomEventAnalytics;
