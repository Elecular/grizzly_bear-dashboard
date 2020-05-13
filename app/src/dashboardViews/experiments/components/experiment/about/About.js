import React, { useContext } from "react";
import strings from "localizedStrings/strings";
import StatusBadge from "../../StatusBadge";
import moment from "moment";
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CardHeader,
} from "reactstrap";
import { stopExperiment } from "api/experiments";
import AuthorizationContext from "auth/authorizationContext";
import swal from "sweetalert";

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
                <SettingInfo stats={stats} />
                <StopExperiment info={stats.info} />
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
                    <th className="text-left text-muted">Setting Name</th>
                    {variations.map((variation) => (
                        <th key={variation} className="text-left text-muted">
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

const StopExperiment = (props) => {
    const { info } = props;
    const { authToken } = useContext(AuthorizationContext);

    const handleStopExperimentClick = () => {
        swal({
            title: "Are you sure?",
            text:
                "You are about to end an experiment. This action is not reversable!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willStop) => {
                if (!willStop) throw null;
                return stopExperiment(
                    info._id.projectId,
                    info._id.experimentName,
                    authToken,
                );
            })
            .then((_) => {
                swal("Your experiment is stopped!", {
                    icon: "success",
                }).then((_) => {
                    window.location.reload();
                });
            })
            .catch((err) => {
                if (err === null) {
                    return;
                } else if (err.status === 409) {
                    swal("Your experiment was already stopped", {
                        icon: "info",
                    });
                } else if (err.status === 401 || err.status === 403) {
                    swal(
                        "It seems like you are not logged in. Please refresh and try again",
                        {
                            icon: "info",
                        },
                    );
                } else {
                    swal(
                        "An unexpected error has occured. Please refresh and try again",
                        {
                            icon: "error",
                        },
                    );
                }
            });
    };

    //If the experiment has already stopped, we want to hide the button
    //If end date is before today or the start and end time are REALLY CLOSE (2 milliseconds apart)
    if (
        info.endTime &&
        (info.endTime <= Date.now() || info.endTime - info.startTime <= 2)
    ) {
        return <div></div>;
    }
    return (
        <div>
            <Button
                color="danger"
                style={{
                    marginTop: "1.5rem",
                    marginBottom: "1rem",
                }}
                onClick={handleStopExperimentClick}
            >
                Stop Experiment
            </Button>
        </div>
    );
};

const dateString = (date) =>
    date ? moment(date).format("MMM Do YYYY  hh:mm a") : "-";

export default About;
