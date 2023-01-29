/* eslint-disable turbo/no-undeclared-env-vars */
import type { HttpRequest } from "@azure/functions";
import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from "discord-interactions";

const verifyRequest = async (req: HttpRequest) => {
  const signature: string = req.get("X-Signature-Ed25519")!;
  const timestamp: string = req.get("X-Signature-Timestamp")!;

  return verifyKey(
    req.rawBody,
    signature,
    timestamp,
    process.env.CLIENT_PUBLIC_KEY
  );
};

export default verifyRequest;
