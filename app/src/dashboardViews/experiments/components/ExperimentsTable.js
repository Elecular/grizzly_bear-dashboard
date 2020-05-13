import React from "react";
import { Table } from "reactstrap";
import moment from "moment";
import StatusBadge from "./StatusBadge";

const ExperimentsTable = (props) => {
    const { experiments, onExperimentSelect } = props;
    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th className="text-muted">Name</th>
                    <th className="text-muted">Start Date</th>
                    <th className="text-muted">End Date</th>
                    <th className="text-muted">Status</th>
                </tr>
            </thead>
            <tbody>
                {experiments
                    .sort((a, b) => b.startTime - a.startTime)
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

const dateString = (date) => (date ? moment(date).format("MMM Do YYYY") : "-");

export default ExperimentsTable;
