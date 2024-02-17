import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import PageDisplay from "@/components/atoms/PageDisplay";
import ProfileFeed from "@/components/molecules/ProfileFeed";
import { generateSsgHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageDisplay>
        <div className="relative h-48 border-slate-300 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username} profile's pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageDisplay>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>,
) {
  const helpers = generateSsgHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug?.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
