import { HttpRequest } from "@azure/functions";
import { InteractionType } from "discord-interactions";

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

const handleServerUp = async (req: HttpRequest): Promise<Object> => {};

const handleServerDown = async (req: HttpRequest): Promise<Object> => {};

const handleGetIp = async (req: HttpRequest): Promise<Object> => {};

const handleGetStatus = async (req: HttpRequest): Promise<Object> => {};

export default handleInteractions;
