"use server";

import z from "zod";
import { createRoomSchema } from "../schemas/rooms";
import { getCurrentUser } from "../lib/getCurrentUser";
import { redirect } from "next/navigation";
import { createAdminClient } from "../server";

export async function createRoom(unsafeData: z.infer<typeof createRoomSchema>) {
  const { success, data } = createRoomSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid room data" };
  }

  const user = await getCurrentUser();
  if (user == null) {
    return { error: true, message: "User not authenticated" };
  }

  const supabase = createAdminClient();
  const { data: room, error: roomError } = await (
    await supabase
  )
    .from("chat-room")

    .insert({ name: data.name, is_puplic: data.isPuplic })
    .select("id")
    .single();
  if (roomError || room == null) {
    return { error: true, message: "Failed to create room" };
  }

  const { error: memerShipError } = await (
    await supabase
  )
    .from("chat_room_member")

    .insert({ chat_room_id: room.id, member_id: user.id });
  if (memerShipError) {
    console.error(memerShipError);
    return { error: true, message: "Failed to add user to room" };
  }

  redirect(`/rooms/${room.id} `);
}
