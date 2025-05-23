import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store.ts";

const googleClientId = import.meta.env.VITE_GG_CLIENT_ID;
console.log(googleClientId);
if (!googleClientId) {
  console.error("Google Client ID is missing!");
}

createRoot(document.getElementById("root")!).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  ) : (
    <div>Loading...</div>
  )
);
