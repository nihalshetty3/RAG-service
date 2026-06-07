import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchDocuments = async (query) => {
  try {
    const response = await api.post("/search", {
      query,
    });

    return response.data;
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};

export default api;