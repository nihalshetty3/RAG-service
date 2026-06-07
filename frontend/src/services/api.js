import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const searchDocuments = async (query) => {
  const response = await api.post("/search", {
    query,
  });

  return response.data;
};