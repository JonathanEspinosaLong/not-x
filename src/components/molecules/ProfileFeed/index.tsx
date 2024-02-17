import React from "react";

import PostView from "../PostView";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { api } from "@/utils/api";

const ProfileFeed = (props: ProfileFeedProps) => {
  const { data, isLoading: postsLoading } = api.posts.getAllByUserId.useQuery({
    userId: props.userId,
  });

  if (postsLoading)
    return (
      <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

type ProfileFeedProps = { userId: string };

export default ProfileFeed;
