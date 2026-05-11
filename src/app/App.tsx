import { BrowserRouter } from "react-router-dom";
import { Toaster } from "../shared/components/ui/sonner";
import AppRouter from "./router/AppRouter";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
