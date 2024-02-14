import Image from "next/image";
import { useState } from "react";

import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const [input, setInput] = useState<string>("");
  const ctx = api.useUtils();
  const { user } = useUser();

  const { mutate } = api.posts.create.useMutation({
    onSuccess: async () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Start tweeting!"
        className="p grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button
        onClick={() => {
          mutate({ content: input });
        }}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePostWizard;
