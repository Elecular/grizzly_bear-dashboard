import { get, post } from "./request";

/**
 * This is the response from getExperiment
@typedef {{
    _id: {
        projectId: String,
        experimentName: String
    },
    projectId: String,
    startTime: number,
    endTime: number,
    variations: [{
        controlGroup: boolean,
        normalizedTrafficAmount: number,
        variables: Array<Object>,
        variationName: String
    }]
}} Experiment
*/

const experimentsUri = process.env.REACT_APP_EXPERIMENTS_SERVICE;
if (!experimentsUri) {
    throw new Error(
        "REACT_APP_EXPERIMENTS_SERVICE environment variable is not passed",
    );
}

/**
 * Gets all projects owned by this user
 * @param {string} authToken
 * @returns {Promise<Array<Object>>}
 */
export const getProjects = async (authToken) => {
    return await get(`${experimentsUri}/projects`, authToken);
};

/**
 * Adds a project if it does not exist and returns the project.
 * If a project already exists, it will return that project
 * @param {String} authToken
 * @param {String} projectName
 */
export const addProjectIfOneDoesNotExist = async (projectName, authToken) => {
    const projects = await getProjects(authToken);
    if (projects.length > 0) return projects[0];
    return await post(`${experimentsUri}/projects`, { projectName }, authToken);
};

/**
 * Gets all experiments owned by this user in the given project
 * @param {string} authToken
 * @param {string} projectId
 * @returns {Promise<Array<Object>>}
 */
export const getExperiments = async (projectId, authToken) => {
    return await get(
        `${experimentsUri}/projects/${projectId}/experiments`,
        authToken,
    );
};

/**
 *
 * Gets experiment
 * @async
 * @param {string} projectId
 * @param {string} experimentName
 * @param {string} authToken
 * @return {Promise<Experiment>}
 */
export const getExperiment = async (projectId, experimentName, authToken) => {
    return (
        await get(
            `${experimentsUri}/projects/${projectId}/experiments/${experimentName}`,
            authToken,
        )
    )[0];
};

/**
 * Adds experiment to the given project id
 * @param {string} projectId
 * @param {Object} experiment
 * @param {string} authToken
 * @returns {Promise<Array<Object>>}
 */
export const addExperiment = async (projectId, experiment, authToken) => {
    return await post(
        `${experimentsUri}/projects/${projectId}/experiments`,
        experiment,
        authToken,
    );
};
