import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";

import { db } from "@/server/db";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occurred -- no svix headers" });
  }

  // Get the body
  const body = (await buffer(req)).toString();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return res.status(400).json({ Error: err });
  }

  // Get the ID and type
  const { id, username, image_url } = evt.data as UserJSON;

  await db.user.upsert({
    where: { externalId: id },
    create: {
      externalId: id,
      username: username ?? id,
      profilePictureUrl: image_url,
    },
    update: {
      username: username ?? id,
      profilePictureUrl: image_url,
    },
  });

  return res.status(200).json({ response: "Success" });
}
