import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Sandbox from "./Sandbox";

export default function RoomSelector({ userId }: { userId: string }) {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const createRoom = async () => {
    const newRoomId = "room-" + Math.random().toString(36).substring(2, 8);

    const { error } = await supabase
      .from("live_code_rooms")
      .insert({ room_id: newRoomId });

    if (error) {
      console.error(error);
      return;
    }

    setJoinedRoom(newRoomId);
  };

  const joinRoom = async () => {
    if (!roomId) return;

    const { data } = await supabase
      .from("live_code_rooms")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (data) setJoinedRoom(roomId);
    else alert("Room not found!");
  };

  if (joinedRoom) return <Sandbox roomId={joinedRoom} userId={userId} />;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Join or Create Room</h2>

      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />

      <button onClick={joinRoom}>Join</button>

      <hr />

      <button onClick={createRoom}>Create Room</button>
    </div>
  );
}