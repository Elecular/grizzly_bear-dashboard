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
        settings: "Variation Settings",

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
            subTitle: "Now, let's add different variations for your experiment",
            variationName: "Variation Name",
            trafficPercentage: "Traffic %",
            addVariation: "Add Variation",
            variationsMustBeUnique: "Variation names must be unique",
            trafficMustBeValid:
                "Traffic % must be a positive integer and less than 100%",
            trafficMustAddTo100: "Total traffic must add up to 100%",
            enterValidVariationName:
                "Variation names can only contain letters, numbers and spaces",
        },
        settingsComponent: {
            subTitle: "Lastly, we can define your variations through settings",
            settings: "Settings",
            addSetting: "Add Setting",
            enterValidSettingName:
                "A Setting name can only contain letters,numbers and spaces",
            enterValidValueName:
                "A setting can only contain letters, number and spaces",
            settingNamesMustBeUnique: "Setting names must be unique",
            allSettingsMustBeDefined: "All Settings must be defined",
        },

        next: "Next",
        previous: "Previous",
        finish: "Create",
    },

    footer: {
        aboutUs: "About Us",
        blog: "Blog",
    },
};
