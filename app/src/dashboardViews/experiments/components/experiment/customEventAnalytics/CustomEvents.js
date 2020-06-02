import React from "react";
import CustomEventStats from "models/CustomEventStats";
import strings from "localizedStrings/strings";
import CustomEventResults from "./Results";

const CustomEventAnalytics = React.memo((props) => {
    const { experimentStats, environment, segment } = props;
    const customEventStats = CustomEventStats.Instantiate(experimentStats);

    return (
        <div style={{ marginTop: "1rem"}}>
            <CustomEventResults
                stats={customEventStats}
                environment={environment}
                segment={segment}
            />
        </div>
    );
});

export default CustomEventAnalytics;
