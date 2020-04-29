import Experiments from "dashboardViews/experiments/Experiments";
import AddExperiment from "dashboardViews/addExperiment/AddExperiment";

const routes = [
    {
        path: "/experiments",
        name: "Experiments",
        icon: "tim-icons icon-chart-bar-32",
        component: Experiments,
        layout: "/dashboard",
    },
    {
        path: "/add-experiment",
        name: "Add Experiment",
        icon: "tim-icons icon-simple-add",
        component: AddExperiment,
        layout: "/dashboard",
    },
];

export default routes;
