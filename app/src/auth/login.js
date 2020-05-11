import { Auth0Client } from "@auth0/auth0-spa-js";

let auth0 = new Auth0Client({
    domain: "grizzly-bear.eu.auth0.com",
    client_id: "Pl5MQWjdBJQxxWJ4maJf8p9R5rB9Op1K",
    audience: "http://www.grizzlybear-experiments.com",
});

const login = async () => {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        setTokenInLocalStorage(await auth0.getTokenSilently());
        window.history.replaceState({}, document.title, "/");
    }

    const authToken = getTokenFromLocalStorage();
    const isAuthenticated = authToken !== undefined;
    if (!isAuthenticated) {
        await auth0.loginWithRedirect({
            redirect_uri: window.location.origin,
        });
    }
    return authToken;
};

export const logout = () => {
    localStorage.removeItem("authToken");
};

export const forceLogin = () => {
    auth0.loginWithRedirect({
        redirect_uri: window.location.origin,
    });
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
        )
            return false;
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
