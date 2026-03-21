import api from "./api";

const register = (username, email, password, role) => {
    return api.post("/auth/signup", {
        username,
        email,
        password,
        role
    }).catch(error => {
        console.error("AuthService registration error:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
        }
        throw error;
    });
};

const login = (email, password) => {
    return api
        .post("/auth/signin", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        console.warn("Invalid user session data in localStorage, clearing it.");
        localStorage.removeItem("user");
        return null;
    }
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
