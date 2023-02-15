import { HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import { InteractionType } from "discord-interactions";
import { InteractionResponseType } from "discord.js";
import { ContainerAction, requestAction } from "../utils/requests";

enum DiscordResponseType {
  content,
  embed,
}

const authorizedUsers = [
  "188329879861723136",
  "209654420999241728",
  "208247677585063936",
  "430991331880337408",
  "182935119625977867",
  "405711174668124160",
];

const getDiscordResponse = (
  data: Object | string,
  responseType: number
): Object => {
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

const checkIfAuthorized = (req: HttpRequest): boolean => {
  const requesterId = req.body.member.user.id;
  let auth = false;
  authorizedUsers.forEach((userId) => {
    if (userId === requesterId) {
      auth = true;
    }
  });
  return auth;
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

const doRequest = async (
  action: ContainerAction,
  replyChannel: string
): Promise<Object> => {
  try {
    requestAction(action, replyChannel);

    const message =
      action === "start" ? "Server starting..." : "Stopping server...";

    return getDiscordResponse(message, DiscordResponseType.content);
  } catch (error) {
    return getDiscordResponse(error.message, DiscordResponseType.content);
  }
};

const handleServerUp = async (req: HttpRequest): Promise<Object> => {
  if (!checkIfAuthorized(req)) {
    return getDiscordResponse(
      "You are not authorized!",
      DiscordResponseType.content
    );
  }

  const replyChannel = req.body.channel_id;

  return doRequest("start", replyChannel);
};

const handleServerDown = async (req: HttpRequest): Promise<Object> => {
  if (!checkIfAuthorized(req)) {
    return getDiscordResponse(
      "You are not authorized!",
      DiscordResponseType.content
    );
  }

  const replyChannel = req.body.channel_id;

  return doRequest("stop", replyChannel);
};

const handleGetIp = async (req: HttpRequest): Promise<Object> => {
  try {
    const response: AxiosResponse = await requestAction("status", undefined);
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
    const response: AxiosResponse = await requestAction("status", undefined);

    return getDiscordResponse(
      `Server status: ${response.data.state}\nServer ip: ${response.data.ip}`,
      DiscordResponseType.content
    );
  } catch (error) {
    return getDiscordResponse(error.message, DiscordResponseType.content);
  }
};

export default handleInteractions;
