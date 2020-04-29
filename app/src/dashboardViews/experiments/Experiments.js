import React, { useContext, useState } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import AuthorizationContext from "../../auth/authorizationContext";
import { getExperiments } from "../../api/experiments";
import ExperimentTable from "./components/ExperimentsTable";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

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
                    width: `${experiments.length == 0 ? 40 : 80}rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    <CardTitle>
                        <h4>Experiments</h4>
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
            >
                Add Experiment
            </Button>
        </Link>
        <CardText
            style={{
                marginBottom: "1rem",
            }}
        >
            You do not have any experiments yet!
        </CardText>
    </div>
);

export default Experiments;
