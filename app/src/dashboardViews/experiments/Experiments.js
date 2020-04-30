import React, { useContext, useState } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import AuthorizationContext from "../../auth/authorizationContext";
import { getExperiments } from "../../api/experiments";
import ExperimentTable from "./components/ExperimentsTable";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import strings from "localizedStrings/strings";

const Experiments = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const [experiments, setExperiments] = useState([]);

    React.useEffect(() => {
        getExperiments(authToken, project._id).then(setExperiments);
    }, [authToken, project._id]);

    return (
        <div className="content">
            <Card
                style={{
                    width: `${experiments.length === 0 ? 40 : 80}rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    <CardTitle>
                        <h4>{strings.tabs.experiments}</h4>
                    </CardTitle>
                    {experiments.length !== 0 ? (
                        <ExperimentTable experiments={experiments} />
                    ) : (
                        <AddExperiment />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

const AddExperiment = (props) => (
    <div className="text-center">
        <Link to="/dashboard/add-experiment">
            <Button
                style={{
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                }}
                color="primary"
            >
                {strings.experimentsTab.addExperiment}
            </Button>
        </Link>
        <CardText
            style={{
                marginBottom: "1rem",
            }}
        >
            {strings.experimentsTab.noExperimentsFound}
        </CardText>
    </div>
);

export default Experiments;
