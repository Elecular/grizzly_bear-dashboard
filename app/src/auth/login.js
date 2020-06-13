import { Auth0Client } from "@auth0/auth0-spa-js";
import { getProjects } from "api/experiments";
import { number } from "prop-types";

//If we are in http and it is not localhost, we must redirect to https 
if(window.location.href.substr(0, 5) !== 'https' && window.location.href.indexOf("localhost") < 0) {
    window.location.href = window.location.href.replace('http', 'https');
}

let auth0 = new Auth0Client({
    domain: "auth.elecular.com",
    client_id: "Pl5MQWjdBJQxxWJ4maJf8p9R5rB9Op1K",
    audience: "http://www.grizzlybear-experiments.com",
    redirect_uri: window.location.origin
});

const login = async () => {
    if(window.location.protocol !== "https:") return;
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        setTokenInLocalStorage(await auth0.getTokenSilently());
        window.history.replaceState({}, document.title, "/");
    }

    const authToken = getTokenFromLocalStorage();
    const isAuthenticated = authToken !== undefined;
    if (!isAuthenticated) {
        await auth0.loginWithRedirect();
    }
    return authToken;
};

export const logout = () => {
    localStorage.removeItem("authToken");
    auth0.logout({
        returnTo: "https://elecular.com"
    })
};

export const forceLogin = () => {
    auth0.loginWithRedirect({
        redirect_uri: window.location.origin,
    });
};

/**
 * @async
 * Is the token valid for the next n number of hours for the given project
 */
export const isAuthTokenValidForProject = async (
    token,
    project,
    numberOfHours = 0,
) => {
    if (!project || !project._id) return false;
    try {
        if (!isAuthTokenValid(token, numberOfHours)) {
            return false;
        }
        const projects = await getProjects(token);
        return projects.find((prj) => prj._id === project._id) !== undefined;
    } catch (err) {
        return false;
    }
};

/**
 * Is the token valid for the next n number of hours
 */
export const isAuthTokenValid = (token, numberOfHours = 0) => {
    try {
        const tokenClaims = JSON.parse(atob(token.split(".")[1]));
        if (
            !tokenClaims.exp ||
            tokenClaims.exp < Date.now() / 1000 + numberOfHours * 3600
        ) {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
};

const setTokenInLocalStorage = (token) => {
    localStorage.setItem("authToken", token);
};

const getTokenFromLocalStorage = () => {
    try {
        const authToken = localStorage.getItem("authToken");
        //If experiation date does not exist or the token is going to expire within 6 hours, we want to treat this is an invalid token.
        return isAuthTokenValid(authToken, 6) ? authToken : undefined;
    } catch (err) {
        return undefined;
    }
};

export default login;
