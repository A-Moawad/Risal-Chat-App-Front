import { GoArrowLeft } from "react-icons/go";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SingleChat from "@/components/SingleChat";
import { toast } from "sonner";

interface IFormInput {
  email: string;
}

type Props = {
  addFriendButtonClicked: boolean;
  setAddFriendButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddFriendForm({
  addFriendButtonClicked,
  setAddFriendButtonClicked,
}: Props) {
  const handleArrowLeftClick = () => {
    setAddFriendButtonClicked(false);
  };

  const addFriend = useMutation(api.users.addFriend);
  const friendList = useQuery(api.users.getFriendList);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    toast.promise(addFriend({ friendEmail: data.email }), {
      loading: (
        <div className="bg-blue-500 text-white text-sm w-full px-4 py-3 rounded-md">
          Adding friend...
        </div>
      ),
      success: (
        <div className="bg-green-500 text-white text-sm w-full px-4 py-3 rounded-md">
          Friend added successfully!
        </div>
      ),
      error: (
        <div className="bg-red-500 text-white text-sm w-full  py-3 px-4 rounded-md">
          Failed to add friend. Please try again.
        </div>
      ),
    });
  };

  return (
    <section className="bg-white w-full sm:w-[50%] lg:w-[40%] h-[100vh] px-6 py-8 flex flex-col gap-6 shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <GoArrowLeft
          className="text-xl text-gray-600 cursor-pointer"
          onClick={handleArrowLeftClick}
        />
        <h2 className="text-xl font-bold">New Chat</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter user's email"
          className={`w-full p-3 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 ${
            errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
          } bg-gray-100`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Friend
        </button>
      </form>

      {/* Additional Text */}
      <p className="text-sm text-gray-600 text-center">
        Make sure the email is correct to connect seamlessly.
      </p>

      {/* Friends List */}
      <section>
        <h2 className="text-lg text-gray-500 text-center">Friends List</h2>
        <ul>
          {friendList?.map((friend) => (
            <li key={friend._id}>
              <SingleChat
                name={friend?.name}
                message="hi"
                time="12:00 PM"
                unread={0}
              />
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default AddFriendForm;
