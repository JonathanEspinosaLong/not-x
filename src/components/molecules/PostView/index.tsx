import type { RouterOutputs } from "@utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

const PostView = (props: PostWithUser) => {
  dayjs.extend(relativeTime);
  const { post, author } = props;

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`${author.username} profile picture`}
        width={56}
        height={56}
        className="h-14 w-14 rounded-full "
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span>·</span>
          <span>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span className="text-lg">{post.content}</span>
      </div>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export default PostView;
