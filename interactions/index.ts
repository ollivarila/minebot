import verifyRequest from "../verifyRequest";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import handleInteractions from "./interactionHandler";
import { InteractionResponse } from "../types";

const interactionsHandler: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<any> => {
  context.res = {
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    const verified = await verifyRequest(req);

    if (!verified) {
      return {
        headers: {
          "content-type": "application/json",
        },
        status: 401,
        body: "invalid request signature",
      };
    }
  } catch (error) {
    return {
      headers: {
        "content-type": "application/json",
      },
      status: 401,
      body: "invalid request signature",
    };
  }

  const { type } = req.body;

  if (type === InteractionType.PING) {
    return {
      headers: {
        "content-type": "application/json",
      },
      body: {
        type: InteractionResponseType.PONG,
      },
    };
  }

  const body = await handleInteractions(req);
  return {
    headers: {
      "content-type": "application/json",
    },
    body,
  };
};

export default interactionsHandler;
