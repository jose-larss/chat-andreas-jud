const API = "http://localhost:8000/api"

export const getCsrfToken = async () => {
    const response = await fetch(`${API}/user/csrf/`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    return data.csrfToken;
};