import axios from "axios";

export default function useBackend() {
  function apiCall() {
    axios.get("http://localhost:5000");
  }
  return { apiCall };
}
