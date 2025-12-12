import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Sandbox from "./Sandbox";

export default function RoomSelector({ userId }: { userId: string }) {
  const [roomId, setRoomId] = useState(-1);
  const [joinedRoom, setJoinedRoom] = useState<number | -1>(-1);

  const createRoom = async () => {
    const newRoomId = Number(Math.floor(Math.random() * 899999 + 100000));

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
    if (roomId === -1) return;

    const { data } = await supabase
      .from("live_code_rooms")
      .select("*")
      .eq("room_id", roomId)
      .single();

    if (data) setJoinedRoom(roomId);
    else alert("Room not found!");
  };

  if (joinedRoom !== -1) return <Sandbox roomId={joinedRoom} userId={userId} />;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Join or Create Room</h2>

      <input
        type="number"
        value={roomId === -1 || roomId === 0 ? "" : roomId.toString()}
        onChange={(e) => setRoomId(Number(e.target.value))}
        placeholder="Room ID"
      />

      <button onClick={joinRoom}>Join</button>

      <hr />

      <button onClick={createRoom}>Create Room</button>
    </div>
  );
}