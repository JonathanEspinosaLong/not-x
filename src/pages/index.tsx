import PageDisplay from "@/components/atoms/PageDisplay";
import Timeline from "@/components/molecules/Timeline";
import { SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "@components/molecules/CreatePostWizard";
import { api } from "@utils/api";

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching even though data isn't needed here just to have data ready when needed
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageDisplay>
      <div className="flex border-b border-stone-700 px-4">
        {isSignedIn ? (
          <CreatePostWizard />
        ) : (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
      </div>
      <Timeline />
    </PageDisplay>
  );
}
