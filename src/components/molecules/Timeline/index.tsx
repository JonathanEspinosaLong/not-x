import React from "react";

import PostView from "../PostView";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { api } from "@/utils/api";

const Timeline = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="absolute right-0 top-0 flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    );

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => <PostView {...fullPost} key={fullPost.id} />)}
    </div>
  );
};

export default Timeline;
