import "@/styles/globals.css";

import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";

import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
