/* eslint-disable turbo/no-undeclared-env-vars */
import type { HttpRequest } from "@azure/functions";
import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from "discord-interactions";

const CLIENT_PUBLIC_KEY =
  "3431ae3f495eff56aceb9c339ccfa5508dd6ccbd2933b9ee9ed395aeb0d3ca35";

const verifyRequest = async (req: HttpRequest) => {
  const signature: string = req.get("X-Signature-Ed25519")!;
  const timestamp: string = req.get("X-Signature-Timestamp")!;

  return verifyKey(req.rawBody, signature, timestamp, CLIENT_PUBLIC_KEY);
};

export default verifyRequest;
