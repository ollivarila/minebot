import axios, { AxiosRequestHeaders, AxiosResponse, RawAxiosRequestHeaders } from "axios";

export const discordRequest = async (
  endpoint: string,
  options: Object
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

export type ContainerAction = 'start' | 'stop' | 'status' 


export const dispatchContainerAction = async (action: ContainerAction): Promise<AxiosResponse> => {
  const { SUBSCRIPTION_ID, RESOURCE_GROUP, CONTAINER_GROUP, AUTH_TOKEN } = process.env
  
  const headers: RawAxiosRequestHeaders = {
    Authorization: AUTH_TOKEN
  }

  if(action === 'status') {
  const url: string = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ContainerInstance/containerGroups/${CONTAINER_GROUP}/?api-version=2022-10-01-preview`
  return axios.get(url, { headers })
  }

  const url: string = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ContainerInstance/containerGroups/${CONTAINER_GROUP}/${action}?api-version=2022-10-01-preview`
  return axios.put(url, { headers })
}

export const requestAction = async (action: ContainerAction): Promise<AxiosResponse> => {
  const url = `https://minebot.azurewebsites.net/server/${action}?code=${process.env.FUNCTION_API_KEY}`

  return axios.post(url)
}
