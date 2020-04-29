import { addProjectIfOneDoesNotExist } from "../api/experiments";

/**
 * If a project does not exist under this user, it creates one and returns the project
 * If a project already exists, it returns the project
 * @param {String} authToken
 */
const initializeProject = async (authToken) => {
    const project = await addProjectIfOneDoesNotExist("My Project", authToken);
    return project;
};

export default initializeProject;
