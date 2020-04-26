import createAuth0Client from "@auth0/auth0-spa-js";

const authDomain = "grizzly-bear.eu.auth0.com";
const authClientId = "Pl5MQWjdBJQxxWJ4maJf8p9R5rB9Op1K";
let auth0 = null;

export default () => {
    window.onload = async () => {
        auth0 = await createAuth0Client({
            domain: authDomain,
            client_id: authClientId,
        });
    };
};
