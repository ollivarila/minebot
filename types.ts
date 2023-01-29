import { InteractionResponseType } from "discord-interactions";

export type InteractionResponse = {
  status: number;
  body: InteractionResponseBody;
};

export type InteractionResponseBody = {
  type: InteractionResponseType | undefined;
  data: InteractionResponseData;
};

export type InteractionResponseData = {
  content: string | undefined;
  embeds: Array<Object> | undefined;
};
