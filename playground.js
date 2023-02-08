import { ContainerInstanceManagementClient } from "@azure/arm-containerinstance";
import { DefaultAzureCredential } from "@azure/identity";
import { setLogLevel } from "@azure/logger";
import dotenv from "dotenv";

setLogLevel("info");
dotenv.config();

const subscriptionId = process.env.SUBSCRIPTION_ID;
const client = new ContainerInstanceManagementClient(
  new DefaultAzureCredential(),
  subscriptionId
);
const list = await client.containerGroups.get(
  process.env.RESOURCE_GROUP,
  process.env.CONTAINER_GROUP
);
console.log(list);
