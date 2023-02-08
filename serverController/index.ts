import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import { dispatchContainerAction, ContainerAction } from "../utils/requests";

type ContainerState = "Running" | "Terminated" | "Waiting";

const handleServerRequest: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<Object> => {
  const action: ContainerAction = req.body.action as ContainerAction;

  if (!action) {
    return {
      headers: {
        "content-type": "application/json",
      },
      status: 400,
      body: {
        error: "invalid action",
      },
    };
  }

  try {
    const res: any = await dispatchContainerAction(action);

    return {
      headers: {
        "content-type": "application/json",
      },
      body: {
        message: res,
      },
    };

    switch (action) {
      case "start":
        if (res.status === 202) {
          return {
            body: {
              message: "Server starting",
            },
          };
        }

        if (res.status === 204) {
          return {
            body: {
              message: "Server is already running",
            },
          };
        }
        break;
      case "stop":
        if (res.status === 202) {
          return {
            body: {
              message: "Server stopped",
            },
          };
        }
        break;
      case "status":
        const { properties } = res.data;
        const container = properties.containers.pop();
        const state = container.properties.instanceview.currentState.state;
        const ip = properties.ipAdress.ip
          ? properties.ipAdress.ip
          : "not yet assigned";

        return {
          body: {
            state,
            ip,
          },
        };
        break;
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
