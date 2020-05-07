/**
 * This API is used for getting experiment metrics.
 */
import { getExperiment } from "api/experiments";
import { get } from "./request";
import ExperimentStats from "models/ExperimentStats";

const userActivityUri = process.env.REACT_APP_USER_ACTIVITY_SERVICE;

const environments = ["dev", "stage", "prod"];

if (!userActivityUri) {
    throw new Error(
        "REACT_APP_EXPERIMENTS_SERVICE environment variable is not passed",
    );
}

/**
 *
 * @param {string} projectId
 * @param {string} experiment
 * @param {string} authToken
 * @returns {Promise<ExperimentStats>}
 */
export default async function (projectId, experiment, authToken) {
    try {
        const environmentStats = await Promise.all(
            environments.map((environment) =>
                getExperimentStats(
                    projectId,
                    experiment,
                    environment,
                    authToken,
                ),
            ),
        );
        const experimentInfo = (
            await getExperiment(projectId, experiment, authToken)
        )[0];
        return new ExperimentStats(experimentInfo, environmentStats);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Gets all experiments owned by this user in the given project
 * @param {string} authToken
 * @param {string} projectId
 * @param {string} experimentName
 * @param {string} environment
 * @returns {Promise<Array<Object>>}
 */
const getExperimentStats = async (
    projectId,
    experimentName,
    environment,
    authToken,
) => {
    return await get(
        `${userActivityUri}/projects/${projectId}/experiments/${experimentName}/environments/${environment}/stats`,
        authToken,
    );
};
