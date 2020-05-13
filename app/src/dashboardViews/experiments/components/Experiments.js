import React, { useContext, useState } from "react";
import { Card, CardBody, CardText } from "reactstrap";
import AuthorizationContext from "auth/authorizationContext";
import { getExperiments } from "api/experiments";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import strings from "localizedStrings/strings";
import { BreadcrumbItem } from "reactstrap";
import ExperimentsTable from "./ExperimentsTable";
import { Redirect } from "react-router-dom";
import { forceLogin } from "auth/login";
import swal from "sweetalert";
import Message from "dashboardViews/Message";

const Experiments = React.memo((props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = React.useState(
        undefined,
    );
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchExperiments = async () => {
            setLoading(true);
            try {
                const experiments = await getExperiments(
                    project._id,
                    authToken,
                );
                setExperiments(experiments);
            } catch (err) {
                if (err.status === 401 || err.stats === 403) {
                    await swal(
                        "It seems like you are logged out. Please login",
                        {
                            icon: "info",
                        },
                    );
                    forceLogin();
                    return;
                }
                setExperiments(() => {
                    throw new Error("Error while getting experiments");
                });
            } finally {
                setLoading(false);
            }
        };
        fetchExperiments();
    }, [authToken, project._id]);

    if (loading) {
        return (
            <Message
                title="Loading ..."
                message="We are loading your experiments"
            />
        );
    }
    if (selectedExperiment !== undefined) {
        return <RedirectToExperiment selectedExperiment={selectedExperiment} />;
    }
    return (
        <div className="content">
            <ol className="breadcrumb bg-transparent">
                <BreadcrumbItem>{strings.tabs.experiments}</BreadcrumbItem>
            </ol>
            <Card
                style={{
                    width: `${experiments.length === 0 ? 40 : 60}rem`,
                    padding: "0.5rem",
                }}
            >
                <CardBody>
                    {experiments.length !== 0 ? (
                        <ExperimentsTable
                            experiments={experiments}
                            onExperimentSelect={setSelectedExperiment}
                        />
                    ) : (
                        <AddExperiment />
                    )}
                </CardBody>
            </Card>
        </div>
    );
});

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

const RedirectToExperiment = (props) => (
    <Redirect
        to={{
            pathname: `/dashboard/experiments/results`,
            state: {
                selectedExperiment: props.selectedExperiment,
            },
        }}
    />
);

export default Experiments;
