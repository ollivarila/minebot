import { HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import { InteractionType } from "discord-interactions";
import { requestAction } from "../utils/requests";



enum DiscordResponseType {
  content,
  embed
}

const getDiscordResponse = (data: Object, responseType: number): Object => {

  if(responseType === DiscordResponseType.content)
  return {
    body: {
      data: {
        content: data
      }
    }
  }

  if(responseType === DiscordResponseType.embed) {
    return {
      body: {
        data: {
          embeds: [data]
        }
      }

    }
  }

} 

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

const handleServerUp = async (req: HttpRequest): Promise<Object> => {
  const response: AxiosResponse = await requestAction('start')

};

const handleServerDown = async (req: HttpRequest): Promise<Object> => {
  const response: AxiosResponse = await requestAction('stop')

  
};

const handleGetIp = async (req: HttpRequest): Promise<Object> => {
  const response: AxiosResponse = await requestAction('status')
  
};

const handleGetStatus = async (req: HttpRequest): Promise<Object> => {
  const response: AxiosResponse = await requestAction('status')
  

};

export default handleInteractions;
