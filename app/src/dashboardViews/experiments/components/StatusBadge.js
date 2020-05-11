import React from "react";
import { Badge } from "reactstrap";

const StatusBadge = (props) => {
    let { startTime, endTime } = props;
    let status = "Running";
    let color = "success";

    let time = Date.now();

    if (time < startTime) {
        status = "Not Sarted";
        color = "warning";
    } else if (endTime && time > endTime) {
        status = "Finished";
        color = "default";
    }

    return <Badge color={color}>{status}</Badge>;
};

export default StatusBadge;
