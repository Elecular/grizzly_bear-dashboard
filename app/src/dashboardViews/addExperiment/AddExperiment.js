import React, { useContext } from "react";
import ReactWizard from "react-bootstrap-wizard";
import BasicInfo from "./components/BasicInfo";
import VariationsInfo from "./components/VariationsInfo";
import VariationSettings from "./components/VariationSettings";
import strings from "../../localizedStrings/strings";
import AuthorizationContext from "../../auth/authorizationContext";
import Decimal from "decimal.js";
import { addExperiment } from "../../api/experiments";
import { forceLogin, isAuthTokenValidForProject } from "../../auth/login";
import ErrorBoundary from "dashboardViews/ErrorBoundary";
import swal from "sweetalert";

const AddExperiment = (props) => {
    const { onNextClick = undefined } = props;
    const { authToken, project } = useContext(AuthorizationContext);
    //States for all the sub forms
    const [variations, setVariations] = React.useState([]);
    const [experimentInfo, setExperimentInfo] = React.useState({});
    const [variationSettings, setVariationSettings] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        isAuthTokenValidForProject(authToken, project, 2).then((isValid) => {
            if (isValid) return;
            swal("You session is about to expire. Please login", {
                icon: "info",
            }).then((_) => {
                forceLogin();
            });
        });
    });

    let steps = [
        {
            stepName: strings.addExperimentsTab.experimentInfo,
            stepIcon: "tim-icons icon-bullet-list-67",
            component: BasicInfo,
            stepProps: {
                setExperimentInfo: (experimentInfo) => {
                    if (onNextClick) onNextClick(experimentInfo);
                    setExperimentInfo(experimentInfo);
                },
            },
        },
        {
            stepName: strings.addExperimentsTab.variations,
            stepIcon: "tim-icons icon-chart-bar-32",
            component: VariationsInfo,
            stepProps: {
                setVariations: (variationsInfo) => {
                    if (onNextClick) onNextClick(variationsInfo);
                    setVariations(variationsInfo);
                },
            },
        },
        {
            stepName: strings.addExperimentsTab.settings,
            stepIcon: "tim-icons icon-settings-gear-63",
            component: VariationSettings,
            stepProps: {
                variations,
                setVariationSettings: (settings) => {
                    if (onNextClick) onNextClick(settings);
                    setVariationSettings(settings);
                },
            },
        },
    ];

    const handleFormCompletion = async () => {
        if (loading) return;
        setLoading(true);
        swal({
            title: "Creating . . .",
            text: "We are creating the experiment for you.",
            closeOnClickOutside: false,
            closeOnEsc: false,
            closeModal: false,
            buttons: false,
        });
        try {
            const experiment = constructExperimentBody(
                experimentInfo,
                variations,
                variationSettings,
                project,
            );
            await addExperiment(project._id, experiment, authToken);
            swal.close();
            await swal({
                title: "Success",
                icon: "success",
                text: "You experiment is created!",
            });
            window.location.href = "/dashboard/experiments";
        } catch (err) {
            swal.close();
            if (err && err.httpError && err.status === 409) {
                await swal({
                    title: "Duplicate Name",
                    text:
                        "Experiment with the given name already eixsts. Please try again with another name",
                    icon: "error",
                });
            } else if (err && err.httpError && (err.status === 403 || 409)) {
                await swal({
                    title: "Session Expired",
                    text:
                        "It looks like yor session has expired. Please relogin!",
                    icon: "info",
                });
                forceLogin();
            } else {
                await swal({
                    title: "Unexpected Error",
                    text:
                        "An unexepcted error occured. Please refresh and try again",
                    icon: "error",
                });
            }
        } finally {
            setLoading(false);
        }
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
                    finishButtonClick={handleFormCompletion}
                />
            </div>
        </div>
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

const AddExperimentWrapper = (props) => (
    <ErrorBoundary>
        <AddExperiment {...props} />
    </ErrorBoundary>
);

export default AddExperimentWrapper;
