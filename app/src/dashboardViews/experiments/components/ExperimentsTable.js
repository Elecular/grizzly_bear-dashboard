import React from "react";
import { Table } from "reactstrap";
import moment from "moment";
import { Badge } from "reactstrap";

const ExperimentsTable = (props) => {
    const { experiments, onExperimentSelect } = props;
    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {experiments
                    .sort((a, b) => a.startTime - b.startTime)
                    .map((experiment) => (
                        <tr
                            key={experiment._id.experimentName}
                            className="clickable"
                            onClick={() => {
                                onExperimentSelect(
                                    experiment._id.experimentName,
                                );
                            }}
                        >
                            <td>{experiment._id.experimentName}</td>
                            <td>{`${dateString(experiment.startTime)}`}</td>
                            <td>{`${dateString(experiment.endTime)}`}</td>
                            <td>
                                <StatusBadge
                                    startTime={experiment.startTime}
                                    endTime={experiment.endTime}
                                />
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
};

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

const dateString = (date) => (date ? moment(date).format("MMM Do YYYY") : "-");

export default ExperimentsTable;
