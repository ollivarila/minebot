import { HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import { InteractionType } from "discord-interactions";
import { InteractionResponseType } from "discord.js";
import { ContainerAction, requestAction } from "../utils/requests";

enum DiscordResponseType {
  content,
  embed,
}

const getDiscordResponse = (data: Object, responseType: number): Object => {
  if (responseType === DiscordResponseType.content)
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: data,
      },
    };

  if (responseType === DiscordResponseType.embed) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [data],
      },
    };
  }
};

const handleInteractions = async (req: HttpRequest): Promise<Object> => {
  const { type } = req.body;

  switch (type) {
    case InteractionType.APPLICATION_COMMAND:
      return await handleApplicationCommands(req);
    default:
      break;
  }
};

const handleApplicationCommands = async (req: HttpRequest): Promise<Object> => {
  const { data } = req.body;

  const { name } = data;

  switch (name) {
    case "serverup":
      return await handleServerUp(req);
    case "serverdown":
      return await handleServerDown(req);
    case "getip":
      return await handleGetIp(req);
    case "status":
      return await handleGetStatus(req);
    default:
      break;
  }
};

const doRequest = async (action: ContainerAction): Promise<Object> => {
  try {
    const response: AxiosResponse = await requestAction("start");

    return getDiscordResponse(
      response.data.message,
      DiscordResponseType.content
    );
  } catch (error) {
    return getDiscordResponse(error.message, DiscordResponseType.content);
  }
};

const handleServerUp = async (req: HttpRequest): Promise<Object> => {
  return doRequest("start");
};

const handleServerDown = async (req: HttpRequest): Promise<Object> => {
  return doRequest("stop");
};

const handleGetIp = async (req: HttpRequest): Promise<Object> => {
  try {
    const response: AxiosResponse = await requestAction("status");
    return getDiscordResponse(
      `Server ip: ${response.data.ip}`,
      DiscordResponseType.content
    );
  } catch (error) {
    return getDiscordResponse(error.message, DiscordResponseType.content);
  }
};

const handleGetStatus = async (req: HttpRequest): Promise<Object> => {
  try {
    const response: AxiosResponse = await requestAction("status");

    return getDiscordResponse(
      `Server status: ${response.data.state}\nServer ip: ${response.data.ip}`,
      DiscordResponseType.content
    );
  } catch (error) {
    return getDiscordResponse(error.message, DiscordResponseType.content);
  }
};

export default handleInteractions;
