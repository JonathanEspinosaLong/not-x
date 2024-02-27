import "@/styles/globals.css";

import { type AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Head>
        <title>Not X</title>
        <meta
          name="google-site-verification"
          content="kLT2-wHzvsYIrhsSunsr1nYidUGSxbaZun5cSYiYXAA"
        />
        <meta name="description" content="🐦" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
