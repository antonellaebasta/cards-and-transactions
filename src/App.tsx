import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { Overview } from "./pages/Overview";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Overview />
  </QueryClientProvider>
);

export default App;
