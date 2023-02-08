import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";
import qs = require("qs");

import dotenv = require("dotenv");

dotenv.config();

export const discordRequest = async (
  endpoint: string,
  options: AxiosRequestConfig
): Promise<AxiosResponse> => {
  const baseurl = "https://discord.com/api/v10";

  const url: string = baseurl + endpoint;

  const headers: RawAxiosRequestHeaders = {
    Authorization: `Bot ${process.env.DISCORDTOKEN}`,
    "User-Agent": "MineBot (1.0.0)",
    "Accept-encoding": "*",
  };

  const res: AxiosResponse = await axios.request({
    url,
    headers,
    ...options,
  });

  return res;
};

export type ContainerAction = "start" | "stop" | "status";

const getAuth = async (): Promise<string> => {
  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "https://management.azure.com/.default",
  };

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
  };

  // const data = new FormData();
  // data.append("client_id", CLIENT_ID);
  // data.append("client_secret", CLIENT_SECRET);
  // data.append("grant_type", "client_credentials");
  // data.append("scope", "https://management.azure.com/.default");

  try {
    const response: AxiosResponse = await axios.post(url, qs.stringify(data), {
      headers,
    });
    return response.data["access_token"];
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const dispatchContainerAction = async (
  action: ContainerAction
): Promise<AxiosResponse> => {
  const { SUBSCRIPTION_ID, RESOURCE_GROUP, CONTAINER_GROUP } = process.env;
  const token = await getAuth();

  if (!token) {
    throw new Error("Error with token");
  }

  const headers: RawAxiosRequestHeaders = {
    Authorization: `Bearer ${token}`,
  };

  if (action === "status") {
    const url: string = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ContainerInstance/containerGroups/${CONTAINER_GROUP}?api-version=2022-10-01-preview`;
    return axios.get(url, { headers });
  }

  const url: string = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ContainerInstance/containerGroups/${CONTAINER_GROUP}/${action}?api-version=2022-10-01-preview`;
  return axios.post(url, undefined, { headers });
};

export const requestAction = async (
  action: ContainerAction,
  replyChannel: string
): Promise<AxiosResponse> => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:7071/api/server"
      : `https://minebot.azurewebsites.net/api/server?code=${process.env.FUNCTION_API_KEY}`;

  return axios.post(url, { action, replyChannel });
};
