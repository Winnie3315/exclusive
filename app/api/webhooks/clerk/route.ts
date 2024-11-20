import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/lib/mongodb"; // Подключение к MongoDB
import User from "@/models/user.model"; // Исправленный путь для импорта модели
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id || "test-id",
      "svix-timestamp": svix_timestamp || "1234567890",
      "svix-signature": svix_signature || "test-signature",
    }) as WebhookEvent;
  } catch (err) {
    console.warn("Skipping signature verification for testing purposes");
    evt = JSON.parse(body) as WebhookEvent;
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log("Received event:", evt);

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      photo: image_url!,
      firstName: first_name,
      lastName: last_name,
    };

    console.log("User created:", user);

    // Подключаемся к MongoDB, если соединение не установлено
    if (mongoose.connection.readyState !== 1) {
      await connect();
    }

    // Сохраняем пользователя в MongoDB
    try {
      const newUser = new User(user);
      await newUser.save();
      console.log("User saved to MongoDB:", newUser);
      return NextResponse.json({ message: "New user created and saved", user: newUser });
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
      return new Response("Error saving user to MongoDB", { status: 500 });
    }
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  return new Response("", { status: 200 });
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook route is working",
    status: "success",
  });
}
