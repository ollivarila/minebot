import axios, { AxiosResponse, RawAxiosRequestHeaders } from "axios";

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
