export default {
    tabs: {
        experiments: "Experiments",
        addExperiment: "Add Experiment",
    },

    experimentsTab: {
        addExperiment: "Add Experiment",
        noExperimentsFound: "You do not have any experiments yet!",
    },

    addExperimentsTab: {
        title: "New Experiment",
        subTitle: "Understand user behaviour on a deeper level",

        experimentInfo: "Experiment Info",
        variations: "Variations",
        variables: "Variables",

        basicInfoComponent: {
            subTitle:
                "Let's start with some basic information about your experiment",
            experimentName: "Experiment Name",
            startExperimentNow: "Start Experiment Now",
            scheduleExperiment: "Schedule Experiment",
            startDate: "Start Date",
            endDate: "End Date (Optional)",
            invalidExperimentName: "Invalid experiment name",
            invalidStartDate: "Start date has to be in the future",
            invalidEndDate: "End date has to be after start date",
        },
        variationsComponent: {
            subTitle:
                "Now, let's setup different variations for your experiment",
            variationName: "Variation Name",
            trafficPercentage: "Traffic %",
            addVariation: "Add Variation",
            controlGroup: "Control Group",
            variation: "Variation",
            variationsMustBeUnique: "Variation names must be unique",
            trafficMustBeValid:
                "Traffic % must be a positive integer and less than 100%",
            trafficMustAddTo100: "Total traffic must add up to 100%",
        },

        next: "Next",
        previous: "Previous",
        finish: "Finish",
    },

    footer: {
        aboutUs: "About Us",
        blog: "Blog",
    },
};
