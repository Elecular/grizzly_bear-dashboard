import React from "react";
import strings from "localizedStrings/strings";
import StatusBadge from "../../StatusBadge";
import moment from "moment";
import { Table } from "reactstrap";

const translations = strings.experimentsTab.customAnalytics;

const About = React.memo((props) => {
    const { stats } = props;

    return (
        <div>
            <BasicInfo info={stats.info} />
            <div
                style={{
                    marginTop: "2rem",
                }}
            >
                <h4 className="text-muted" style={{ marginBottom: "1rem" }}>
                    Settings
                </h4>
                <SettingInfo stats={stats} />
            </div>
        </div>
    );
});

const BasicInfo = (props) => (
    <div>
        <div style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>
            <h6 className="text-muted">Experiment Name :</h6>
            <p>{props.info._id.experimentName}</p>
        </div>
        <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
            <h6 className="text-muted">Status :</h6>
            <StatusBadge
                startTime={props.info.startTime}
                endTime={props.info.endTime}
            />
        </div>
        <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
            <h6 className="text-muted">Date Range :</h6>
            <div style={{ display: "flex" }}>
                <p style={{ marginRight: "0.75rem" }}>
                    {dateString(props.info.startTime)}
                </p>
                <p style={{ marginRight: "0.75rem" }}>-</p>
                <p>
                    {props.info.endTime
                        ? dateString(props.info.endTime)
                        : "Endless"}
                </p>
            </div>
        </div>
    </div>
);

const SettingInfo = (props) => {
    const { stats } = props;
    const variations = stats.getVariations();
    const variables = stats.getVariables();

    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th className="text-left">Setting Name</th>
                    {variations.map((variation) => (
                        <th key={variation} className="text-left">
                            <div
                                style={{
                                    display: "inline-flex",
                                    marginRight: "0.5rem",
                                }}
                            >
                                {variation}
                            </div>
                            {`(${Math.round(
                                stats.getVariationAllocation(variation) * 100,
                            )}%)`}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {variables.map((variable) => (
                    <tr key={variable}>
                        <td>{variable}</td>
                        {variations.map((variation) => (
                            <td key={`${variable}${variation}`}>
                                {stats.getVariableValue(variable, variation)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const dateString = (date) =>
    date ? moment(date).format("MMM Do YYYY  hh:mm a") : "-";

export default About;
