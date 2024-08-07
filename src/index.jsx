import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import theme from "styles/theme";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import LoadingSpinner from "components/layout/LoadingSpinner";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider theme={theme}>
        <LoadingSpinner />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </PersistGate>
  </Provider>,
);
