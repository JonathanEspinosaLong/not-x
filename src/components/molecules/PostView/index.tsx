import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

import type { RouterOutputs } from "@utils/api";

const PostView = (props: PostViewProps) => {
  dayjs.extend(relativeTime);
  const { author, ...post } = props;

  return (
    <Link
      href={`/post/${post.id}`}
      key={post.id}
      className="flex gap-2 border-b border-stone-700 px-4 py-3 transition-all hover:bg-stone-950"
    >
      <Link href={`/@${author.handle}`}>
        <Image
          src={author.profilePictureUrl}
          alt={`${author.handle} profile picture`}
          width={20}
          height={20}
          className="h-10 w-10 rounded-full transition-opacity hover:opacity-75"
        />
      </Link>
      <div className="flex flex-col text-sm">
        <div className="flex gap-1">
          <Link href={`/@${author.handle}`} className="flex gap-1">
            <span className="font-bold hover:underline">{author.username}</span>
            <span className="text-stone-600">{`@${author.handle} ·`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="text-stone-600 hover:underline">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <span className="">{post.content}</span>
      </div>
    </Link>
  );
};

type PostViewProps = RouterOutputs["posts"]["getAll"][number];

export default PostView;
