import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
