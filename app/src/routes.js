import Experiments from "dashboardViews/experiments/Experiments";
import AddExperiment from "dashboardViews/addExperiment/AddExperiment";
import strings from "localizedStrings/strings";

const routes = [
    {
        path: "/experiments",
        name: strings.tabs.experiments,
        icon: "tim-icons icon-chart-bar-32",
        component: Experiments,
        layout: "/dashboard",
    },
    {
        path: "/add-experiment",
        name: strings.tabs.addExperiment,
        icon: "tim-icons icon-simple-add",
        component: AddExperiment,
        layout: "/dashboard",
    },
];

export default routes;
