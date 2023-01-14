import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { registerLicense } from "@syncfusion/ej2-base";
import { ThemeContextProvider } from "./contexts/themeContext";
import { AppConfigContextProvider } from "./contexts/AppConfig.context";
import { UserContextProvider } from "./contexts/CurrentUser.Context";

// Registering Syncfusion license key
registerLicense(
  "ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0dhUX9bcHZWT2JfVEI="
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <UserContextProvider>
            <AppConfigContextProvider>
              <App />
            </AppConfigContextProvider>
          </UserContextProvider>
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
