import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AxiosResponse } from "axios";
import { dispatchContainerAction, ContainerAction } from "../utils/requests";

type ContainerState = 'Running' | 'Terminated' | 'Waiting'

const handleServerRequest: AzureFunction = async (context: Context, req: HttpRequest): Promise<Object> => {

  const action: ContainerAction = req.query.name as ContainerAction

  if(!action) {
    return {
      status: 400,
      body: {
        error: "invalid action"
      }
    }
  }

  try {
    const res: AxiosResponse = await dispatchContainerAction(action)
    switch (action) {
      case 'start':
        if(res.status === 202) {
          return {
            body: {
              message: "Server starting"
            }
          }
        }

        if(res.status === 204) {
          return {
            body: {
              message: "Server is already running"
            }
          }
        }
        break
      case "stop":
        if(res.status === 202) {
          return {
              body: {
              message: "Server stopped"
            }
          }
        }
        break
      case "status":
        const { properties } = res.data
        const container = properties.containers.pop()
        const state = container.properties.instanceview.currentState.state
        const ip = properties.ipAdress.ip ? properties.ipAdress.ip : 'not yet assigned'

        return {
          body: {
            state,
            ip
          }
        }
        break
      default:
        return {
          status: 400,
          body: {
            error: "unexpected action"
          }
        }
    }
    
  } catch (error) {
    return {
      status: 500 ,
      body: {
        error: "something went wrong: " + error.message
      }
    }
  }

  

  return {
    status: 500,
    body: {
      error: "something went wrong"
    }
  }

}

export default handleServerRequest