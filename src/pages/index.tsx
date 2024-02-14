import Head from "next/head";

import Feed from "@/components/molecules/Feed";
import { SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "@components/molecules/CreatePostWizard";
import { api } from "@utils/api";

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching even though data isn't needed here just to have data ready when needed
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center ">
        <div className="h-full w-full border-x border-slate-400  md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {isSignedIn ? (
              <CreatePostWizard />
            ) : (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
