import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import {
  discordRequest,
  dispatchContainerAction,
  ContainerAction,
} from "../utils/requests";

type ContainerState = "Running" | "Terminated" | "Waiting";

const sendReplyToChannel = async (
  message: string,
  channelId: string
): Promise<void> => {
  const endpoint: string = `/channels/${channelId}/messages`;
  const res = await discordRequest(endpoint, {
    method: "POST",
    data: { content: message },
  });
  console.log(res);
};

const handleServerRequest: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<Object> => {
  const action: ContainerAction = req.body.action as ContainerAction;

  const replyChannel: string = req.body.replyChannel;

  console.log(replyChannel, action);

  if (!action) {
    return {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
      body: {
        error: "action required",
      },
    };
  }
  const res: AxiosResponse = await dispatchContainerAction(action);

  console.log(res);

  try {
    switch (action) {
      case "start":
        if (res.status === 202) {
          sendReplyToChannel(
            "Server startup confirmed \n Please wait a moment before joining",
            replyChannel
          );
        }

        if (res.status === 204) {
          sendReplyToChannel("Server is already running", replyChannel);
        }

        return {
          status: 200,
        };
      case "stop":
        return {
          status: 200,
        };
      case "status":
        const { properties } = res.data;
        const container = properties.containers.pop();
        const state = container.properties.instanceView.currentState.state;
        let ip = "not yet assigned";

        if (state !== "Terminated") {
          ip = properties.ipAddress.ip;
        }

        return {
          body: {
            state,
            ip,
          },
        };
      default:
        return {
          headers: {
            "content-type": "application/json",
          },
          status: 400,
          body: {
            error: "unexpected action",
          },
        };
    }
  } catch (error) {
    console.error(error);
    return {
      headers: {
        "content-type": "application/json",
      },
      status: 500,
      body: {
        error: "something went wrong: " + error.message,
      },
    };
  }
};

export default handleServerRequest;
