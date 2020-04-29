import React from "react";
import ReactWizard from "react-bootstrap-wizard";
import BasicInfo from "./components/BasicInfo";
import VariationsInfo from "./components/VariationsInfo";
import VariablesInfo from "./components/VariablesInfo";

var steps = [
    {
        stepName: "Experiment Info",
        stepIcon: "tim-icons icon-bullet-list-67",
        component: BasicInfo,
    },
    {
        stepName: "Variations",
        stepIcon: "tim-icons icon-chart-bar-32",
        component: VariationsInfo,
    },
    {
        stepName: "Variables",
        stepIcon: "tim-icons icon-settings-gear-63",
        component: VariablesInfo,
    },
];

const AddExperiment = (props) => {
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
                    title="New Experiment"
                    description="Understand user behaviour on a deeper level"
                    steps={steps}
                    validate={true}
                />
            </div>
        </div>
    );
};

export default AddExperiment;
