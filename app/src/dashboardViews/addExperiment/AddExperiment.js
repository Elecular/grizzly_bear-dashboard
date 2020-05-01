import React from "react";
import ReactWizard from "react-bootstrap-wizard";
import BasicInfo from "./components/BasicInfo";
import VariationsInfo from "./components/VariationsInfo";
import VariablesInfo from "./components/VariablesInfo";
import strings from "../../localizedStrings/strings";

const AddExperiment = (props) => {
    const [variations, setVariations] = React.useState([]);

    let steps = [
        {
            stepName: strings.addExperimentsTab.experimentInfo,
            stepIcon: "tim-icons icon-bullet-list-67",
            component: VariationsInfo,
            stepProps: {
                setVariations,
            },
        },
        {
            stepName: strings.addExperimentsTab.variables,
            stepIcon: "tim-icons icon-settings-gear-63",
            component: VariablesInfo,
            setpProps: {
                variations,
            },
        },
        {
            stepName: strings.addExperimentsTab.variations,
            stepIcon: "tim-icons icon-chart-bar-32",
            component: BasicInfo,
        },
    ];

    return (
        <div className="content">
            <div
                style={{
                    marginLeft: "10rem",
                    marginRight: "10rem",
                    marginTop: "3rem",
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
                />
            </div>
        </div>
    );
};

export default AddExperiment;
