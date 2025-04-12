import axios from "axios";

const Api = axios.create({
  baseURL: "http://schedulo-production.up.railway.app/api",
});

export default Api;
