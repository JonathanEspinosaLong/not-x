import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
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
    <div className="flex w-full gap-3  py-3 text-lg">
      <Link href={`/@${user.username}`}>
        <Image
          src={user.imageUrl}
          alt="Profile image"
          className="h-10 w-10 rounded-full transition-opacity hover:opacity-75"
          width={40}
          height={40}
        />
      </Link>
      <input
        placeholder="What is happening?"
        className="grow bg-transparent  outline-none"
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
      <button
        className="flex h-9 w-20 items-center
        justify-center rounded-full bg-sky-500 font-bold
        hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-800 disabled:text-gray-400"
        onClick={() => {
          mutate({ content: input });
        }}
        disabled={isPosting || input === ""}
      >
        {isPosting ? <LoadingSpinner size={20} /> : "Tweet"}
      </button>
    </div>
  );
};

export default CreatePostWizard;
