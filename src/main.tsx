import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./Store/indexStore.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
