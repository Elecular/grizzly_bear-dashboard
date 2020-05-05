import { get, post } from "./request";

const userActivityUri = process.env.REACT_APP_USER_ACTIVITY_SERVICE;

if (!userActivityUri) {
    throw new Error(
        "REACT_APP_EXPERIMENTS_SERVICE environment variable is not passed",
    );
}

/**
 * Gets all experiments owned by this user in the given project
 * @param {string} authToken
 * @param {string} projectId
 * @param {string} experimentName
 * @param {string} environment
 * @returns {Promise<Array<Object>>}
 */
export const getExperimentStats = async (
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
