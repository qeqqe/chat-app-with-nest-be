interface ApiError {
  message: string;
  statusCode: number;
}

const API_URL = "http://localhost:3001";

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw {
        message: result.message || "Registration failed",
        statusCode: response.status,
      } as ApiError;
    }

    return result;
  } catch (error) {
    if ((error as ApiError).statusCode) {
      throw error;
    }
    throw { message: "Network error", statusCode: 500 } as ApiError;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Auth service login response:", result);

    if (!response.ok) {
      throw {
        message: result.message || "Login failed",
        statusCode: response.status,
      } as ApiError;
    }

    document.cookie = `token=${result.access_token}; path=/; max-age=86400`;
    localStorage.setItem("token", `Bearer ${result.access_token}`);
    localStorage.setItem("user", JSON.stringify(result.user));

    return result;
  } catch (error) {
    console.error("Auth service error:", error);
    throw error;
  }
};

export const logout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
