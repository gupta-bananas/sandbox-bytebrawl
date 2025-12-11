import RoomSelector from "./RoomSelector";

export default function App() {
  // Simple unique user id
  const userId = "user-" + Math.random().toString(36).substring(2, 8);

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Code Sandbox</h1>
      <RoomSelector userId={userId} />
    </div>
  );
}