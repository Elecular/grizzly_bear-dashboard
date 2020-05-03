import React, { useContext } from "react";
import ReactWizard from "react-bootstrap-wizard";
import BasicInfo from "./components/BasicInfo";
import VariationsInfo from "./components/VariationsInfo";
import VariationSettings from "./components/VariationSettings";
import strings from "../../localizedStrings/strings";
import AuthorizationContext from "../../auth/authorizationContext";
import Decimal from "decimal.js";
import { addExperiment } from "../../api/experiments";
import { Modal, ModalBody, Button } from "reactstrap";
import { forceLogin, isAuthTokenValid } from "../../auth/login";

const AddExperiment = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    //States for all the sub forms
    const [variations, setVariations] = React.useState([]);
    const [experimentInfo, setExperimentInfo] = React.useState({});
    const [variationSettings, setVariationSettings] = React.useState([]);

    const [loading, setLoading] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [error, setError] = React.useState(undefined);

    //Is authentication token is not valid for the next two hours
    if (!project || !isAuthTokenValid(authToken, 2)) {
        alert("You session is about to expire. Please relogin");
        forceLogin(true);
    }

    let steps = [
        {
            stepName: strings.addExperimentsTab.experimentInfo,
            stepIcon: "tim-icons icon-bullet-list-67",
            component: BasicInfo,
            stepProps: {
                setExperimentInfo,
            },
        },
        {
            stepName: strings.addExperimentsTab.variations,
            stepIcon: "tim-icons icon-chart-bar-32",
            component: VariationsInfo,
            stepProps: {
                setVariations,
            },
        },
        {
            stepName: strings.addExperimentsTab.settings,
            stepIcon: "tim-icons icon-settings-gear-63",
            component: VariationSettings,
            stepProps: {
                variations,
                setVariationSettings,
            },
        },
    ];

    const handleFormCompletion = () => {
        if (loading) return;

        const experiment = constructExperimentBody(
            experimentInfo,
            variations,
            variationSettings,
            project,
        );
        console.log(experiment);
        setLoading(true);
        setOpenModal(true);
        console.log(experiment);
        addExperiment(project._id, experiment, authToken)
            .then((addedExperiment) => {
                setLoading(false);
            })
            .catch((err) => {
                setError(strings.addExperimentsTab.errorOnOurSide);
                if (err.httpError) {
                    if (err.status === 409) {
                        setError(
                            strings.addExperimentsTab.experimentAlreadyExists,
                        );
                    }
                }
                setLoading(false);
            });
    };

    return (
        <div className="content">
            <div
                style={{
                    margin: "3rem",
                }}
            >
                <ReactWizard
                    color="blue"
                    headerTextCenter={true}
                    navSteps={true}
                    progressbar={true}
                    title={strings.addExperimentsTab.title}
                    description={strings.addExperimentsTab.subTitle}
                    steps={steps}
                    validate={true}
                    nextButtonText={strings.addExperimentsTab.next}
                    previousButtonText={strings.addExperimentsTab.previous}
                    finishButtonText={strings.addExperimentsTab.finish}
                    nextButtonClasses="btn-wd btn-primary"
                    previousButtonClasses="btn-wd btn-primary"
                    finishButtonClasses="btn-wd btn-primary"
                    finishButtonClick={() => handleFormCompletion()}
                />
            </div>
            <FeedbackModal
                openModal={openModal}
                loading={loading}
                error={error}
            />
        </div>
    );
};

const FeedbackModal = (props) => {
    const { openModal, loading, error } = props;
    return (
        <Modal isOpen={openModal} modalClassName="modal-black">
            <ModalBody
                className="text-center"
                style={{
                    padding: "2rem",
                    width: "100%",
                }}
            >
                {loading ? (
                    <>
                        <div
                            className="spinner-border"
                            style={{
                                margin: "auto",
                                marginBottom: "2rem",
                            }}
                        ></div>
                        <p
                            style={{
                                margin: "auto",
                                marginBottom: "2rem",
                            }}
                        >
                            Creating experiment
                        </p>
                    </>
                ) : (
                    <>
                        <p
                            style={{
                                margin: "auto",
                                marginBottom: "2rem",
                            }}
                        >
                            {error
                                ? error
                                : strings.addExperimentsTab.experimentIsCreated}
                        </p>
                        <Button color={error ? "danger" : "success"} size="sm">
                            {error
                                ? strings.addExperimentsTab.close
                                : strings.addExperimentsTab.showMe}
                        </Button>
                    </>
                )}
            </ModalBody>
        </Modal>
    );
};

const constructExperimentBody = (
    experimentInfo,
    variations,
    variationSettings,
    project,
) => ({
    _id: {
        projectId: project._id,
        experimentName: experimentInfo.experimentName,
    },
    startTime: experimentInfo.scheduleExperiments
        ? experimentInfo.startTime
        : undefined,
    endTime: experimentInfo.scheduleExperiments
        ? experimentInfo.endTime
        : undefined,
    variations: variations.map((variation, variationIndex) => ({
        variationName: variation.name,
        normalizedTrafficAmount: new Decimal(variation.traffic)
            .dividedBy(100.0)
            .toNumber(),
        controlGroup: variation.controlGroup,
        variables: variationSettings.variables.map(
            (variable, variableIndex) => ({
                variableName: variable.name,
                variableType: variable.type,
                variableValue:
                    variationSettings.values[variableIndex][variationIndex],
            }),
        ),
    })),
});

export default AddExperiment;
