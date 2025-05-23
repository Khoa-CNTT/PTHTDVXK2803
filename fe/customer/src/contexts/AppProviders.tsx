import React, { ReactNode } from "react";
import { ModalProvider } from "./ModalContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "../store/store";

const queryClient = new QueryClient();
interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ModalProvider>{children}</ModalProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default AppProviders;
