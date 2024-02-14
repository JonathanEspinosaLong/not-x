import { useUser } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;
  console.log(user.id);

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.imageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Start tweeting!"
        className="p grow bg-transparent outline-none"
      />
    </div>
  );
};

export default CreatePostWizard;
