import { useState } from "react";

import Image from "next/image";
import toast from "react-hot-toast";

import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useUser } from "@clerk/nextjs";
import { api } from "@utils/api";

const CreatePostWizard = () => {
  const [input, setInput] = useState<string>("");
  const ctx = api.useUtils();
  const { user } = useUser();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) toast.error(errorMessage[0]);
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
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mutate({ content: input });
          }
        }}
      />
      {input !== "" && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
          disabled={isPosting}
        >
          {isPosting ? <LoadingSpinner size={20} /> : "Post"}
        </button>
      )}
    </div>
  );
};

export default CreatePostWizard;
