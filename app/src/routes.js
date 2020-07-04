import ExperimentsView from "dashboardViews/experiments/Index";
import AddExperiment from "dashboardViews/addExperiment/AddExperiment";
import strings from "localizedStrings/strings";

const routes = [
    {
        path: "/experiments",
        name: strings.tabs.experiments,
        icon: "tim-icons icon-chart-bar-32",
        component: ExperimentsView,
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

export const adminRoutes = [
    {
        path: "/experiments",
        name: strings.tabs.experiments,
        icon: "tim-icons icon-chart-bar-32",
        component: ExperimentsView,
        layout: "/admin",
    },
    {
        path: "/add-experiment",
        name: strings.tabs.addExperiment,
        icon: "tim-icons icon-simple-add",
        component: AddExperiment,
        layout: "/admin",
    },
];

export default routes;
