import verifyRequest from "../verifyRequest";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { InteractionResponseType, InteractionType } from "discord-interactions";

const interactionsHandler: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<any> => {
  try {
    const verified = await verifyRequest(req);

    if (!verified) {
      return {
        status: 401,
        body: "invalid request signature",
      };
    }
  } catch (error) {
    return {
      status: 401,
      body: "invalid request signature",
    };
  }

  const { type } = req.body;

  if (type === InteractionType.PING) {
    return {
      body: {
        type: InteractionResponseType.PONG,
      },
    };
  }
};

export default interactionsHandler;
