import ExperimentsView from "dashboardViews/experiments/Index";
import AddExperiment from "dashboardViews/addExperiment/AddExperiment";
import strings from "localizedStrings/strings";
import ProjectView from "dashboardViews/admin/projectsView/ProjectView";

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
        path: "/projects",
        name: "Projects",
        icon: "tim-icons icon-bullet-list-67",
        component: ProjectView,
        layout: "/admin",
    },
    {
        path: "/add-experiment",
        name: strings.tabs.addExperiment,
        icon: "tim-icons icon-app",
        component: AddExperiment,
        layout: "/admin",
    },
];

export default routes;
