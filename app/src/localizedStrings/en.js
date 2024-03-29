export default {
    tabs: {
        experiments: "Experiments",
        addExperiment: "Add Experiment",
    },

    addExperimentsTab: {
        title: "New Experiment",
        subTitle: "Understand user behaviour on a deeper level",

        experimentInfo: "Experiment Info",
        variations: "Variations",
        settings: "Variation Settings",

        experimentAlreadyExists:
            "An experiment with the given name already exists. Please try again with another name.",
        errorOnOurSide:
            "There seems to be a problem on our side. Please refresh the page and try again. If the problem persists, contact our helpline.",

        experimentIsCreated: "The experiment is created",
        close: "Close",
        showMe: "Show Me!",

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
                "Now, let's setup different variations of your game",
            variationName: "Variation Name",
            trafficPercentage: "Traffic %",
            addVariation: "Add Variation",
            variationsMustBeUnique: "Variation names must be unique",
            trafficMustBeValid:
                "Traffic % must be a positive integer and less than 100%",
            trafficMustAddTo100: "Total traffic must add up to 100%",
            enterValidVariationName:
                "Variation names can only contain letters, numbers and spaces",
            minimumVariationError:
                "There must be at least 2 variations in an experiment",
        },
        settingsComponent: {
            subTitle:
                "Settings will define how each of your variations will look and behave",
            settings: "Settings",
            addSetting: "Add Setting",
            enterValidSettingName:
                "A Setting name can only contain letters,numbers and spaces",
            enterValidValueName: "A setting cannot be empty",
            settingNamesMustBeUnique: "Setting names must be unique",
            allSettingsMustBeDefined: "All Settings must be defined",
            miniminSettingsError:
                "There must be at least 1 setting in an experiment",
        },

        next: "Next",
        previous: "Previous",
        finish: "Create",
    },

    experimentsTab: {
        addExperiment: "Add Experiment",
        noExperimentsFound: "You do not have any experiments yet!",
        loading: "Loading",
        loadingMessage: "The experiment is loading. Please wait...",
        error: "Error",
        errorMessage:
            "There was an error while loading experiment stats. Please refresh the page and try again.",
        experimentInfo: "Experiment Info",
        environmentToolTip:
            "Environments allow you to organize your project into sections that correspond to your development environments",
        segmentToolTip:
            "Segments are divisions of your users based on characteristics such as age, sex, location etc.",
        noDataAlert:
            'This environment does not have any data yet. If you are logging events from your Unity editor, then choose the "dev" environment in the dropdown menu. Please note that it may take up to 3 hours to process events.',
        adAnalytics: {
            name: "Ad Analytics",
            summary: "Summary",
            placementBreakDown: "Placement Breakdown",
        },
        transactionAnalytics: {
            name: "Transaction Analytics",
            summary: "Summary",
            productBreakDown: "Product Breakdown",
        },
        customAnalytics: {
            name: "Custom Analytics",
        },
    },

    footer: {
        aboutUs: "About Us",
        blog: "Blog",
    },
};
