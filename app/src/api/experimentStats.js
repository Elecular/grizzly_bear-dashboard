/**
 * This API is used for getting experiment stats.
 */
import { getExperiment } from "api/experiments";
import { get } from "./request";
import ExperimentStats from "models/ExperimentStats";
import "api/experiments"; //Importing typedefs

/**
 * This is the response from getExperimentStats
@typedef {{
    environment: String,
    experimentName: String,
    projectId: String,
    variations: Object.<string, {
        segments: Object.<string, 
            Object.<string, ({
                count: number,
                amount: number
            }|number)>
        >
    }>
}} UserActivityStats
*/

const environments = ["dev", "stage", "prod"];
const userActivityUri = process.env.REACT_APP_USER_ACTIVITY_SERVICE;
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
                getUserActivityStats(
                    projectId,
                    experiment,
                    environment,
                    authToken,
                ),
            ),
        );
        const experimentInfo = await getExperiment(
            projectId,
            experiment,
            authToken,
        );
        return new ExperimentStats(experimentInfo, environmentStats);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 *
 * Gets all experiments owned by this user in the given project
 * @async
 * @param {String} authToken
 * @param {String} projectId
 * @param {String} experimentName
 * @param {String} environment
 * @returns {Promise<UserActivityStats>}
 */
const getUserActivityStats = async (
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
