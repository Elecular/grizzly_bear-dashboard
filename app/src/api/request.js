export const get = async (url, authToken = undefined) => {
    if (!authToken) {
        console.warn(
            `Auth token is undefined when making GET request to ${url}`,
        );
    }
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : undefined,
        },
    });
    if (res.status >= 400) {
        throw {
            httpError: true,
            status: res.status,
            message: res.text(),
        };
    }
    return await res.json();
};

export const post = async (url, data, authToken = undefined) => {
    if (!authToken) {
        console.warn(
            `Auth token is undefined when making POST request to ${url}`,
        );
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : undefined,
        },
        body: JSON.stringify(data),
    });
    if (res.status >= 400) {
        throw {
            httpError: true,
            status: res.status,
            message: res.text(),
        };
    }
    return await res.json();
};
