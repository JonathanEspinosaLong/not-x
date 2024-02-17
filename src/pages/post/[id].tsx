import type { GetStaticPropsContext, NextPage } from "next";
import Head from "next/head";

import PageDisplay from "@/components/atoms/PageDisplay";
import PostView from "@/components/molecules/PostView";
import { generateSsgHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";

const PostPage: NextPage<{ id: number }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageDisplay>
        <PostView {...data} />
      </PageDisplay>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const helpers = generateSsgHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  const idNumber = parseInt(id);

  await helpers.posts.getById.prefetch({ id: idNumber });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id: idNumber,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
