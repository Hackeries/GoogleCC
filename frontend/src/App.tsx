import AppRoutes from "./routes";
import { useRealtimeEvents } from "@/hooks/use-realtime-events";

function App() {
  useRealtimeEvents();

  return <AppRoutes />;
}

export default App;
