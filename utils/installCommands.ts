import { AxiosResponse } from "axios";
import commands from "../interactions/commands";
import { discordRequest } from "./requests";

const updateGlobalCommands = async (): Promise<void> => {
  const endpoint = `/applications/${process.env.APPID}/commands`;
  console.log("Updating commands...");

  const response: AxiosResponse = await discordRequest(endpoint, {
    method: "put",
    data: commands,
  });

  const updatedCommands: Array<any> = response.data;

  if (!updatedCommands) {
    console.error("Error updating commands");
    process.exit(1);
  }

  if (updatedCommands.length === commands.length) {
    console.log("Commands updated succesfully!");
  }
  process.exit(0);
};

updateGlobalCommands();
